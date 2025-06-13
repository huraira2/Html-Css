// DOM Elements
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const refreshActivityBtn = document.getElementById('refreshActivity');
const chartBtns = document.querySelectorAll('.chart-btn');
const navLinks = document.querySelectorAll('.nav-link');

// Sidebar toggle functionality
sidebarToggle.addEventListener('click', function() {
    sidebar.classList.toggle('open');
    mainContent.classList.toggle('expanded');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(e) {
    if (window.innerWidth <= 1024) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
            mainContent.classList.remove('expanded');
        }
    }
});

// Navigation functionality
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        this.closest('.nav-item').classList.add('active');
        
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('open');
            mainContent.classList.remove('expanded');
        }
    });
});

// Chart period switching
chartBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all chart buttons
        chartBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Simulate chart update
        const period = this.dataset.period;
        updateChart(period);
    });
});

function updateChart(period) {
    const chartCanvas = document.getElementById('revenueChart');
    
    // Add loading state
    chartCanvas.style.opacity = '0.5';
    chartCanvas.textContent = 'Loading...';
    
    setTimeout(() => {
        chartCanvas.style.opacity = '1';
        chartCanvas.textContent = `Revenue Chart - ${period.charAt(0).toUpperCase() + period.slice(1)} View`;
    }, 500);
}

// Refresh activity feed
refreshActivityBtn.addEventListener('click', function() {
    this.style.transform = 'rotate(360deg)';
    
    // Simulate loading new activities
    const activityFeed = document.querySelector('.activity-feed');
    activityFeed.style.opacity = '0.5';
    
    setTimeout(() => {
        activityFeed.style.opacity = '1';
        this.style.transform = 'rotate(0deg)';
        
        // Add new activity item
        addNewActivity();
    }, 1000);
});

function addNewActivity() {
    const activityFeed = document.querySelector('.activity-feed');
    const newActivity = document.createElement('div');
    newActivity.className = 'activity-item';
    newActivity.style.animation = 'fadeInUp 0.5s ease';
    
    const activities = [
        {
            icon: 'new-order',
            emoji: '📦',
            text: 'New order #12848 received from <strong>Alex Rivera</strong>',
            time: 'Just now'
        },
        {
            icon: 'payment',
            emoji: '💳',
            text: 'Payment of <strong>$149.99</strong> processed successfully',
            time: 'Just now'
        },
        {
            icon: 'user-signup',
            emoji: '👤',
            text: 'New user <strong>Emma Wilson</strong> registered',
            time: 'Just now'
        }
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    newActivity.innerHTML = `
        <div class="activity-icon ${randomActivity.icon}">${randomActivity.emoji}</div>
        <div class="activity-details">
            <p class="activity-text">${randomActivity.text}</p>
            <span class="activity-time">${randomActivity.time}</span>
        </div>
    `;
    
    // Insert at the beginning
    activityFeed.insertBefore(newActivity, activityFeed.firstChild);
    
    // Remove last item if more than 5 activities
    const activityItems = activityFeed.querySelectorAll('.activity-item');
    if (activityItems.length > 5) {
        activityItems[activityItems.length - 1].remove();
    }
}

// Animate stats on page load
function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const finalValue = stat.textContent;
        const isPercentage = finalValue.includes('%');
        const isCurrency = finalValue.includes('$');
        const numericValue = parseFloat(finalValue.replace(/[$,%]/g, ''));
        
        let currentValue = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(currentValue);
            
            if (isCurrency) {
                displayValue = '$' + displayValue.toLocaleString();
            } else if (isPercentage) {
                displayValue = (currentValue / 100).toFixed(2) + '%';
            } else {
                displayValue = displayValue.toLocaleString();
            }
            
            stat.textContent = displayValue;
        }, 20);
    });
}

// Animate mini charts
function animateMiniCharts() {
    const miniCharts = document.querySelectorAll('.mini-chart');
    
    miniCharts.forEach(chart => {
        const values = chart.dataset.values.split(',').map(Number);
        const maxValue = Math.max(...values);
        
        // Create bars
        chart.innerHTML = '';
        values.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.style.cssText = `
                position: absolute;
                bottom: 0;
                left: ${(index / (values.length - 1)) * 100}%;
                width: ${100 / values.length * 0.8}%;
                background: linear-gradient(to top, #667eea, #764ba2);
                border-radius: 2px 2px 0 0;
                transition: height 1s ease ${index * 0.1}s;
                height: 0%;
            `;
            chart.appendChild(bar);
            
            // Animate height
            setTimeout(() => {
                bar.style.height = `${(value / maxValue) * 100}%`;
            }, 100);
        });
    });
}

// Animate traffic bars
function animateTrafficBars() {
    const trafficFills = document.querySelectorAll('.traffic-fill');
    
    trafficFills.forEach((fill, index) => {
        const targetWidth = fill.style.width;
        fill.style.width = '0%';
        
        setTimeout(() => {
            fill.style.width = targetWidth;
        }, index * 200);
    });
}

// Notification functionality
const notificationBtn = document.querySelector('.notification-btn');

notificationBtn.addEventListener('click', function() {
    showNotifications();
});

function showNotifications() {
    const notifications = [
        'New order received from John Smith',
        'Low stock alert for Smart Watch',
        'Payment processed successfully'
    ];
    
    // Create notification dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'notification-dropdown';
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        width: 300px;
        z-index: 1000;
        margin-top: 0.5rem;
        animation: fadeInDown 0.3s ease;
    `;
    
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 1rem;
        border-bottom: 1px solid #e2e8f0;
        font-weight: 600;
        color: #1e293b;
    `;
    header.textContent = 'Notifications';
    dropdown.appendChild(header);
    
    notifications.forEach(notification => {
        const item = document.createElement('div');
        item.style.cssText = `
            padding: 1rem;
            border-bottom: 1px solid #f1f5f9;
            color: #64748b;
            cursor: pointer;
            transition: background 0.3s ease;
        `;
        item.textContent = notification;
        
        item.addEventListener('mouseenter', () => {
            item.style.background = '#f8fafc';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.background = 'transparent';
        });
        
        dropdown.appendChild(item);
    });
    
    notificationBtn.style.position = 'relative';
    notificationBtn.appendChild(dropdown);
    
    // Close dropdown when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(e) {
            if (!notificationBtn.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 100);
}

// Real-time data updates
function updateRealTimeData() {
    // Update random stats
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const currentText = stat.textContent;
        const isPercentage = currentText.includes('%');
        const isCurrency = currentText.includes('$');
        
        if (Math.random() > 0.7) { // 30% chance to update
            let currentValue = parseFloat(currentText.replace(/[$,%,]/g, ''));
            const change = (Math.random() - 0.5) * 0.1; // ±5% change
            const newValue = currentValue * (1 + change);
            
            let displayValue;
            if (isCurrency) {
                displayValue = '$' + Math.floor(newValue).toLocaleString();
            } else if (isPercentage) {
                displayValue = newValue.toFixed(2) + '%';
            } else {
                displayValue = Math.floor(newValue).toLocaleString();
            }
            
            stat.textContent = displayValue;
            
            // Add flash effect
            stat.style.color = '#10b981';
            setTimeout(() => {
                stat.style.color = '#1e293b';
            }, 1000);
        }
    });
}

// Table interactions
function setupTableInteractions() {
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            // Remove active class from all rows
            tableRows.forEach(r => r.classList.remove('active'));
            
            // Add active class to clicked row
            this.classList.add('active');
            
            // Add visual feedback
            this.style.background = '#f8fafc';
            setTimeout(() => {
                this.style.background = '';
            }, 200);
        });
    });
}

// Product item interactions
function setupProductInteractions() {
    const productItems = document.querySelectorAll('.product-item');
    
    productItems.forEach(item => {
        item.addEventListener('click', function() {
            const productName = this.querySelector('.product-name').textContent;
            showProductDetails(productName);
        });
    });
}

function showProductDetails(productName) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 2rem;
        max-width: 400px;
        width: 90%;
        text-align: center;
        animation: slideInUp 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: #1e293b;">${productName}</h3>
        <p style="color: #64748b; margin-bottom: 2rem;">Product details would be displayed here in a real application.</p>
        <button onclick="this.closest('.modal').remove()" style="
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        ">Close</button>
    `;
    
    modal.className = 'modal';
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Toggle sidebar with Ctrl+B
    if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        sidebarToggle.click();
    }
    
    // Refresh activity with Ctrl+R
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        refreshActivityBtn.click();
    }
    
    // Close modals with Escape
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.remove());
        
        const dropdowns = document.querySelectorAll('.notification-dropdown');
        dropdowns.forEach(dropdown => dropdown.remove());
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .data-table tbody tr {
        cursor: pointer;
        transition: background 0.3s ease;
    }
    
    .data-table tbody tr:hover {
        background: #f8fafc;
    }
    
    .data-table tbody tr.active {
        background: #f1f5f9;
    }
    
    .product-item {
        cursor: pointer;
    }
    
    .stat-value {
        transition: color 0.3s ease;
    }
`;
document.head.appendChild(style);

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Animate elements on load
    setTimeout(() => {
        animateStats();
        animateMiniCharts();
        animateTrafficBars();
    }, 500);
    
    // Setup interactions
    setupTableInteractions();
    setupProductInteractions();
    
    // Start real-time updates
    setInterval(updateRealTimeData, 10000); // Update every 10 seconds
    
    // Auto-refresh activity feed
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every 30 seconds
            addNewActivity();
        }
    }, 30000);
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 1024) {
        sidebar.classList.remove('open');
        mainContent.classList.remove('expanded');
    }
});