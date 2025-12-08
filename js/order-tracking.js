// Order status management
let currentStatusIndex = 1; // 0: placed, 1: preparing, 2: on-the-way, 3: delivered
const statuses = [
    {
        name: 'placed',
        title: 'Order Placed',
        subtitle: 'Your order has been confirmed',
        icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
        </svg>`,
        progress: 0
    },
    {
        name: 'preparing',
        title: 'Preparing Your Order',
        subtitle: 'The restaurant is carefully preparing your food',
        icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>`,
        progress: 25
    },
    {
        name: 'on-the-way',
        title: 'On the Way',
        subtitle: 'Your order is being delivered',
        icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="3" width="15" height="13"/>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>`,
        progress: 60
    },
    {
        name: 'delivered',
        title: 'Order Delivered!',
        subtitle: 'Enjoy your meal!',
        icon: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>`,
        progress: 100
    }
];

function updateStatus(index) {
    const status = statuses[index];
    
    // Update status icon and text
    document.getElementById('statusIcon').innerHTML = status.icon;
    document.getElementById('statusTitle').textContent = status.title;
    document.getElementById('statusSubtitle').textContent = status.subtitle;
    
    // Update timeline
    const steps = document.querySelectorAll('.timeline-step');
    steps.forEach((step, i) => {
        step.classList.remove('completed', 'active');
        if (i < index) {
            step.classList.add('completed');
        } else if (i === index) {
            step.classList.add('active');
        }
    });
    
    // Update progress line
    document.getElementById('timelineLine').style.setProperty('--progress', `${status.progress}%`);
    
    // Show driver section and map when on the way
    const driverSection = document.getElementById('driverSection');
    const mapSection = document.getElementById('mapSection');
    if (index >= 2) {
        driverSection.style.display = 'block';
        mapSection.classList.add('show');
    } else {
        driverSection.style.display = 'none';
        mapSection.classList.remove('show');
    }
}

// Jump to specific status when clicking timeline markers
function jumpToStatus(index) {
    currentStatusIndex = index;
    updateStatus(currentStatusIndex);
}

// Simulate status progression (for demo purposes)
function simulateProgress() {
    const progressInterval = setInterval(() => {
        if (currentStatusIndex < statuses.length - 1) {
            currentStatusIndex++;
            updateStatus(currentStatusIndex);
        } else {
            clearInterval(progressInterval);
        }
    }, 10000); // Progress every 10 seconds
}

// Countdown timer
let estimatedMinutes = 28;
function updateCountdown() {
    const countdownInterval = setInterval(() => {
        if (estimatedMinutes > 0) {
            estimatedMinutes--;
            const minText = estimatedMinutes > 1 ? 'minutes' : 'minute';
            document.getElementById('estimatedTime').textContent = `${estimatedMinutes} ${minText}`;
        } else {
            document.getElementById('estimatedTime').textContent = 'Arriving soon!';
            clearInterval(countdownInterval);
        }
    }, 60000); // Update every minute
}

// Action functions
function callDriver() {
    alert('Calling Miguel Santos...');
}

function chatDriver() {
    alert('Opening chat with Miguel Santos...');
}

function openSupport() {
    alert('Opening support center...');
}

function contactSupport() {
    alert('Contacting customer support...');
}

// Initialize
updateStatus(currentStatusIndex);
// Uncomment to enable auto-progression
// simulateProgress();
// updateCountdown();
