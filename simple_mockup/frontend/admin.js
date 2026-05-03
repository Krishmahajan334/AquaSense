function adminLogin() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    const errorMsg = document.getElementById('login-error');
    
    if (user === 'admin' && pass === 'admin123') {
        document.getElementById('login-overlay').style.display = 'none';
        sessionStorage.setItem('admin_logged_in', 'true');
        loadConfig();
    } else {
        errorMsg.style.display = 'block';
    }
}

async function loadConfig() {
    // Check login state first
    if (sessionStorage.getItem('admin_logged_in') !== 'true') {
        document.getElementById('login-overlay').style.display = 'flex';
        return;
    } else {
        document.getElementById('login-overlay').style.display = 'none';
    }
    
    try {
        const response = await fetch('/api/admin/config');
        const data = await response.json();
        if (data.telegram_bot_token) {
            document.getElementById('tg-token').value = data.telegram_bot_token;
        }
        if (data.telegram_chat_id) {
            document.getElementById('tg-chatid').value = data.telegram_chat_id;
        }
    } catch (e) {
        console.error('Failed to load config', e);
    }
}

async function saveTelegramConfig() {
    const token = document.getElementById('tg-token').value.trim();
    const chatid = document.getElementById('tg-chatid').value.trim();
    
    try {
        const response = await fetch('/api/admin/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                telegram_bot_token: token,
                telegram_chat_id: chatid
            })
        });
        
        if (response.ok) {
            alert('Telegram configuration saved successfully!');
        } else {
            alert('Failed to save configuration.');
        }
    } catch (e) {
        console.error(e);
        alert('Error saving configuration.');
    }
}

async function testTelegramConfig() {
    const token = document.getElementById('tg-token').value.trim();
    const chatid = document.getElementById('tg-chatid').value.trim();
    
    if (!token || !chatid) {
        alert("Please enter both Bot API Token and Chat ID first.");
        return;
    }
    
    try {
        const response = await fetch('/api/admin/test-telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                telegram_bot_token: token,
                telegram_chat_id: chatid
            })
        });
        
        if (response.ok) {
            alert('Test notification sent successfully! Check your Telegram.');
        } else {
            const err = await response.json();
            alert('Failed to send test notification: ' + (err.error || 'Unknown error'));
        }
    } catch (e) {
        console.error(e);
        alert('Error sending test notification.');
    }
}

async function resetSystemData() {
    if (confirm("WARNING: This will permanently delete all historical data and reset the system state. Are you sure you want to proceed?")) {
        try {
            const response = await fetch('/api/admin/reset', { method: 'POST' });
            if (response.ok) {
                alert('System has been factory reset.');
            } else {
                alert('Failed to reset system.');
            }
        } catch (e) {
            console.error(e);
            alert('Error resetting system.');
        }
    }
}

window.onload = () => {
    loadConfig();
    
    // Login UI Enhancements
    const loginOverlay = document.getElementById('login-overlay');
    const loginCard = document.getElementById('login-card');
    const userInput = document.getElementById('admin-user');
    const passInput = document.getElementById('admin-pass');

    if (userInput && passInput) {
        const handleEnter = (e) => {
            if (e.key === 'Enter') adminLogin();
        };
        userInput.addEventListener('keypress', handleEnter);
        passInput.addEventListener('keypress', handleEnter);
    }

    if (loginOverlay && loginCard) {
        loginOverlay.addEventListener('mousedown', (e) => {
            // If click is outside the login card and overlay is visible
            if (!loginCard.contains(e.target) && loginOverlay.style.display !== 'none') {
                window.location.href = 'index.html';
            }
        });
    }
    
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
