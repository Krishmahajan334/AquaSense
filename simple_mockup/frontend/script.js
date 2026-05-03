// DOM Elements
const waterUsageEl = document.getElementById('water-usage-val');
const flowRateEl = document.getElementById('flow-rate-val');
const systemStatusText = document.getElementById('system-status-text');
const statusIndicator = document.querySelector('.status-indicator');
const alertsList = document.getElementById('alerts-list');
const autoModeToggle = document.getElementById('auto-mode-toggle');

// Areas defined in HTML
const areas = ['kitchen', 'bathroom', 'garden'];

// App State
let isOffline = false;
let lastUpdate = Date.now();
let serverAutoMode = false;
let currentModalArea = null;
let currentHoverArea = null;
let lastData = null;

// Chart.js Premium Initialization (Recharts style)
const ctx = document.getElementById('flowChart').getContext('2d');

// Create gradients
const gradientIn = ctx.createLinearGradient(0, 0, 0, 250);
gradientIn.addColorStop(0, 'rgba(16, 185, 129, 0.5)');
gradientIn.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

const gradientOut = ctx.createLinearGradient(0, 0, 0, 250);
gradientOut.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
gradientOut.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

const flowChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array(20).fill(''),
        datasets: [
            {
                label: 'Main Input Flow',
                borderColor: '#10b981',
                backgroundColor: gradientIn,
                data: Array(20).fill(0),
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#10b981'
            },
            {
                label: 'Total Output Flow',
                borderColor: '#3b82f6',
                backgroundColor: gradientOut,
                data: Array(20).fill(0),
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#3b82f6'
            },
            {
                label: 'Kitchen Flow',
                borderColor: '#f59e0b',
                backgroundColor: 'transparent',
                data: Array(20).fill(0),
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0
            },
            {
                label: 'Bathroom Flow',
                borderColor: '#8b5cf6',
                backgroundColor: 'transparent',
                data: Array(20).fill(0),
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0
            },
            {
                label: 'Garden Flow',
                borderColor: '#ef4444',
                backgroundColor: 'transparent',
                data: Array(20).fill(0),
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0,
                
                
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400, easing: 'easeOutQuart' },
        interaction: { mode: 'index', intersect: false },
        scales: {
            y: { 
                beginAtZero: true, 
                grid: { color: 'rgba(255,255,255,0.02)', drawBorder: false }, 
                ticks: { color: '#6b7280', padding: 10, font: { family: 'Outfit', size: 11 } } 
            },
            x: { 
                grid: { display: false, drawBorder: false },
                ticks: { color: '#6b7280', maxRotation: 0, font: { family: 'Outfit', size: 10 } }
            }
        },
        plugins: { 
            legend: { 
                position: 'top',
                align: 'end',
                labels: { color: '#9ca3af', usePointStyle: true, boxWidth: 8, font: { family: 'Outfit' } } 
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: { family: 'Outfit', size: 13 },
                bodyFont: { family: 'Outfit', size: 12 },
                padding: 12,
                cornerRadius: 8,
                displayColors: true
            }
        }
    }
});

// Fetch data from Python backend
async function fetchSystemData() {
    try {
        const response = await fetch('/api/data?_t=' + Date.now());
        if (!response.ok) throw new Error('Network error');
        
        const data = await response.json();
        updateDashboard(data);
        
        if (isOffline) {
            isOffline = false;
            statusIndicator.classList.remove('offline');
            systemStatusText.textContent = 'System Active';
        }
        
        lastUpdate = Date.now();
    } catch (error) {
        console.error('Error fetching data:', error);
        if (Date.now() - lastUpdate > 5000 && !isOffline) {
            isOffline = true;
            statusIndicator.classList.add('offline');
            systemStatusText.textContent = 'System Offline';
            flowRateEl.textContent = '0.00';
            
            // Set all areas to 0 on offline
            areas.forEach(a => {
                document.getElementById(`flow-${a}`).textContent = '0.0';
            });
        }
    }
}

function updateDashboard(data) {
    lastData = data;
    // Totals
    waterUsageEl.textContent = data.total_water_usage.toFixed(2);
    flowRateEl.textContent = data.total_output_flow.toFixed(2);
    
    if (data.total_water_saved !== undefined) {
        document.getElementById('water-saved-val').textContent = data.total_water_saved.toFixed(2);
    }
    
    // Tank Level & Supply & Chart Updates
    if (data.tank_level !== undefined) {
        document.getElementById('tank-level-val').textContent = data.tank_level.toFixed(1);
        document.getElementById('tank-viz-text').textContent = data.tank_level.toFixed(0) + '%';
        document.getElementById('tank-water-fill').style.height = data.tank_level + '%';
        
        const tankIcon = document.getElementById('tank-icon-container');
        if (data.tank_level < 20) {
            if(tankIcon) tankIcon.className = 'card-icon danger';
            document.getElementById('tank-water-fill').style.background = 'linear-gradient(180deg, #ef4444, #b91c1c)';
        } else if (data.tank_level < 50) {
            if(tankIcon) tankIcon.className = 'card-icon warning';
            document.getElementById('tank-water-fill').style.background = 'linear-gradient(180deg, #f59e0b, #d97706)';
        } else {
            if(tankIcon) tankIcon.className = 'card-icon primary';
            document.getElementById('tank-water-fill').style.background = 'linear-gradient(180deg, #38bdf8, #0284c7)';
        }
    }
    
    // Update Chart
    const inputFlow = data.main_input_flow !== undefined ? data.main_input_flow : 0;
    const outputFlow = data.total_output_flow !== undefined ? data.total_output_flow : 0;
    
    flowChart.data.datasets[0].data.shift();
    flowChart.data.datasets[0].data.push(inputFlow);
    flowChart.data.datasets[1].data.shift();
    flowChart.data.datasets[1].data.push(outputFlow);
    
    if (data.areas) {
        flowChart.data.datasets[2].data.shift();
        flowChart.data.datasets[2].data.push(data.areas['kitchen']?.flow_rate || 0);
        flowChart.data.datasets[3].data.shift();
        flowChart.data.datasets[3].data.push(data.areas['bathroom']?.flow_rate || 0);
        flowChart.data.datasets[4].data.shift();
        flowChart.data.datasets[4].data.push(data.areas['garden']?.flow_rate || 0);
    }
    
    flowChart.update();
    
    if (data.supply_available !== undefined) {
        const supplyVal = document.getElementById('supply-status-val');
        const supplyIcon = document.getElementById('supply-icon-container');
        if (data.supply_available) {
            supplyVal.textContent = 'Available';
            supplyIcon.className = 'card-icon success';
        } else {
            supplyVal.textContent = 'Not Available';
            supplyVal.style.color = 'var(--danger)';
            supplyIcon.className = 'card-icon danger';
        }
    }
    
    // Smart Suggestions
    if (data.suggestions && data.suggestions.length > 0) {
        document.getElementById('suggestion-msg').textContent = data.suggestions[data.suggestions.length - 1];
    }
    
    // Auto Mode UI alignment with Server State
    if (data.auto_mode !== serverAutoMode) {
        serverAutoMode = data.auto_mode;
        autoModeToggle.checked = serverAutoMode;
    }
    
    // Update individual areas
    if (data.areas) {
        // Sync SVG Pipes and Valves
        // Sync SVG Pipes and Valves
        togglePipe('pipe-input', data.main_input_flow > 0.1);

        const isHeaderActive = data.total_output_flow > 0.1;
        togglePipe('pipe-output-main', isHeaderActive);
        togglePipe('pipe-header-left', isHeaderActive);
        togglePipe('pipe-header-right', isHeaderActive);

        areas.forEach(area => {
            const areaData = data.areas[area];
            if (areaData) {
                // Update Schema SVG
                const dot = document.getElementById(`dot-${area}`);
                
                // Top segment (junction to valve) shows flow if header is active (pressure)
                togglePipe(`pipe-${area}-top`, isHeaderActive);

                // Bottom segment (valve to outlet) only shows flow if flow_rate > 0
                togglePipe(`pipe-${area}-bottom`, areaData.flow_rate > 0.1);
                
                if (areaData.valve_open) {
                    dot.classList.add('open');
                } else {
                    dot.classList.remove('open');
                }

                // Update Modal if currently viewing this area
                if (currentModalArea === area) {
                    document.getElementById('modal-flow').textContent = areaData.flow_rate.toFixed(1);
                    const modalBtn = document.getElementById('modal-valve-btn');
                    if (areaData.valve_open) {
                        modalBtn.textContent = 'Close Valve';
                        modalBtn.className = 'action-btn danger btn-full';
                    } else {
                        modalBtn.textContent = 'Open Valve';
                        modalBtn.className = 'action-btn success btn-full';
                    }
                    
                    // Update slider if user isn't touching it
                    const modalSlider = document.getElementById('modal-aeration');
                    if (document.activeElement !== modalSlider) {
                        modalSlider.value = areaData.aeration || 0;
                        document.getElementById('modal-aeration-label').textContent = `${areaData.aeration || 0}%`;
                    }
                }

                // Update Cards (fallback/detailed view)
                document.getElementById(`flow-${area}`).textContent = areaData.flow_rate.toFixed(1);
                document.getElementById(`usage-${area}`).textContent = areaData.water_usage.toFixed(1);
                
                const areaCard = document.getElementById(`area-${area}`);
                if (areaCard) {
                    if (areaData.flow_rate > 10 || areaData.water_usage > 50) {
                        areaCard.classList.add('area-high-consumption');
                    } else {
                        areaCard.classList.remove('area-high-consumption');
                    }
                }
                
                const slider = document.getElementById(`slider-${area}`);
                const ind = document.getElementById(`ind-${area}`);
                const aerationVal = areaData.aeration || 0;
                
                if (document.activeElement !== slider) {
                    slider.value = aerationVal;
                    ind.textContent = `Aeration: ${aerationVal}%`;
                }

                const btn = document.getElementById(`btn-${area}`);
                const isOpen = areaData.valve_open;
                
                if (isOpen) {
                    btn.textContent = 'Close Valve';
                    btn.className = 'action-btn danger btn-full';
                } else {
                    btn.textContent = 'Open Valve';
                    btn.className = 'action-btn success btn-full';
                }
                
                if (!isOpen) {
                    ind.className = 'valve-indicator closed';
                    ind.textContent = 'Valve Closed';
                } else if (aerationVal > 80) {
                    ind.className = 'valve-indicator closed';
                } else if (aerationVal > 30) {
                    ind.className = 'valve-indicator';
                    ind.style.color = 'var(--warning)';
                } else {
                    ind.className = 'valve-indicator open';
                    ind.style.removeProperty('color');
                }
            }
        });
    }
    
    // Update alerts
    updateAlertsList(data.alerts);
    
    // Update live tooltip if active
    if (currentHoverArea) {
        updateTooltipContent(currentHoverArea);
    }
}

function updateAlertsList(alerts) {
    if (!alerts || alerts.length === 0) return;
    alertsList.innerHTML = ''; 
    alerts.forEach(msg => {
        const li = document.createElement('li');
        li.className = 'alert-item';
        if (msg.includes('⚠️') || msg.toLowerCase().includes('high flow') || msg.toLowerCase().includes('leak')) {
            li.innerHTML = `<span style="color: var(--danger)">${msg}</span>`;
        } else if (msg.includes('System') || msg.includes('auto') || msg.includes('Auto')) {
            li.innerHTML = `<span style="color: var(--primary)">${msg}</span>`;
        } else {
            li.textContent = msg;
        }
        alertsList.appendChild(li);
    });
}

// Toggle logic for auto mode switch
autoModeToggle.addEventListener('change', async (e) => {
    try {
        await fetch('/api/control', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ auto_mode: e.target.checked })
        });
        fetchSystemData();
    } catch (err) {
        console.error(err);
        e.target.checked = !e.target.checked; // Revert UI
    }
});

// Set Aeration logic per area
async function setAeration(area, value) {
    const slider = document.getElementById(`slider-${area}`);
    const originalValue = slider.defaultValue; // Simplified
    
    try {
        await fetch('/api/control', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ area: area, aeration: parseInt(value) })
        });
    } catch (e) {
        console.error(`Failed to set aeration for ${area}`, e);
    }
}

// Valve control logic per area
async function toggleValve(area) {
    const btn = document.getElementById(`btn-${area}`);
    const isCurrentlyOpen = btn.textContent.includes('Close');
    const newState = !isCurrentlyOpen;
    
    btn.disabled = true;
    btn.textContent = 'Updating...';
    
    try {
        await fetch('/api/control', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ area: area, valve: newState })
        });
        fetchSystemData();
    } catch (e) {
        console.error(`Failed to toggle valve for ${area}`, e);
    } finally {
        btn.disabled = false;
    }
}

// Modal Control Functions
function openValveControl(area) {
    currentModalArea = area;
    const modal = document.getElementById('control-modal');
    const title = document.getElementById('modal-title');
    
    title.textContent = area.charAt(0).toUpperCase() + area.slice(1) + " Control";
    modal.style.display = 'flex';
    
    // Initial population will happen in next updateDashboard tick, 
    // but we can trigger one fetch now for responsiveness
    fetchSystemData();
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

function saveModalAeration() {
    if (!currentModalArea) return;
    const val = document.getElementById('modal-aeration').value;
    setAeration(currentModalArea, val);
}

function toggleModalValve() {
    if (!currentModalArea) return;
    toggleValve(currentModalArea);
}

// Animation Helper
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

// Tooltip Functions
function showValveTooltip(area, event) {
    if (!lastData || !lastData.areas || !lastData.areas[area]) return;
    
    currentHoverArea = area;
    updateTooltipContent(area);
    
    const tooltip = document.getElementById('valve-tooltip');
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';
    
    // Position tooltip near mouse
    const padding = 15;
    tooltip.style.left = (event.clientX + padding) + 'px';
    tooltip.style.top = (event.clientY + padding) + 'px';
}

function updateTooltipContent(area) {
    if (!lastData || !lastData.areas || !lastData.areas[area]) return;
    const areaData = lastData.areas[area];
    
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

fetchSystemData();
setInterval(fetchSystemData, 1000); // Polling 1s

// Mobile Sidebar Logic
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
    
    // Close sidebar when a link is clicked (optional but good for UX)
    const navLinks = sidebar.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    });
}
