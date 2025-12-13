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
    openModal('editProfileModal');
}

function manageAddresses() {
    openModal('addressesModal');
}

function managePayments() {
    openModal('paymentsModal');
}

function viewVouchers() {
    openModal('vouchersModal');
}

function viewFavorites() {
    openModal('favoritesModal');
}

// Modal management functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = '';
}

// Edit Profile Modal functions
function saveProfile() {
    alert('Profile updated successfully!');
    closeModal('editProfileModal');
}

// Address Modal functions
function showAddAddressForm() {
    alert('Add address form coming soon!');
}

function editAddress(id) {
    alert('Editing address ' + id);
}

function deleteAddress(id) {
    if (confirm('Are you sure you want to delete this address?')) {
        alert('Address deleted');
    }
}

// Payment Modal functions
function showAddPaymentForm() {
    alert('Add payment method form coming soon!');
}

function deletePayment(id) {
    if (confirm('Are you sure you want to remove this payment method?')) {
        alert('Payment method removed');
    }
}

function addCashOption() {
    alert('Cash on delivery is already available at checkout!');
}

// Voucher Modal functions
function applyVoucher(code) {
    alert('Voucher ' + code + ' applied! Use it at checkout.');
    closeModal('vouchersModal');
}

// Favorites Modal functions
function goToRestaurant(id) {
    window.location.href = 'merchant-detail.html';
}

function removeFavorite(id) {
    if (confirm('Remove from favorites?')) {
        alert('Removed from favorites');
    }
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
    openModal('logoutModal');
}

function closeLogoutModal() {
    closeModal('logoutModal');
}

function confirmLogout() {
    // In a real app, this would clear session/tokens
    alert('Logging out...');
    // Redirect to login page
    window.location.href = 'login.html';
}

// Close modals when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modals = ['logoutModal', 'editProfileModal', 'addressesModal', 'paymentsModal', 'vouchersModal', 'favoritesModal'];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal(modalId);
                }
            });
        }
    });
});
