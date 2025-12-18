/**
 * ============================================================================
 * GO TAWI - RIDE BOOKING FUNCTIONALITY
 * ============================================================================
 * 
 * @file        ride-booking.js
 * @description Interactive functionality for the ride booking interface
 * @version     1.0.0
 * 
 * Features:
 * - Location input handling and validation
 * - GPS location services
 * - Vehicle selection and pricing
 * - Booking flow management
 * - Real-time fare estimation
 * - Map integration placeholder
 */

class RideBookingManager {
    constructor() {
        this.selectedVehicle = null;
        this.pickupLocation = null;
        this.destinationLocation = null;
        this.estimatedFare = 0;
        this.estimatedDistance = 0;
        this.estimatedDuration = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupLocationServices();
        this.setupVehicleSelection();
        this.updateBookingButton();
    }

    setupEventListeners() {
        // Location input handlers
        const pickupInput = document.getElementById('pickupInput');
        const destinationInput = document.getElementById('destinationInput');
        const useCurrentLocationBtn = document.getElementById('useCurrentLocation');
        const swapBtn = document.getElementById('swapLocations');

        if (pickupInput) {
            pickupInput.addEventListener('input', (e) => this.handleLocationInput('pickup', e.target.value));
            pickupInput.addEventListener('focus', () => this.showLocationSuggestions('pickup'));
        }

        if (destinationInput) {
            destinationInput.addEventListener('input', (e) => this.handleLocationInput('destination', e.target.value));
            destinationInput.addEventListener('focus', () => this.showSavedLocations());
        }

        if (useCurrentLocationBtn) {
            useCurrentLocationBtn.addEventListener('click', () => this.getCurrentLocation());
        }

        if (swapBtn) {
            swapBtn.addEventListener('click', () => this.swapLocations());
        }

        // Saved location handlers
        document.querySelectorAll('.saved-location-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const locationData = this.getSavedLocationData(btn.dataset.location);
                this.setDestination(locationData);
            });
        });

        // Book ride button
        const bookRideBtn = document.getElementById('bookRideBtn');
        if (bookRideBtn) {
            bookRideBtn.addEventListener('click', () => this.initiateBooking());
        }

        // Map controls
        const centerMapBtn = document.getElementById('centerMap');
        if (centerMapBtn) {
            centerMapBtn.addEventListener('click', () => this.centerMap());
        }
    }

    setupLocationServices() {
        // Initialize location services
        this.locationService = {
            getCurrentPosition: () => {
                return new Promise((resolve, reject) => {
                    if (!navigator.geolocation) {
                        reject(new Error('Geolocation is not supported'));
                        return;
                    }

                    navigator.geolocation.getCurrentPosition(
                        position => resolve(position),
                        error => reject(error),
                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 300000
                        }
                    );
                });
            },

            reverseGeocode: (lat, lng) => {
                // Placeholder for reverse geocoding service
                // In real implementation, would use Google Maps API or similar
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve({
                            address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                            formatted: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`
                        });
                    }, 500);
                });
            },

            geocode: (address) => {
                // Placeholder for geocoding service
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve({
                            lat: 5.0704 + (Math.random() - 0.5) * 0.01,
                            lng: 119.9074 + (Math.random() - 0.5) * 0.01,
                            formatted: address
                        });
                    }, 500);
                });
            }
        };
    }

    setupVehicleSelection() {
        document.querySelectorAll('.vehicle-option').forEach(option => {
            option.addEventListener('click', () => {
                // Remove previous selection
                document.querySelectorAll('.vehicle-option').forEach(opt => 
                    opt.classList.remove('selected')
                );
                
                // Select current option
                option.classList.add('selected');
                this.selectedVehicle = option.dataset.vehicle;
                
                // Update pricing
                this.updatePricing();
                this.updateBookingButton();
            });
        });
    }

    async getCurrentLocation() {
        const useCurrentLocationBtn = document.getElementById('useCurrentLocation');
        const pickupInput = document.getElementById('pickupInput');

        try {
            // Show loading state
            useCurrentLocationBtn.classList.add('loading');
            useCurrentLocationBtn.textContent = 'Getting location...';

            const position = await this.locationService.getCurrentPosition();
            const { latitude, longitude } = position.coords;

            // Reverse geocode to get address
            const locationData = await this.locationService.reverseGeocode(latitude, longitude);

            this.pickupLocation = {
                lat: latitude,
                lng: longitude,
                address: locationData.formatted
            };

            pickupInput.value = locationData.formatted;
            this.updateRouteAndPricing();

        } catch (error) {
            console.error('Error getting current location:', error);
            this.showNotification('Unable to get your current location. Please enter manually.', 'error');
        } finally {
            // Reset button state
            useCurrentLocationBtn.classList.remove('loading');
            useCurrentLocationBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="12,6 17,11 12,16 7,11"></polygon>
                </svg>
                Use Current Location
            `;
        }
    }

    async handleLocationInput(type, value) {
        if (value.length < 3) return;

        try {
            // Debounce the input
            clearTimeout(this.inputTimeout);
            this.inputTimeout = setTimeout(async () => {
                const locationData = await this.locationService.geocode(value);
                
                if (type === 'pickup') {
                    this.pickupLocation = {
                        lat: locationData.lat,
                        lng: locationData.lng,
                        address: value
                    };
                } else {
                    this.destinationLocation = {
                        lat: locationData.lat,
                        lng: locationData.lng,
                        address: value
                    };
                }

                this.updateRouteAndPricing();
            }, 1000);

        } catch (error) {
            console.error('Error geocoding location:', error);
        }
    }

    swapLocations() {
        const pickupInput = document.getElementById('pickupInput');
        const destinationInput = document.getElementById('destinationInput');

        // Swap input values
        const tempValue = pickupInput.value;
        pickupInput.value = destinationInput.value;
        destinationInput.value = tempValue;

        // Swap location data
        const tempLocation = this.pickupLocation;
        this.pickupLocation = this.destinationLocation;
        this.destinationLocation = tempLocation;

        this.updateRouteAndPricing();
    }

    showSavedLocations() {
        const savedLocations = document.getElementById('savedLocations');
        if (savedLocations) {
            savedLocations.style.display = 'block';
        }
    }

    getSavedLocationData(locationType) {
        const savedLocations = {
            home: {
                lat: 5.0704,
                lng: 119.9074,
                address: 'Old Housing, Bongao'
            },
            work: {
                lat: 5.0654,
                lng: 119.9124,
                address: 'Tawi-Tawi Provincial Capitol'
            }
        };

        return savedLocations[locationType];
    }

    setDestination(locationData) {
        const destinationInput = document.getElementById('destinationInput');
        destinationInput.value = locationData.address;
        this.destinationLocation = locationData;
        
        // Hide saved locations
        const savedLocations = document.getElementById('savedLocations');
        if (savedLocations) {
            savedLocations.style.display = 'none';
        }

        this.updateRouteAndPricing();
    }

    updateRouteAndPricing() {
        if (this.pickupLocation && this.destinationLocation) {
            // Calculate distance and duration (simplified)
            const distance = this.calculateDistance(
                this.pickupLocation.lat,
                this.pickupLocation.lng,
                this.destinationLocation.lat,
                this.destinationLocation.lng
            );

            this.estimatedDistance = distance;
            this.estimatedDuration = Math.max(5, Math.round(distance * 2)); // 2 min per km minimum 5 min

            // Update UI
            document.getElementById('tripDistance').textContent = `${distance.toFixed(1)} km`;
            document.getElementById('tripDuration').textContent = `${this.estimatedDuration} min`;

            this.updatePricing();
            this.updateMap();
        }
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        // Haversine formula for distance calculation
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    updatePricing() {
        if (!this.selectedVehicle || !this.estimatedDistance) return;

        // Pricing logic based on vehicle type and distance
        const baseFares = {
            standard: { base: 50, perKm: 15 },
            premium: { base: 80, perKm: 25 },
            shared: { base: 30, perKm: 10 }
        };

        const vehiclePricing = baseFares[this.selectedVehicle];
        this.estimatedFare = Math.round(vehiclePricing.base + (this.estimatedDistance * vehiclePricing.perKm));

        // Update vehicle option pricing
        const selectedOption = document.querySelector('.vehicle-option.selected .price');
        if (selectedOption) {
            selectedOption.textContent = `₱${this.estimatedFare}`;
        }

        this.updateBookingButton();
    }

    updateBookingButton() {
        const bookRideBtn = document.getElementById('bookRideBtn');
        const bookBtnText = document.querySelector('.book-btn-text');
        const bookBtnPrice = document.getElementById('bookBtnPrice');

        if (!bookRideBtn) return;

        const hasLocations = this.pickupLocation && this.destinationLocation;
        const hasVehicle = this.selectedVehicle;

        if (hasLocations && hasVehicle) {
            bookRideBtn.disabled = false;
            bookBtnText.textContent = 'Book GoTawi Ride';
            bookBtnPrice.textContent = `₱${this.estimatedFare}`;
        } else if (hasLocations && !hasVehicle) {
            bookRideBtn.disabled = true;
            bookBtnText.textContent = 'Select a vehicle';
            bookBtnPrice.textContent = '';
        } else {
            bookRideBtn.disabled = true;
            bookBtnText.textContent = 'Select pickup & destination';
            bookBtnPrice.textContent = '';
        }
    }

    updateMap() {
        // Placeholder for map updates
        // In real implementation, would update map with route
        const mapContainer = document.getElementById('mapContainer');
        const mapPlaceholder = mapContainer.querySelector('.map-placeholder');
        
        if (mapPlaceholder) {
            mapPlaceholder.innerHTML = `
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <p>Route: ${this.estimatedDistance.toFixed(1)} km • ${this.estimatedDuration} min</p>
            `;
        }
    }

    centerMap() {
        // Placeholder for map centering
        this.showNotification('Map centered on route', 'success');
    }

    async initiateBooking() {
        if (!this.pickupLocation || !this.destinationLocation || !this.selectedVehicle) {
            this.showNotification('Please complete all booking details', 'error');
            return;
        }

        // Show booking confirmation
        const confirmation = await this.showBookingConfirmation();
        if (!confirmation) return;

        // Start booking process
        this.processBooking();
    }

    showBookingConfirmation() {
        return new Promise(resolve => {
            const confirmationModal = document.createElement('div');
            confirmationModal.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                ">
                    <div style="
                        background: white;
                        border-radius: 16px;
                        padding: 24px;
                        max-width: 350px;
                        width: 100%;
                        text-align: center;
                    ">
                        <h3 style="margin: 0 0 16px; color: var(--evergreen);">Confirm Your Ride</h3>
                        <div style="margin-bottom: 20px; text-align: left; line-height: 1.5;">
                            <p style="margin: 8px 0; color: #666; font-size: 14px;">
                                <strong>From:</strong> ${this.pickupLocation.address}
                            </p>
                            <p style="margin: 8px 0; color: #666; font-size: 14px;">
                                <strong>To:</strong> ${this.destinationLocation.address}
                            </p>
                            <p style="margin: 8px 0; color: #666; font-size: 14px;">
                                <strong>Vehicle:</strong> GoTawi ${this.selectedVehicle.charAt(0).toUpperCase() + this.selectedVehicle.slice(1)}
                            </p>
                            <p style="margin: 8px 0; color: var(--evergreen); font-size: 16px; font-weight: 600;">
                                <strong>Total: ₱${this.estimatedFare}</strong>
                            </p>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <button onclick="this.closest('div').parentElement.remove(); window.rideBooking.handleConfirmation(false)" 
                                style="flex: 1; padding: 12px; border: 2px solid #e0e0e0; background: white; border-radius: 8px; cursor: pointer;">
                                Cancel
                            </button>
                            <button onclick="this.closest('div').parentElement.remove(); window.rideBooking.handleConfirmation(true)"
                                style="flex: 1; padding: 12px; border: none; background: var(--turf-green); color: white; border-radius: 8px; cursor: pointer; font-weight: 600;">
                                Confirm Ride
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(confirmationModal);
            
            // Store resolve function for button handlers
            this.confirmationResolve = resolve;
        });
    }

    handleConfirmation(confirmed) {
        if (this.confirmationResolve) {
            this.confirmationResolve(confirmed);
            this.confirmationResolve = null;
        }
    }

    async processBooking() {
        this.showNotification('Booking your ride...', 'info');

        // Simulate booking process
        setTimeout(() => {
            // Save ride data for tracking
            const rideData = {
                id: 'ride_' + Date.now(),
                status: 'driver_en_route',
                driver: {
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
                    address: this.pickupLocation,
                    lat: 14.5995,
                    lng: 120.9842
                },
                destination: {
                    address: this.destinationLocation,
                    lat: 14.6091,
                    lng: 120.9947
                },
                fare: this.currentFare,
                distance: this.estimatedDistance,
                estimatedDuration: this.estimatedDuration,
                bookingTime: new Date().toISOString(),
                estimatedArrival: new Date(Date.now() + 5 * 60000).toISOString()
            };
            
            localStorage.setItem('currentRide', JSON.stringify(rideData));
            
            this.showNotification('Ride booked successfully! Redirecting to tracking...', 'success');
            
            // Redirect to ride tracking
            setTimeout(() => {
                window.location.href = 'ride-tracking.html';
            }, 2000);
        }, 2000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = {
            success: 'var(--turf-green)',
            error: '#dc3545',
            warning: 'var(--amber-flame)',
            info: 'var(--evergreen)'
        }[type];

        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: ${bgColor};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            ">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 4000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.rideBooking = new RideBookingManager();
});

// Export for global access
window.RideBookingManager = RideBookingManager;