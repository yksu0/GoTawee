// ============================================
// RIDE TRACKING JAVASCRIPT - GO TAWEE
// ============================================

class RideTracker {
    constructor() {
        this.rideData = this.loadRideData();
        this.isTracking = false;
        this.trackingInterval = null;
        this.statusUpdateInterval = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeTracking();
        this.startStatusUpdates();
    }

    bindEvents() {
        // Emergency button
        const emergencyBtn = document.getElementById('emergencyBtn');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => this.showEmergencyModal());
        }

        // Cancel ride button
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelRide());
        }

        // Driver communication
        const callBtn = document.getElementById('callBtn');
        if (callBtn) {
            callBtn.addEventListener('click', () => this.callDriver());
        }

        const messageBtn = document.getElementById('messageBtn');
        if (messageBtn) {
            messageBtn.addEventListener('click', () => this.messageDriver());
        }

        // Support button
        const supportBtn = document.getElementById('supportBtn');
        if (supportBtn) {
            supportBtn.addEventListener('click', () => this.contactSupport());
        }

        // Emergency modal events
        this.bindEmergencyModalEvents();
    }

    bindEmergencyModalEvents() {
        const callPoliceBtn = document.querySelector('.call-police');
        if (callPoliceBtn) {
            callPoliceBtn.addEventListener('click', () => this.callPolice());
        }

        const shareTripBtn = document.querySelector('.share-trip');
        if (shareTripBtn) {
            shareTripBtn.addEventListener('click', () => this.shareTrip());
        }

        const contactSupportBtn = document.querySelector('.contact-support');
        if (contactSupportBtn) {
            contactSupportBtn.addEventListener('click', () => this.contactSupport());
        }
    }

    loadRideData() {
        // Load ride data from localStorage or API
        const stored = localStorage.getItem('currentRide');
        if (stored) {
            return JSON.parse(stored);
        }

        // Default ride data for demo
        return {
            id: 'ride_' + Date.now(),
            status: 'driver_en_route', // driver_en_route, arrived, picked_up, in_transit, completed
            driver: {
                id: 'driver_001',
                name: 'Carlos Santos',
                rating: 4.9,
                totalRides: 245,
                phone: '+63 912 345 6789',
                vehicle: {
                    make: 'Honda Civic',
                    plate: 'ABC-1234',
                    color: 'Silver'
                },
                location: {
                    lat: 14.5995,
                    lng: 120.9842
                }
            },
            pickup: {
                address: '123 Main Street, Downtown',
                lat: 14.5995,
                lng: 120.9842
            },
            destination: {
                address: '456 Oak Avenue, Uptown',
                lat: 14.6091,
                lng: 120.9947
            },
            fare: 45,
            distance: 5.2,
            estimatedDuration: 12,
            bookingTime: new Date().toISOString(),
            estimatedArrival: new Date(Date.now() + 5 * 60000).toISOString() // 5 minutes from now
        };
    }

    saveRideData() {
        localStorage.setItem('currentRide', JSON.stringify(this.rideData));
    }

    initializeTracking() {
        this.updateUI();
        this.startLocationTracking();
        this.updateProgress();
    }

    startLocationTracking() {
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
        }

        this.isTracking = true;
        this.trackingInterval = setInterval(() => {
            this.simulateDriverMovement();
            this.updateETA();
        }, 3000); // Update every 3 seconds
    }

    stopLocationTracking() {
        this.isTracking = false;
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
            this.trackingInterval = null;
        }
    }

    simulateDriverMovement() {
        // Simulate driver moving closer
        if (this.rideData.status === 'driver_en_route') {
            // Move driver slightly towards pickup
            const pickup = this.rideData.pickup;
            const driver = this.rideData.driver.location;
            
            const latDiff = pickup.lat - driver.lat;
            const lngDiff = pickup.lng - driver.lng;
            
            // Move 10% closer each update
            driver.lat += latDiff * 0.1;
            driver.lng += lngDiff * 0.1;
            
            // Check if arrived
            const distance = this.calculateDistance(driver.lat, driver.lng, pickup.lat, pickup.lng);
            if (distance < 0.1) { // Within 100 meters
                this.updateRideStatus('arrived');
            }
        }
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    updateETA() {
        const now = new Date();
        const estimated = new Date(this.rideData.estimatedArrival);
        const diffMinutes = Math.max(0, Math.ceil((estimated - now) / 60000));
        
        const etaElement = document.querySelector('.eta-value');
        if (etaElement) {
            etaElement.textContent = diffMinutes === 0 ? 'Arrived' : `${diffMinutes} min`;
        }
    }

    updateRideStatus(newStatus) {
        this.rideData.status = newStatus;
        this.saveRideData();
        this.updateUI();
        this.updateProgress();
        
        // Handle status-specific actions
        switch (newStatus) {
            case 'arrived':
                this.handleDriverArrived();
                break;
            case 'picked_up':
                this.handlePickupComplete();
                break;
            case 'completed':
                this.handleRideComplete();
                break;
        }
    }

    handleDriverArrived() {
        const statusText = document.getElementById('statusText');
        if (statusText) {
            statusText.textContent = 'Driver Arrived';
        }
        
        // Show notification
        this.showNotification('Your driver has arrived!', 'success');
        
        // Update ETA
        const etaElement = document.querySelector('.eta-value');
        if (etaElement) {
            etaElement.textContent = 'Arrived';
        }
        
        // Simulate pickup after 30 seconds
        setTimeout(() => {
            this.updateRideStatus('picked_up');
        }, 30000);
    }

    handlePickupComplete() {
        const statusText = document.getElementById('statusText');
        if (statusText) {
            statusText.textContent = 'In Transit';
        }
        
        this.showNotification('Pickup complete! Heading to destination.', 'info');
        
        // Update estimated arrival to destination
        const now = new Date();
        this.rideData.estimatedArrival = new Date(now.getTime() + this.rideData.estimatedDuration * 60000).toISOString();
        
        // Simulate arrival at destination
        setTimeout(() => {
            this.updateRideStatus('completed');
        }, 60000); // 1 minute for demo
    }

    handleRideComplete() {
        this.stopLocationTracking();
        this.showNotification('Trip completed! Thank you for riding with Go Tawee.', 'success');
        
        // Redirect to completion page after delay
        setTimeout(() => {
            window.location.href = 'ride-complete.html';
        }, 3000);
    }

    updateUI() {
        this.updateDriverInfo();
        this.updateTripDetails();
        this.updateStatusIndicator();
    }

    updateDriverInfo() {
        const driver = this.rideData.driver;
        
        // Update driver name
        const nameElement = document.getElementById('driverName');
        if (nameElement) {
            nameElement.textContent = driver.name;
        }
        
        // Update vehicle info
        const makeElement = document.getElementById('vehicleMake');
        if (makeElement) {
            makeElement.textContent = driver.vehicle.make;
        }
        
        const plateElement = document.getElementById('vehiclePlate');
        if (plateElement) {
            plateElement.textContent = driver.vehicle.plate;
        }
    }

    updateTripDetails() {
        // Update addresses
        const pickupElement = document.getElementById('pickupAddress');
        if (pickupElement) {
            pickupElement.textContent = this.rideData.pickup.address;
        }
        
        const destElement = document.getElementById('destinationAddress');
        if (destElement) {
            destElement.textContent = this.rideData.destination.address;
        }
        
        // Update trip info
        const distanceElement = document.getElementById('tripDistance');
        if (distanceElement) {
            distanceElement.textContent = `${this.rideData.distance} km`;
        }
        
        const durationElement = document.getElementById('tripDuration');
        if (durationElement) {
            durationElement.textContent = `${this.rideData.estimatedDuration} min`;
        }
        
        const fareElement = document.getElementById('tripFare');
        if (fareElement) {
            fareElement.textContent = `₱${this.rideData.fare}`;
        }
    }

    updateStatusIndicator() {
        const statusText = document.getElementById('statusText');
        const statusIndicator = document.getElementById('statusIndicator');
        
        let statusMessage = '';
        let indicatorColor = '';
        
        switch (this.rideData.status) {
            case 'driver_en_route':
                statusMessage = 'Driver En Route';
                indicatorColor = '#FDBC22'; // Amber
                break;
            case 'arrived':
                statusMessage = 'Driver Arrived';
                indicatorColor = '#237E56'; // Green
                break;
            case 'picked_up':
                statusMessage = 'In Transit';
                indicatorColor = '#237E56'; // Green
                break;
            case 'completed':
                statusMessage = 'Trip Complete';
                indicatorColor = '#237E56'; // Green
                break;
        }
        
        if (statusText) {
            statusText.textContent = statusMessage;
        }
        
        if (statusIndicator) {
            statusIndicator.style.background = indicatorColor;
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const steps = document.querySelectorAll('.step');
        
        let progress = 0;
        let activeStep = 0;
        
        switch (this.rideData.status) {
            case 'driver_en_route':
                progress = 25;
                activeStep = 1;
                break;
            case 'arrived':
                progress = 50;
                activeStep = 2;
                break;
            case 'picked_up':
                progress = 75;
                activeStep = 2;
                break;
            case 'completed':
                progress = 100;
                activeStep = 3;
                break;
        }
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        // Update step states
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index < activeStep) {
                step.classList.add('completed');
            } else if (index === activeStep) {
                step.classList.add('active');
            }
        });
    }

    startStatusUpdates() {
        this.statusUpdateInterval = setInterval(() => {
            this.updateETA();
        }, 30000); // Update every 30 seconds
    }

    // Communication methods
    callDriver() {
        const phone = this.rideData.driver.phone;
        if (phone) {
            window.location.href = `tel:${phone}`;
        } else {
            this.showNotification('Unable to call driver at this time.', 'error');
        }
    }

    messageDriver() {
        // In a real app, this would open a messaging interface
        this.showNotification('Messaging feature coming soon!', 'info');
    }

    contactSupport() {
        // In a real app, this would open support chat
        this.showNotification('Connecting you to Go Tawee support...', 'info');
    }

    // Emergency methods
    showEmergencyModal() {
        const modal = document.getElementById('emergencyModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    callPolice() {
        this.closeEmergencyModal();
        window.location.href = 'tel:911';
    }

    shareTrip() {
        this.closeEmergencyModal();
        
        if (navigator.share) {
            navigator.share({
                title: 'My Go Tawee Trip',
                text: `I'm currently on a Go Tawee ride. Driver: ${this.rideData.driver.name}, Vehicle: ${this.rideData.driver.vehicle.make} ${this.rideData.driver.vehicle.plate}`,
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            const shareText = `I'm currently on a Go Tawee ride. Driver: ${this.rideData.driver.name}, Vehicle: ${this.rideData.driver.vehicle.make} ${this.rideData.driver.vehicle.plate}. Trip ID: ${this.rideData.id}`;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(shareText);
                this.showNotification('Trip details copied to clipboard!', 'success');
            } else {
                this.showNotification('Unable to share trip details.', 'error');
            }
        }
    }

    cancelRide() {
        if (confirm('Are you sure you want to cancel this ride? Cancellation fees may apply.')) {
            this.stopLocationTracking();
            localStorage.removeItem('currentRide');
            this.showNotification('Ride cancelled successfully.', 'info');
            
            setTimeout(() => {
                window.location.href = 'ride-booking.html';
            }, 2000);
        }
    }

    // Utility methods
    showNotification(message, type = 'info') {
        // Simple console log instead of toast notifications
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // For critical messages, use browser alert
        if (type === 'error' || message.includes('Emergency') || message.includes('cancelled')) {
            alert(message);
        }
    }

    cleanup() {
        this.stopLocationTracking();
        if (this.statusUpdateInterval) {
            clearInterval(this.statusUpdateInterval);
        }
    }
}

// Global functions for modal
function closeEmergencyModal() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.rideTracker = new RideTracker();
});

// Cleanup when page unloads
window.addEventListener('beforeunload', () => {
    if (window.rideTracker) {
        window.rideTracker.cleanup();
    }
});

// Handle modal clicks outside content
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeEmergencyModal();
    }
});