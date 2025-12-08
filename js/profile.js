// Navigation functions
function goToHome() {
    window.location.href = '../index.html';
}

function goToSearch() {
    window.location.href = 'search.html';
}

function goToOrders() {
    window.location.href = 'orders.html';
}

// Profile functions
function openSettings() {
    alert('Settings page coming soon!');
}

function editAvatar() {
    alert('Edit avatar functionality coming soon!');
}

function editProfile() {
    alert('Edit profile page coming soon!');
}

function manageAddresses() {
    alert('Manage addresses page coming soon!');
}

function managePayments() {
    alert('Payment methods page coming soon!');
}

function viewVouchers() {
    alert('Vouchers page coming soon!');
}

function viewFavorites() {
    alert('Favorites page coming soon!');
}

function viewOrder(orderId) {
    // Navigate to order tracking page
    if (orderId === 'GO-2412-0158') {
        window.location.href = 'order-tracking.html';
    } else {
        alert('Viewing order: ' + orderId);
    }
}

function viewAllOrders() {
    window.location.href = 'orders.html';
}

function contactSupport() {
    alert('Help center coming soon!');
}

function rateApp() {
    alert('Thank you for considering rating our app!');
}

// Logout modal functions
function showLogoutModal() {
    document.getElementById('logoutModal').classList.add('active');
}

function closeLogoutModal() {
    document.getElementById('logoutModal').classList.remove('active');
}

function confirmLogout() {
    // In a real app, this would clear session/tokens
    alert('Logging out...');
    // Redirect to login page
    window.location.href = 'login.html';
}

// Close modal when clicking outside
document.getElementById('logoutModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeLogoutModal();
    }
});
