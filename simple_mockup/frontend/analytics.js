// Analytics for AquaSense
let charts = {};

async function loadReport() {
    const granularity = document.getElementById('granularity').value;
    const reportType = document.getElementById('report-type').value;
    const compareMode = document.getElementById('compare-mode').checked;
    
    try {
        const response = await fetch(`/api/reports?granularity=${granularity}&_t=${Date.now()}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            renderCharts(data, reportType, compareMode, granularity);
            updateStats(data);
            generateInsights(data, compareMode, granularity);
            populateTable(data, reportType);

        }
    } catch (err) {
        console.error('Failed to load report:', err);
        const insightsList = document.getElementById('insights-list');
        insightsList.innerHTML = '<div class="insight-placeholder error">Error loading data. Please try again.</div>';
    }
}

function updateStats(data) {
    if (data.length === 0) return;
    
    // Average Daily Consumption from the data series
    const avgOut = data.reduce((sum, row) => sum + parseFloat(row.OutputFlow), 0) / data.length;
    document.getElementById('avg-daily-usage').textContent = avgOut.toFixed(1);
    
    // Total Water Saved (Sum or average based on context, here we use sum for the period)
    const totalSaved = data.reduce((sum, row) => sum + parseFloat(row.WaterSaved), 0);
    document.getElementById('total-saved').textContent = totalSaved.toFixed(1);
    
    // Leakage Estimation
    const leakage = data.reduce((sum, row) => {
        const diff = parseFloat(row.InputFlow) - parseFloat(row.OutputFlow);
        return diff > 2.0 ? sum + (diff * 0.5) : sum; 
    }, 0);
    document.getElementById('leak-est').textContent = leakage.toFixed(1);
}

function renderCharts(data, type, compare, granularity) {
    const ctxTrend = document.getElementById('consumptionTrendChart').getContext('2d');
    const ctxDist = document.getElementById('areaDistributionChart').getContext('2d');
    const ctxStab = document.getElementById('tankStabilityChart').getContext('2d');
    
    // Destroy existing charts
    if (charts.trend) charts.trend.destroy();
    if (charts.dist) charts.dist.destroy();
    if (charts.stab) charts.stab.destroy();
    
    const labels = data.map(row => {
        if (granularity === 'hourly') return row.Timestamp.split(' ')[1];
        if (granularity === 'daily') return row.Timestamp.split('-').slice(1).join('/');
        return row.Timestamp;
    });

    // 1. Main Trend Chart (Dynamic based on Type)
    let datasets = [];
    if (type === 'usage') {
        datasets = [
            {
                label: 'Input Flow (Avg L/m)',
                data: data.map(row => row.InputFlow),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true, tension: 0.3, pointRadius: 2
            },
            {
                label: 'Output Flow (Avg L/m)',
                data: data.map(row => row.OutputFlow),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true, tension: 0.3, pointRadius: 2
            }
        ];
        
        if (compare && data.length > 1) {
            // Fake comparison data for demonstration (offset by one period)
            datasets.push({
                label: 'Prev Period (Output)',
                data: [null, ...data.slice(0, -1).map(row => row.OutputFlow)],
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderDash: [5, 5],
                fill: false, tension: 0.3, pointRadius: 0
            });
        }
    } else if (type === 'area') {
        datasets = [
            { label: 'Kitchen', data: data.map(row => row.KitchenFlow), borderColor: '#f59e0b', backgroundColor: '#f59e0b33', fill: true },
            { label: 'Bathroom', data: data.map(row => row.BathroomFlow), borderColor: '#8b5cf6', backgroundColor: '#8b5cf633', fill: true },
            { label: 'Garden', data: data.map(row => row.GardenFlow), borderColor: '#ef4444', backgroundColor: '#ef444433', fill: true }
        ];
    } else {
        // Comparison View (Today vs Avg)
        const avg = data.reduce((sum, r) => sum + r.OutputFlow, 0) / data.length;
        datasets = [
            {
                label: 'Current Usage',
                data: data.map(row => row.OutputFlow),
                backgroundColor: '#3b82f6',
                type: 'bar'
            },
            {
                label: 'Period Average',
                data: data.map(() => avg),
                borderColor: '#f59e0b',
                borderDash: [5, 5],
                fill: false, tension: 0, pointRadius: 0, type: 'line'
            }
        ];
    }

    charts.trend = new Chart(ctxTrend, {
        type: type === 'comparison' ? 'bar' : 'line',
        data: { labels, datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' }, stacked: type === 'area' },
                x: { grid: { display: false }, ticks: { color: '#9ca3af', maxTicksLimit: 12 } }
            },
            plugins: { legend: { labels: { color: '#fff', font: { family: 'Outfit' } } } }
        }
    });

    // 2. Area Distribution Pie
    const latest = data[data.length - 1];
    charts.dist = new Chart(ctxDist, {
        type: 'doughnut',
        data: {
            labels: ['Kitchen', 'Bathroom', 'Garden'],
            datasets: [{
                data: [latest.KitchenFlow, latest.BathroomFlow, latest.GardenFlow],
                backgroundColor: ['#f59e0b', '#8b5cf6', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '70%',
            plugins: { legend: { position: 'bottom', labels: { color: '#fff', usePointStyle: true, font: { family: 'Outfit' } } } }
        }
    });

    // 3. Tank Stability
    charts.stab = new Chart(ctxStab, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Avg Tank Level %',
                data: data.map(row => row.TankLevel),
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                fill: true, tension: 0.4, pointRadius: 0
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
                x: { display: false }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function generateInsights(data, compare, granularity) {
    const list = document.getElementById('insights-list');
    list.innerHTML = '';
    
    if (data.length < 2) {
        list.innerHTML = '<div class="insight-placeholder">Waiting for more data points...</div>';
        return;
    }

    const latest = data[data.length - 1];
    const prev = data[data.length - 2];
    
    const insights = [];
    
    // 1. Overall Trend Insight
    const overallDiff = ((latest.OutputFlow - prev.OutputFlow) / (prev.OutputFlow || 1)) * 100;
    const trendIcon = overallDiff > 0 ? 'trending-up-outline' : 'trending-down-outline';
    const trendClass = overallDiff > 0 ? 'text-danger' : 'text-success';
    insights.push({
        title: 'Consumption Trend',
        text: `Overall usage has ${overallDiff > 0 ? 'increased' : 'decreased'} by <b>${Math.abs(overallDiff).toFixed(1)}%</b> compared to the previous ${granularity.replace('ly', '')}.`,
        icon: trendIcon,
        class: trendClass
    });

    // 2. Area-Specific Change Insight (Meeting the specific requirement)
    const areaChanges = [
        { name: 'Kitchen', current: latest.KitchenFlow, prev: prev.KitchenFlow },
        { name: 'Bathroom', current: latest.BathroomFlow, prev: prev.BathroomFlow },
        { name: 'Garden', current: latest.GardenFlow, prev: prev.GardenFlow }
    ].map(a => ({
        ...a,
        diff: a.current - a.prev,
        perc: ((a.current - a.prev) / (a.prev || 1)) * 100
    })).sort((a, b) => b.diff - a.diff); // Sort by largest increase

    const topGrower = areaChanges[0];
    if (topGrower.diff > 0.1) {
        insights.push({
            title: 'Area Usage Alert',
            text: `Currently consuming more in <b>${topGrower.name}</b> (+${topGrower.diff.toFixed(1)} L/m) compared to last ${granularity.replace('ly', '')}.`,
            icon: 'alert-circle-outline',
            class: 'text-warning'
        });
    } else {
        insights.push({
            title: 'Optimized Area',
            text: `<b>${areaChanges[areaChanges.length-1].name}</b> shows most efficiency gain this ${granularity.replace('ly', '')}.`,
            icon: 'checkmark-done-circle-outline',
            class: 'text-success'
        });
    }

    // 3. Efficiency/Saved Insight
    insights.push({
        title: 'Water Recovery',
        text: `You've recovered <b>${latest.WaterSaved.toFixed(1)} L</b> in the current period through aeration.`,
        icon: 'leaf-outline',
        class: 'text-success'
    });

    insights.forEach(ins => {
        const card = document.createElement('div');
        card.className = 'insight-card';
        card.innerHTML = `
            <div class="ins-icon ${ins.class}">
                <ion-icon name="${ins.icon}"></ion-icon>
            </div>
            <div class="ins-content">
                <h4>${ins.title}</h4>
                <p>${ins.text}</p>
            </div>
        `;
        list.appendChild(card);
    });
}


function populateTable(data, type) {
    const tableHeader = document.querySelector('.data-table thead tr');
    const tableBody = document.getElementById('history-table-body');
    tableBody.innerHTML = '';
    
    // Update Headers
    if (type === 'area') {
        tableHeader.innerHTML = `
            <th>Timestamp</th>
            <th>Kitchen (Avg L/m)</th>
            <th>Bathroom (Avg L/m)</th>
            <th>Garden (Avg L/m)</th>
            <th>Total Output</th>
        `;
    } else {
        tableHeader.innerHTML = `
            <th>Timestamp</th>
            <th>Input Flow</th>
            <th>Output Flow</th>
            <th>Tank Level</th>
            <th>Status</th>
        `;
    }
    
    const recent = [...data].reverse().slice(0, 10);
    
    recent.forEach(row => {
        const tr = document.createElement('tr');
        
        if (type === 'area') {
            tr.innerHTML = `
                <td>${row.Timestamp}</td>
                <td>${row.KitchenFlow} L/m</td>
                <td>${row.BathroomFlow} L/m</td>
                <td>${row.GardenFlow} L/m</td>
                <td><b style="color: var(--primary)">${row.OutputFlow} L/m</b></td>
            `;
        } else {
            const level = parseFloat(row.TankLevel);
            const statusClass = level < 20 ? 'status-danger' : (level < 50 ? 'status-warning' : 'status-success');
            const statusText = level < 20 ? 'Critical' : (level < 50 ? 'Warning' : 'Optimal');
            
            tr.innerHTML = `
                <td>${row.Timestamp}</td>
                <td>${row.InputFlow} L/m</td>
                <td>${row.OutputFlow} L/m</td>
                <td>${row.TankLevel}%</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            `;
        }
        tableBody.appendChild(tr);
    });
}


function exportData() {
    const granularity = document.getElementById('granularity').value;
    window.location.href = `/api/reports?granularity=${granularity}`;
}

async function generateDailyReport() {
    try {
        const response = await fetch(`/api/daily-report?_t=${Date.now()}`);
        if (!response.ok) {
            alert('Could not generate report. Insufficient data for today.');
            return;
        }
        const data = await response.json();
        
        // Show report doc
        document.getElementById('daily-report-doc').style.display = 'block';
        
        // Fill basic metrics
        document.getElementById('report-date-val').textContent = data.date;
        document.getElementById('report-start-avail').textContent = data.start_availability;
        document.getElementById('report-end-avail').textContent = data.end_availability;
        document.getElementById('report-total-in').textContent = data.total_input;
        document.getElementById('report-total-out').textContent = data.total_output;
        
        // Fill executive summary
        let summary = `On ${data.date}, the system recorded a total input of ${data.total_input} L and output of ${data.total_output} L. `;
        if (data.end_availability < data.start_availability) {
            summary += `Overall tank availability decreased from ${data.start_availability}% to ${data.end_availability}%. Consumption exceeded the input. `;
        } else {
            summary += `Overall tank availability was stable or increased, going from ${data.start_availability}% to ${data.end_availability}%. `;
        }
        document.getElementById('report-summary-text').textContent = summary;
        
        // Area-wise logic
        const maxArea = Object.keys(data.areas).reduce((a, b) => data.areas[a] > data.areas[b] ? a : b);
        document.getElementById('report-area-text').innerHTML = `
            The breakdown of water usage shows the relative distribution across the three monitored zones. 
            The highest consumption occurred in the <strong>${maxArea}</strong> area, which used ${data.areas[maxArea]} L.
            As seen in Figure 1, identifying the highest usage zone provides opportunities for targeted conservation (e.g., increasing aeration in the ${maxArea}).
        `;
        
        // Tank stability logic
        document.getElementById('report-tank-text').innerHTML = `
            Figure 2 illustrates the tank level trend over the course of the day. A stable trend indicates that the input flow adequately meets the demand. 
            Significant dips indicate high sudden consumption or loss of input flow. The day concluded with an availability of ${data.end_availability}%.
        `;
        
        // Render Area Chart (Fig 1)
        if (charts.reportArea) charts.reportArea.destroy();
        charts.reportArea = new Chart(document.getElementById('reportAreaChart').getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Kitchen', 'Bathroom', 'Garden'],
                datasets: [{
                    data: [data.areas.kitchen, data.areas.bathroom, data.areas.garden],
                    backgroundColor: ['#f59e0b', '#8b5cf6', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom' } }
            }
        });
        
        // Render Tank Chart (Fig 2)
        if (charts.reportTank) charts.reportTank.destroy();
        charts.reportTank = new Chart(document.getElementById('reportTankChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: data.hourly_trend.map(d => d.hour + ':00'),
                datasets: [{
                    label: 'Tank Level %',
                    data: data.hourly_trend.map(d => d.tank_level),
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.2)',
                    fill: true, tension: 0.3
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { y: { min: 0, max: 100 } },
                plugins: { legend: { display: false } }
            }
        });
        
    } catch (err) {
        console.error(err);
        alert('Failed to generate daily report.');
    }
}

window.onload = () => {
    loadReport();
    const params = new URLSearchParams(window.location.search);
    if (params.get('auto') === 'report') {
        setTimeout(generateDailyReport, 800); // Small delay to ensure smooth loading
    }
};
