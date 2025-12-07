// Go Tawi HomeScreen functionality
class GoTawiApp {
    constructor() {
        this.cart = [];
        this.favorites = new Set();
        this.activeCategory = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartBadge();
    }

    setupEventListeners() {
        // Top bar interactions
        const cartIcon = document.querySelector('.cart-icon');
        const profileIcon = document.querySelector('.profile-icon');
        
        if (cartIcon) {
            cartIcon.addEventListener('click', () => this.showCart());
        }
        
        if (profileIcon) {
            profileIcon.addEventListener('click', () => this.showProfile());
        }

        // Delivery location click
        const deliveryLocation = document.querySelector('.delivery-location');
        if (deliveryLocation) {
            deliveryLocation.addEventListener('click', () => this.changeLocation());
        }

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        const filterBtn = document.querySelector('.filter-button');
        
        if (searchInput) {
            searchInput.addEventListener('focus', () => this.showSearchSuggestions());
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
        
        if (filterBtn) {
            filterBtn.addEventListener('click', () => this.showFilters());
        }

        // Deal cards
        document.querySelectorAll('.deal-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleDealClick(e.currentTarget));
        });

        // Category items
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => this.selectCategory(e.currentTarget));
        });

        // Food cards
        document.querySelectorAll('.food-card').forEach(card => {
            const addBtn = card.querySelector('.add-to-cart-btn');
            const favoriteBtn = card.querySelector('.favorite-btn');
            
            if (addBtn) {
                addBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.addToCart(e.currentTarget);
                });
            }
            
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleFavorite(e.currentTarget);
                });
            }
            
            card.addEventListener('click', () => this.showFoodDetails(card));
        });

        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e.currentTarget));
        });
    }

    showCart() {
        const cartModal = this.createModal('Your Cart', this.generateCartContent());
        this.showModal(cartModal);
    }

    showProfile() {
        const profileModal = this.createModal('Profile', `
            <div class="profile-content">
                <div class="profile-avatar">👤</div>
                <h3>John Doe</h3>
                <p>john.doe@email.com</p>
                <div class="profile-stats">
                    <div class="stat">
                        <span class="stat-number">15</span>
                        <span class="stat-label">Orders</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">⭐ 4.8</span>
                        <span class="stat-label">Rating</span>
                    </div>
                </div>
                <button class="profile-btn">Edit Profile</button>
                <button class="profile-btn">Order History</button>
                <button class="profile-btn">Settings</button>
            </div>
        `);
        this.showModal(profileModal);
    }

    changeLocation() {
        const locationModal = this.createModal('Delivery Location', `
            <div class="location-content">
                <div class="current-location">
                    <h4>📍 Current Location</h4>
                    <p>Downtown, City</p>
                </div>
                <div class="location-search">
                    <input type="text" placeholder="Enter new address..." class="location-input">
                    <button class="location-search-btn">Search</button>
                </div>
                <div class="saved-locations">
                    <h4>Saved Addresses</h4>
                    <div class="location-item">
                        <span>🏠 Home - 123 Main St</span>
                    </div>
                    <div class="location-item">
                        <span>💼 Work - 456 Office Ave</span>
                    </div>
                </div>
            </div>
        `);
        this.showModal(locationModal);
    }

    showSearchSuggestions() {
        this.showToast('🔍 Search for restaurants, cuisines, or dishes');
    }

    handleSearch(query) {
        if (query.length > 2) {
            // Simulate search results
            console.log('Searching for:', query);
        }
    }

    showFilters() {
        const filterModal = this.createModal('Filters', `
            <div class="filter-content">
                <div class="filter-section">
                    <h4 class="filter-section-title">Sort By</h4>
                    <div class="filter-options">
                        <button class="filter-option active" data-filter="sort" data-value="recommended">
                            <span class="filter-icon">⭐</span>
                            <span>Recommended</span>
                        </button>
                        <button class="filter-option" data-filter="sort" data-value="nearest">
                            <span class="filter-icon">📍</span>
                            <span>Nearest</span>
                        </button>
                        <button class="filter-option" data-filter="sort" data-value="rating">
                            <span class="filter-icon">⭐</span>
                            <span>Rating</span>
                        </button>
                        <button class="filter-option" data-filter="sort" data-value="delivery-time">
                            <span class="filter-icon">⚡</span>
                            <span>Delivery Time</span>
                        </button>
                    </div>
                </div>

                <div class="filter-section">
                    <h4 class="filter-section-title">Price Range</h4>
                    <div class="filter-range-container">
                        <div class="range-slider">
                            <input type="range" class="price-range-input" min="0" max="100" value="50" step="5">
                            <div class="range-values">
                                <span class="range-min">$0</span>
                                <span class="range-current">$50</span>
                                <span class="range-max">$100+</span>
                            </div>
                        </div>
                    </div>
                    <div class="filter-options">
                        <button class="filter-option" data-filter="price" data-value="budget">
                            <span class="filter-icon">💵</span>
                            <span>$ Budget</span>
                        </button>
                        <button class="filter-option" data-filter="price" data-value="moderate">
                            <span class="filter-icon">💰</span>
                            <span>$$ Moderate</span>
                        </button>
                        <button class="filter-option" data-filter="price" data-value="premium">
                            <span class="filter-icon">💎</span>
                            <span>$$$ Premium</span>
                        </button>
                    </div>
                </div>

                <div class="filter-section">
                    <h4 class="filter-section-title">Cuisine Type</h4>
                    <div class="filter-options filter-checkboxes">
                        <label class="filter-checkbox">
                            <input type="checkbox" data-cuisine="asian">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-label">🍜 Asian</span>
                        </label>
                        <label class="filter-checkbox">
                            <input type="checkbox" data-cuisine="italian">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-label">🍝 Italian</span>
                        </label>
                        <label class="filter-checkbox">
                            <input type="checkbox" data-cuisine="american">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-label">🍔 American</span>
                        </label>
                        <label class="filter-checkbox">
                            <input type="checkbox" data-cuisine="mexican">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-label">🌮 Mexican</span>
                        </label>
                        <label class="filter-checkbox">
                            <input type="checkbox" data-cuisine="dessert">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-label">🍰 Dessert</span>
                        </label>
                        <label class="filter-checkbox">
                            <input type="checkbox" data-cuisine="healthy">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-label">🥗 Healthy</span>
                        </label>
                    </div>
                </div>

                <div class="filter-section">
                    <h4 class="filter-section-title">Delivery Time</h4>
                    <div class="filter-options">
                        <button class="filter-option" data-filter="delivery" data-value="fast">
                            <span class="filter-icon">⚡</span>
                            <span>Under 20 min</span>
                        </button>
                        <button class="filter-option" data-filter="delivery" data-value="medium">
                            <span class="filter-icon">🚴</span>
                            <span>20-30 min</span>
                        </button>
                        <button class="filter-option" data-filter="delivery" data-value="slow">
                            <span class="filter-icon">🚗</span>
                            <span>30+ min</span>
                        </button>
                    </div>
                </div>

                <div class="filter-section">
                    <h4 class="filter-section-title">Rating</h4>
                    <div class="filter-options">
                        <button class="filter-option" data-filter="rating" data-value="4.5">
                            <span class="filter-icon">⭐</span>
                            <span>4.5+ Stars</span>
                        </button>
                        <button class="filter-option" data-filter="rating" data-value="4.0">
                            <span class="filter-icon">⭐</span>
                            <span>4.0+ Stars</span>
                        </button>
                        <button class="filter-option" data-filter="rating" data-value="3.5">
                            <span class="filter-icon">⭐</span>
                            <span>3.5+ Stars</span>
                        </button>
                    </div>
                </div>

                <div class="filter-section">
                    <h4 class="filter-section-title">Dietary Preferences</h4>
                    <div class="filter-options filter-checkboxes">
                        <label class="filter-checkbox">
                            <input type="checkbox" data-dietary="vegetarian">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-label">🥬 Vegetarian</span>
                        </label>
                        <label class="filter-checkbox">
                            <input type="checkbox" data-dietary="vegan">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-label">🌱 Vegan</span>
                        </label>
                        <label class="filter-checkbox">
                            <input type="checkbox" data-dietary="gluten-free">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-label">🌾 Gluten-Free</span>
                        </label>
                        <label class="filter-checkbox">
                            <input type="checkbox" data-dietary="halal">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-label">☪️ Halal</span>
                        </label>
                    </div>
                </div>

                <div class="filter-actions">
                    <button class="clear-filters-btn">Clear All</button>
                    <button class="apply-filters-btn">Apply Filters</button>
                </div>
            </div>
        `);
        this.showModal(filterModal);
        this.setupFilterInteractions();
    }

    setupFilterInteractions() {
        const modal = document.querySelector('.modal-overlay');
        if (!modal) return;

        // Single-select filter options (Sort By, Price, Delivery, Rating)
        const singleSelectOptions = modal.querySelectorAll('.filter-option');
        singleSelectOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const filterType = option.dataset.filter;
                if (filterType) {
                    // Remove active from same filter type
                    modal.querySelectorAll(`[data-filter="${filterType}"]`).forEach(opt => {
                        opt.classList.remove('active');
                    });
                    option.classList.add('active');
                }
            });
        });

        // Price range slider
        const priceRangeInput = modal.querySelector('.price-range-input');
        const rangeCurrent = modal.querySelector('.range-current');
        if (priceRangeInput && rangeCurrent) {
            priceRangeInput.addEventListener('input', (e) => {
                const value = e.target.value;
                rangeCurrent.textContent = `$${value}${value >= 100 ? '+' : ''}`;
            });
        }

        // Clear filters
        const clearBtn = modal.querySelector('.clear-filters-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                // Reset all single-select options
                modal.querySelectorAll('.filter-option').forEach(opt => opt.classList.remove('active'));
                modal.querySelector('[data-value="recommended"]')?.classList.add('active');
                
                // Reset checkboxes
                modal.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                
                // Reset price range
                if (priceRangeInput) {
                    priceRangeInput.value = 50;
                    rangeCurrent.textContent = '$50';
                }
                
                this.showToast('🔄 Filters cleared');
            });
        }

        // Apply filters
        const applyBtn = modal.querySelector('.apply-filters-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                const selectedFilters = this.getSelectedFilters(modal);
                console.log('Applying filters:', selectedFilters);
                this.showToast('✅ Filters applied');
                modal.remove();
            });
        }
    }

    getSelectedFilters(modal) {
        const filters = {
            sort: null,
            price: { range: 50, tier: null },
            cuisine: [],
            delivery: null,
            rating: null,
            dietary: []
        };

        // Get sort option
        const activeSort = modal.querySelector('[data-filter="sort"].active');
        if (activeSort) filters.sort = activeSort.dataset.value;

        // Get price tier
        const activePrice = modal.querySelector('[data-filter="price"].active');
        if (activePrice) filters.price.tier = activePrice.dataset.value;
        
        // Get price range
        const priceRange = modal.querySelector('.price-range-input');
        if (priceRange) filters.price.range = priceRange.value;

        // Get cuisine types
        modal.querySelectorAll('input[data-cuisine]:checked').forEach(cb => {
            filters.cuisine.push(cb.dataset.cuisine);
        });

        // Get delivery time
        const activeDelivery = modal.querySelector('[data-filter="delivery"].active');
        if (activeDelivery) filters.delivery = activeDelivery.dataset.value;

        // Get rating
        const activeRating = modal.querySelector('[data-filter="rating"].active');
        if (activeRating) filters.rating = activeRating.dataset.value;

        // Get dietary preferences
        modal.querySelectorAll('input[data-dietary]:checked').forEach(cb => {
            filters.dietary.push(cb.dataset.dietary);
        });

        return filters;
    }

    handleDealClick(dealCard) {
        const dealTitle = dealCard.querySelector('h4').textContent;
        const dealCode = dealCard.querySelector('.deal-code').textContent;
        
        navigator.clipboard.writeText(dealCode).then(() => {
            this.showToast(`✅ Copied code: ${dealCode}`);
        }).catch(() => {
            this.showToast(`📋 Deal code: ${dealCode}`);
        });
    }

    selectCategory(categoryItem) {
        // Remove active state from all categories
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active state to selected category
        categoryItem.classList.add('active');
        
        const categoryName = categoryItem.querySelector('.category-name').textContent;
        this.activeCategory = categoryName;
        
        this.showToast(`🍽️ Browsing ${categoryName} restaurants`);
        
        // Scroll to recommended section
        document.querySelector('.recommended-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    addToCart(button) {
        const foodCard = button.closest('.food-card');
        const foodName = foodCard.querySelector('.food-name').textContent;
        const restaurantName = foodCard.querySelector('.restaurant-name').textContent;
        const price = parseFloat(foodCard.querySelector('.food-price').textContent.replace('$', ''));
        
        const item = {
            id: Date.now(),
            name: foodName,
            restaurant: restaurantName,
            price: price,
            quantity: 1
        };
        
        this.cart.push(item);
        this.updateCartBadge();
        this.showToast(`✅ Added ${foodName} to cart`);
        
        // Add visual feedback
        button.style.transform = 'scale(0.8)';
        setTimeout(() => {
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        }, 100);
    }

    toggleFavorite(button) {
        const foodCard = button.closest('.food-card');
        const foodName = foodCard.querySelector('.food-name').textContent;
        
        if (this.favorites.has(foodName)) {
            this.favorites.delete(foodName);
            button.textContent = '🤍';
            this.showToast(`💔 Removed ${foodName} from favorites`);
        } else {
            this.favorites.add(foodName);
            button.textContent = '❤️';
            this.showToast(`❤️ Added ${foodName} to favorites`);
        }
    }

    showFoodDetails(foodCard) {
        const foodName = foodCard.querySelector('.food-name').textContent;
        const restaurantName = foodCard.querySelector('.restaurant-name').textContent;
        const price = foodCard.querySelector('.food-price').textContent;
        const rating = foodCard.querySelector('.rating').textContent;
        
        const detailModal = this.createModal(foodName, `
            <div class="food-detail">
                <div class="food-detail-image">
                    <div class="food-emoji">${foodCard.querySelector('.food-emoji').textContent}</div>
                </div>
                <div class="food-detail-info">
                    <h3>${foodName}</h3>
                    <p class="restaurant">${restaurantName}</p>
                    <div class="food-detail-meta">
                        <span>${rating}</span>
                        <span>•</span>
                        <span>20-30 min</span>
                        <span>•</span>
                        <span>${price}</span>
                    </div>
                    <div class="food-description">
                        <p>Delicious and fresh ${foodName.toLowerCase()} made with the finest ingredients. Perfect for any time of day!</p>
                    </div>
                    <div class="food-options">
                        <h4>Customizations</h4>
                        <label><input type="checkbox"> Extra sauce</label>
                        <label><input type="checkbox"> Extra cheese</label>
                        <label><input type="checkbox"> Spicy</label>
                    </div>
                    <div class="quantity-section">
                        <span>Quantity:</span>
                        <div class="quantity-controls">
                            <button class="qty-btn">-</button>
                            <span class="qty-display">1</span>
                            <button class="qty-btn">+</button>
                        </div>
                    </div>
                    <button class="add-to-cart-detail-btn">Add to Cart - ${price}</button>
                </div>
            </div>
        `);
        this.showModal(detailModal);
    }

    handleNavigation(navItem) {
        // Remove active state from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active state to clicked item
        navItem.classList.add('active');
        
        const navLabel = navItem.querySelector('.nav-label').textContent;
        
        // Morph background shape and shadow based on navigation
        const backgroundAccent = document.querySelector('.background-accent');
        const backgroundShadow = document.querySelector('.background-accent-shadow');
        
        // Remove all morph classes from both elements
        backgroundAccent.classList.remove('morph-home', 'morph-search', 'morph-orders', 'morph-profile');
        backgroundShadow.classList.remove('morph-home', 'morph-search', 'morph-orders', 'morph-profile');
        
        switch(navLabel) {
            case 'Home':
                backgroundAccent.classList.add('morph-home');
                backgroundShadow.classList.add('morph-home');
                this.showToast('🏠 Welcome to Go Tawi!');
                break;
            case 'Search':
                backgroundAccent.classList.add('morph-search');
                backgroundShadow.classList.add('morph-search');
                this.showToast('🔍 Search screen - Coming soon!');
                break;
            case 'Orders':
                backgroundAccent.classList.add('morph-orders');
                backgroundShadow.classList.add('morph-orders');
                this.showToast('📋 Orders screen - Coming soon!');
                break;
            case 'Profile':
                backgroundAccent.classList.add('morph-profile');
                backgroundShadow.classList.add('morph-profile');
                this.showToast('👤 Profile screen - Coming soon!');
                break;
        }
    }

    updateCartBadge() {
        const cartBadge = document.querySelector('.cart-badge');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartBadge) {
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    generateCartContent() {
        if (this.cart.length === 0) {
            return `
                <div class="cart-empty-state">
                    <div class="empty-cart-illustration">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="8" cy="21" r="1"></circle>
                            <circle cx="19" cy="21" r="1"></circle>
                            <path d="m2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43h-15.12"></path>
                        </svg>
                    </div>
                    <h3>Your cart is empty</h3>
                    <p>Add some delicious items to get started!</p>
                    <button class="browse-food-btn" onclick="app.browseFoodItems()">Browse Food</button>
                </div>
            `;
        }
        
        const cartItems = this.cart.map(item => `
            <div class="cart-item-card">
                <div class="cart-item-image">
                    <div class="cart-food-icon">${this.getFoodIcon(item.name)}</div>
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-restaurant">${item.restaurant}</p>
                    <div class="cart-item-price-section">
                        <span class="cart-item-unit-price">$${item.price.toFixed(2)} each</span>
                        <span class="cart-item-total-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-decrease" onclick="app.updateQuantity(${item.id}, ${item.quantity - 1})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-increase" onclick="app.updateQuantity(${item.id}, ${item.quantity + 1})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
        
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = subtotal > 25 ? 0 : 2.99;
        const total = subtotal + deliveryFee;
        
        return `
            <div class="cart-content-wrapper">
                <div class="cart-header-info">
                    <h3>Your Order</h3>
                    <p class="cart-item-count">${this.cart.length} ${this.cart.length === 1 ? 'item' : 'items'}</p>
                </div>
                
                <div class="cart-items-list">
                    ${cartItems}
                </div>
                
                <div class="cart-summary">
                    <div class="promo-code-section">
                        <input type="text" placeholder="Enter promo code" class="promo-input">
                        <button class="apply-promo-btn">Apply</button>
                    </div>
                    
                    <div class="cart-totals">
                        <div class="cart-total-line">
                            <span>Subtotal</span>
                            <span>$${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="cart-total-line">
                            <span>Delivery Fee</span>
                            <span class="${deliveryFee === 0 ? 'free-delivery' : ''}">${deliveryFee === 0 ? 'FREE' : '$' + deliveryFee.toFixed(2)}</span>
                        </div>
                        ${deliveryFee === 0 ? '<div class="free-delivery-note">🎉 Free delivery on orders over $25!</div>' : ''}
                        <div class="cart-total-line total">
                            <span>Total</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <button class="checkout-button-main" onclick="app.proceedToCheckout()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 12l2 2 4-4"></path>
                        </svg>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        `;
    }

    getFoodIcon(foodName) {
        const iconMap = {
            'Margherita Pizza': '🍕',
            'Pepperoni Pizza': '🍕',
            'Classic Burger': '🍔',
            'Cheese Burger': '🍔',
            'Beef Noodle Soup': '🍜',
            'Pad Thai': '🍜',
            'Beef Tacos': '🌮',
            'Chicken Quesadilla': '🌮'
        };
        return iconMap[foodName] || '🍽️';
    }

    browseFoodItems() {
        // Close cart modal
        const modal = document.querySelector('.modal-overlay');
        if (modal) modal.remove();
        
        // Scroll to recommended section
        document.querySelector('.recommended-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
        this.showToast('🍽️ Browse our delicious food items below!');
    }

    proceedToCheckout() {
        this.showToast('🚀 Proceeding to checkout - Coming soon!');
    }

    updateQuantity(itemId, newQuantity) {
        if (newQuantity <= 0) {
            this.cart = this.cart.filter(item => item.id !== itemId);
        } else {
            const item = this.cart.find(item => item.id === itemId);
            if (item) {
                item.quantity = newQuantity;
            }
        }
        
        this.updateCartBadge();
        // Refresh cart modal if open
        const modal = document.querySelector('.modal-overlay');
        if (modal && modal.querySelector('.cart-content')) {
            modal.querySelector('.modal-body').innerHTML = this.generateCartContent();
        }
    }

    createModal(title, content) {
        return `
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">✕</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        `;
    }

    showModal(modalContent) {
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                ${modalContent}
            </div>
        `;
        
        // Add styles
        this.addModalStyles(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        document.body.appendChild(modal);
    }

    addModalStyles(modal) {
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
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: white;
            border-radius: 20px;
            max-width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        `;
        
        const modalHeader = modal.querySelector('.modal-header');
        if (modalHeader) {
            modalHeader.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #eee;
            `;
        }
        
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.style.cssText = `
                padding: 20px;
            `;
        }
    }

    showToast(message) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--evergreen);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            z-index: 3000;
            animation: toastSlideUp 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toastSlideDown 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes toastSlideUp {
        from { transform: translateX(-50%) translateY(100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes toastSlideDown {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(100%); opacity: 0; }
    }
    
    .category-item.active .category-icon {
        background: var(--turf-green);
        color: white;
    }
    
    .category-item.active .category-name {
        color: var(--turf-green);
        font-weight: 700;
    }
`;
document.head.appendChild(style);

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new GoTawiApp();
});