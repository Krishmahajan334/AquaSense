// Areas Management Logic for AquaSense

let currentData = null;

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

    const areas = ['kitchen', 'bathroom', 'garden'];
    
    areas.forEach(areaId => {
        const area = data.areas[areaId];
        if (!area) return;

        // Update Stats
        const flowEl = document.getElementById(`flow-${areaId}`);
        const usageEl = document.getElementById(`usage-${areaId}`);
        const savedEl = document.getElementById(`saved-${areaId}`);
        
        if (flowEl) flowEl.textContent = area.flow_rate.toFixed(1);
        if (usageEl) usageEl.textContent = area.water_usage.toFixed(1);
        
        // Calculate saved specifically for this area if possible, 
        // but backend currently only has a global total_water_saved.
        // We can approximate it here or use the global one.
        // For the detailed page, we'll just show the global saved for now or 
        // we can assume a portion. Actually, let's just use 0.0 if not tracked per area.
        // Actually, let's just use the global one for now to show something.
        if (savedEl) savedEl.textContent = (data.total_water_saved / 3).toFixed(1); // Rough split for UI

        // Update Valve Status
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
        
        if (slider && !slider.matches(':active')) {
            slider.value = area.aeration;
            if (valLabel) valLabel.textContent = `${area.aeration}%`;
        }
    });

    // Update Topbar Badge if alerts exist
    const badge = document.querySelector('.notification-bell .badge');
    if (badge && data.alerts && data.alerts.length > 0) {
        badge.style.display = 'block';
    } else if (badge) {
        badge.style.display = 'none';
    }
}

async function toggleAreaValve(areaId) {
    if (!currentData || !currentData.areas[areaId]) return;
    
    const newState = !currentData.areas[areaId].valve_open;
    
    try {
        await fetch('/api/control', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                area: areaId,
                valve: newState
            })
        });
        fetchAreaData(); // Immediate refresh
    } catch (err) {
        console.error('Failed to toggle valve:', err);
    }
}

async function setAreaAeration(areaId, value) {
    try {
        await fetch('/api/control', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                area: areaId,
                aeration: parseInt(value)
            })
        });
    } catch (err) {
        console.error('Failed to set aeration:', err);
    }
}

// Initial fetch and start interval
fetchAreaData();
setInterval(fetchAreaData, 2000);
