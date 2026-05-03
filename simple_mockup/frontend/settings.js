// Settings Page Logic for AquaSense

// Fetch current state and populate the page
async function loadSettings() {
    try {
        const response = await fetch('/api/data?_t=' + Date.now());
        const data = await response.json();
        
        // Populate Auto Mode toggle
        const toggle = document.getElementById('settings-auto-mode');
        if (toggle) {
            toggle.checked = data.auto_mode;
        }

        // Populate Area defaults
        const areas = ['kitchen', 'bathroom', 'garden'];
        areas.forEach(area => {
            if (data.areas && data.areas[area]) {
                const aeration = data.areas[area].aeration || 0;
                
                const slider = document.getElementById(`set-slider-${area}`);
                const label = document.getElementById(`set-ind-${area}`);
                
                if (slider) slider.value = aeration;
                if (label) label.textContent = `${aeration}%`;
            }
        });

    } catch (err) {
        console.error("Failed to load settings from server:", err);
    }
}

// Push an auto_mode change to backend
async function toggleAutoMode(isAuto) {
    try {
        await fetch('/api/control', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ auto_mode: isAuto })
        });
        
        // Show lightweight console feedback
        console.log(`Auto mode ${isAuto ? "Enabled" : "Disabled"}`);
        
    } catch (err) {
        console.error("Failed to update auto mode:", err);
    }
}

// Push aeration target to backend
async function pushAerationUpdate(area, value) {
    try {
        await fetch('/api/control', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                area: area,
                aeration: parseInt(value, 10)
            })
        });
        
        console.log(`Updated ${area} aeration to ${value}`);
    } catch (err) {
        console.error("Failed to update area configuration:", err);
    }
}

// On Load
window.onload = () => {
    loadSettings();
    
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
    }
};
