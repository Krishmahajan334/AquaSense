// Areas Management Logic for AquaSense

let currentData = null;
let currentModalArea = null;
let currentHoverArea = null;
let serverAutoMode = false;

async function fetchAreaData() {
    try {
        const response = await fetch('/api/data?_t=' + Date.now());
        const data = await response.json();
        currentData = data;
        updateUI(data);
    } catch (err) {
        console.error('Failed to fetch area data:', err);
    }
}

function updateUI(data) {
    if (!data.areas) return;

    // Sync Auto Mode Switch
    const autoModeToggle = document.getElementById('auto-mode-toggle');
    if (autoModeToggle && data.auto_mode !== serverAutoMode) {
        serverAutoMode = data.auto_mode;
        autoModeToggle.checked = serverAutoMode;
    }

    const areas = ['kitchen', 'bathroom', 'garden'];
    
    // Sync SVG Pipes and Valves
    togglePipe('pipe-input', data.main_input_flow > 0.1);
    const isHeaderActive = data.total_output_flow > 0.1;
    togglePipe('pipe-output-main', isHeaderActive);
    togglePipe('pipe-header-left', isHeaderActive);
    togglePipe('pipe-header-right', isHeaderActive);

    // Update Tank Viz in SVG
    if (data.tank_level !== undefined) {
        const tankVizText = document.getElementById('tank-viz-text');
        const tankWaterFill = document.getElementById('tank-water-fill');
        if (tankVizText) tankVizText.textContent = data.tank_level.toFixed(0) + '%';
        if (tankWaterFill) {
            tankWaterFill.style.height = data.tank_level + '%';
            if (data.tank_level < 20) tankWaterFill.style.background = 'linear-gradient(180deg, #ef4444, #b91c1c)';
            else if (data.tank_level < 50) tankWaterFill.style.background = 'linear-gradient(180deg, #f59e0b, #d97706)';
            else tankWaterFill.style.background = 'linear-gradient(180deg, #38bdf8, #0284c7)';
        }
    }

    areas.forEach(areaId => {
        const area = data.areas[areaId];
        if (!area) return;

        // Update Schema SVG
        const dot = document.getElementById(`dot-${areaId}`);
        togglePipe(`pipe-${areaId}-top`, isHeaderActive);
        togglePipe(`pipe-${areaId}-bottom`, area.flow_rate > 0.1);
        if (dot) {
            if (area.valve_open) dot.classList.add('open');
            else dot.classList.remove('open');
        }

        // Update Stats in Cards
        const flowEl = document.getElementById(`flow-${areaId}`);
        const usageEl = document.getElementById(`usage-${areaId}`);
        const savedEl = document.getElementById(`saved-${areaId}`);
        
        if (flowEl) flowEl.textContent = area.flow_rate.toFixed(1);
        if (usageEl) usageEl.textContent = area.water_usage.toFixed(1);
        if (savedEl) savedEl.textContent = (data.total_water_saved / 3).toFixed(1);

        // High Consumption Color Indication Sync
        const areaCard = document.getElementById(`area-${areaId}`);
        if (areaCard) {
            if (area.flow_rate > 10 || area.water_usage > 50) {
                areaCard.classList.add('area-high-consumption');
            } else {
                areaCard.classList.remove('area-high-consumption');
            }
        }

        // Update Valve Status indicators
        const statusInd = document.getElementById(`detail-ind-${areaId}`);
        const btn = document.getElementById(`btn-${areaId}`);
        
        if (area.valve_open) {
            if (statusInd) {
                statusInd.textContent = "Valve: OPEN";
                statusInd.className = "valve-indicator open";
            }
            if (btn) {
                btn.textContent = "Emergency Close";
                btn.className = "action-btn danger btn-full";
            }
        } else {
            if (statusInd) {
                statusInd.textContent = "Valve: CLOSED";
                statusInd.className = "valve-indicator closed";
            }
            if (btn) {
                btn.textContent = "Open Valve";
                btn.className = "action-btn success btn-full";
            }
        }

        // Update Aeration Slider if not being manually dragged
        const slider = document.getElementById(`slider-${areaId}`);
        const valLabel = document.getElementById(`val-${areaId}`);
        
        if (slider && document.activeElement !== slider) {
            slider.value = area.aeration;
            if (valLabel) valLabel.textContent = `${area.aeration}%`;
        }

        // Update Modal if currently viewing this area
        if (currentModalArea === areaId) {
            document.getElementById('modal-flow').textContent = area.flow_rate.toFixed(1);
            const modalBtn = document.getElementById('modal-valve-btn');
            if (area.valve_open) {
                modalBtn.textContent = 'Close Valve';
                modalBtn.className = 'action-btn danger btn-full';
            } else {
                modalBtn.textContent = 'Open Valve';
                modalBtn.className = 'action-btn success btn-full';
            }
            
            const modalSlider = document.getElementById('modal-aeration');
            if (document.activeElement !== modalSlider) {
                modalSlider.value = area.aeration || 0;
                document.getElementById('modal-aeration-label').textContent = `${area.aeration || 0}%`;
            }
        }
    });

    // Update live tooltip if active
    if (currentHoverArea) {
        updateTooltipContent(currentHoverArea);
    }
}

// Interaction Functions
function togglePipe(id, isActive) {
    const pipe = document.getElementById(id);
    const ref1 = document.getElementById(id + '-ref');
    const ref2 = document.getElementById(id + '-ref-2');
    const ref3 = document.getElementById(id + '-ref-3');
    
    [pipe, ref1, ref2, ref3].forEach(el => {
        if (el) {
            if (isActive) el.classList.add('active');
            else el.classList.remove('active');
        }
    });
}

function showValveTooltip(area, event) {
    if (!currentData || !currentData.areas || !currentData.areas[area]) return;
    currentHoverArea = area;
    updateTooltipContent(area);
    const tooltip = document.getElementById('valve-tooltip');
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';
    const padding = 15;
    tooltip.style.left = (event.clientX + padding) + 'px';
    tooltip.style.top = (event.clientY + padding) + 'px';
}

function updateTooltipContent(area) {
    if (!currentData || !currentData.areas || !currentData.areas[area]) return;
    const areaData = currentData.areas[area];
    document.getElementById('tt-name').textContent = area.charAt(0).toUpperCase() + area.slice(1);
    document.getElementById('tt-flow').textContent = areaData.flow_rate.toFixed(1);
    document.getElementById('tt-aeration').textContent = areaData.aeration;
}

function hideValveTooltip() {
    currentHoverArea = null;
    const tooltip = document.getElementById('valve-tooltip');
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
}

function openValveControl(area) {
    currentModalArea = area;
    const modal = document.getElementById('control-modal');
    const title = document.getElementById('modal-title');
    title.textContent = area.charAt(0).toUpperCase() + area.slice(1) + " Control";
    modal.style.display = 'flex';
    fetchAreaData();
}

function closeModal() {
    currentModalArea = null;
    document.getElementById('control-modal').style.display = 'none';
}

// Close modal when clicking outside (backdrop)
window.addEventListener('click', (event) => {
    const modal = document.getElementById('control-modal');
    if (event.target == modal) {
        closeModal();
    }
});

function updateModalAerationLabel(val) {
    document.getElementById('modal-aeration-label').textContent = `${val}%`;
}

async function saveModalAeration() {
    if (!currentModalArea) return;
    const val = document.getElementById('modal-aeration').value;
    await setAreaAeration(currentModalArea, val);
}

function toggleModalValve() {
    if (!currentModalArea) return;
    toggleAreaValve(currentModalArea);
}

// Control Actions
async function toggleAreaValve(areaId) {
    if (!currentData || !currentData.areas[areaId]) return;
    const newState = !currentData.areas[areaId].valve_open;
    try {
        await fetch('/api/control', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ area: areaId, valve: newState })
        });
        fetchAreaData();
    } catch (err) {
        console.error('Failed to toggle valve:', err);
    }
}

async function setAreaAeration(areaId, value) {
    try {
        await fetch('/api/control', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ area: areaId, aeration: parseInt(value) })
        });
    } catch (err) {
        console.error('Failed to set aeration:', err);
    }
}

// Auto Mode Switch Listener
document.addEventListener('DOMContentLoaded', () => {
    const autoModeToggle = document.getElementById('auto-mode-toggle');
    if (autoModeToggle) {
        autoModeToggle.addEventListener('change', async (e) => {
            try {
                await fetch('/api/control', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ auto_mode: e.target.checked })
                });
                fetchAreaData();
            } catch (err) {
                console.error(err);
                e.target.checked = !e.target.checked;
            }
        });
    }
});

// Initial fetch and start interval
fetchAreaData();
setInterval(fetchAreaData, 1000);

// Mobile Sidebar Logic
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (menuToggle && sidebar && sidebarOverlay) {
        const toggleSidebar = () => {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        };

        menuToggle.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }
});
