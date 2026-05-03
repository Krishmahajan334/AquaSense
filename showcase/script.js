document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Fade-in Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animating once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });

    // 2. Counter Animation for Stats
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate integers
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // ms
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });

                // Animate floats
                const floatCounters = entry.target.querySelectorAll('.counter-float');
                floatCounters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = current.toFixed(1);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target.toFixed(1);
                        }
                    };
                    updateCounter();
                });

                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        statsObserver.observe(resultsSection);
    }

    // 3. Chart.js Initialization
    const initCharts = () => {
        // Common options for dark theme
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.font.family = "'Inter', sans-serif";

        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { boxWidth: 12 }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        };

        // Area Chart (Bar)
        const ctxArea = document.getElementById('areaChart');
        if (ctxArea) {
            new Chart(ctxArea, {
                type: 'bar',
                data: {
                    labels: ['Hostel A', 'Kitchen', 'Garden', 'Admin Block', 'Drinking Station'],
                    datasets: [{
                        label: 'Avg Consumption (L/hr)',
                        data: [120, 85, 200, 45, 30],
                        backgroundColor: 'rgba(0, 240, 255, 0.7)',
                        borderColor: '#00f0ff',
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: commonOptions
            });
        }

        // Efficiency Chart (Line)
        const ctxEff = document.getElementById('efficiencyChart');
        if (ctxEff) {
            new Chart(ctxEff, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [
                        {
                            label: 'System Load',
                            data: [65, 59, 80, 81, 56, 40, 45],
                            borderColor: '#8b5cf6',
                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Water Saved (%)',
                            data: [20, 22, 28, 35, 32, 25, 24],
                            borderColor: '#00f0ff',
                            backgroundColor: 'transparent',
                            tension: 0.4,
                            borderDash: [5, 5]
                        }
                    ]
                },
                options: commonOptions
            });
        }
    };

    // Initialize charts when the data-vis section comes into view
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initCharts();
                chartObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const dataVisSection = document.getElementById('data-vis');
    if (dataVisSection) {
        chartObserver.observe(dataVisSection);
    }

    // 4. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
