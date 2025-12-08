// Food Detail Modal System
class FoodModal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
        this.createModal();
    }

    createModal() {
        // Create modal container
        this.modal = document.createElement('div');
        this.modal.id = 'foodModal';
        this.modal.className = 'food-modal';
        this.modal.innerHTML = `
            <div class="food-modal-overlay" onclick="foodModal.close()"></div>
            <div class="food-modal-content">
                <div class="food-modal-scroll">
                    <!-- Food Image Section -->
                    <div class="food-image-section">
                        <img src="" alt="Food" class="food-image" id="modalFoodImage">
                        <div class="image-overlay">
                            <button class="back-button" onclick="foodModal.close()">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                                </svg>
                            </button>
                            <button class="favorite-button" id="modalFavoriteBtn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Food Info Section -->
                    <div class="food-info-section">
                        <h1 class="food-title" id="modalFoodTitle">Loading...</h1>
                        <div class="food-meta-info">
                            <div class="food-rating-display">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="2">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                                <span class="rating-value">4.9</span>
                            </div>
                            <span class="reviews-count">(245 reviews)</span>
                        </div>
                        <div class="modal-food-price">₱1,249</div>
                        <p class="food-description" id="modalFoodDescription">Premium quality food prepared with the finest ingredients. Our chefs use traditional cooking methods combined with modern techniques to bring out the best flavors.</p>
                    </div>

                    <!-- Size Options -->
                    <div class="options-section">
                        <h3 class="section-heading">Select Size</h3>
                        <div class="size-options">
                            <button class="size-option active" data-price="1249">
                                <span class="size-name">Regular</span>
                                <span class="size-price">₱1,249</span>
                            </button>
                            <button class="size-option" data-price="1649">
                                <span class="size-name">Large</span>
                                <span class="size-price">₱1,649</span>
                            </button>
                            <button class="size-option" data-price="1949">
                                <span class="size-name">Family</span>
                                <span class="size-price">₱1,949</span>
                            </button>
                        </div>
                    </div>

                    <!-- Add-ons Section -->
                    <div class="options-section">
                        <h3 class="section-heading">Add-ons</h3>
                        <div class="addons-list">
                            <label class="addon-item">
                                <input type="checkbox" class="addon-checkbox" data-price="150">
                                <span class="addon-name">Extra Cheese</span>
                                <span class="addon-price">₱150</span>
                            </label>
                            <label class="addon-item">
                                <input type="checkbox" class="addon-checkbox" data-price="100">
                                <span class="addon-name">Bacon</span>
                                <span class="addon-price">₱100</span>
                            </label>
                            <label class="addon-item">
                                <input type="checkbox" class="addon-checkbox" data-price="200">
                                <span class="addon-name">Avocado</span>
                                <span class="addon-price">₱200</span>
                            </label>
                            <label class="addon-item">
                                <input type="checkbox" class="addon-checkbox" data-price="250">
                                <span class="addon-name">Grilled Chicken</span>
                                <span class="addon-price">₱250</span>
                            </label>
                        </div>
                    </div>

                    <!-- Special Instructions -->
                    <div class="options-section">
                        <h3 class="section-heading">Special Instructions</h3>
                        <textarea class="instructions-input" placeholder="Add cooking instructions or preferences..."></textarea>
                    </div>

                    <!-- Nutritional Info -->
                    <div class="options-section">
                        <h3 class="section-heading">Nutritional Information</h3>
                        <div class="nutritional-grid">
                            <div class="nutritional-item">
                                <span class="nutritional-value">650</span>
                                <span class="nutritional-label">Calories</span>
                            </div>
                            <div class="nutritional-item">
                                <span class="nutritional-value">32g</span>
                                <span class="nutritional-label">Protein</span>
                            </div>
                            <div class="nutritional-item">
                                <span class="nutritional-value">58g</span>
                                <span class="nutritional-label">Carbs</span>
                            </div>
                            <div class="nutritional-item">
                                <span class="nutritional-value">28g</span>
                                <span class="nutritional-label">Fat</span>
                            </div>
                        </div>
                    </div>

                    <!-- Allergen Information -->
                    <div class="options-section">
                        <h3 class="section-heading">Allergen Information</h3>
                        <div class="allergen-tags">
                            <div class="allergen-tag">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                    <line x1="12" y1="9" x2="12" y2="13"></line>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                                Contains Dairy
                            </div>
                            <div class="allergen-tag">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                    <line x1="12" y1="9" x2="12" y2="13"></line>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                                Contains Soy
                            </div>
                        </div>
                    </div>

                    <!-- Related Items -->
                    <div class="options-section" style="border-top: 1px solid #f0f0f0; padding-top: 24px;">
                        <h3 class="section-heading">You May Also Like</h3>
                        <div class="related-scroll">
                            <div class="related-item" onclick="openFoodModal({name: 'BBQ Ribs', description: 'Tender pork ribs with smoky BBQ sauce', image: '../assets/training/Meat/90.jpg'})">
                                <div class="related-image">
                                    <img src="../assets/training/Meat/90.jpg" alt="BBQ Ribs">
                                </div>
                                <div class="related-name">BBQ Ribs</div>
                                <div class="related-price">₱1,149</div>
                            </div>
                            <div class="related-item" onclick="openFoodModal({name: 'Lamb Chops', description: 'Grilled lamb chops with herbs', image: '../assets/training/Meat/91.jpg'})">
                                <div class="related-image">
                                    <img src="../assets/training/Meat/91.jpg" alt="Lamb Chops">
                                </div>
                                <div class="related-name">Lamb Chops</div>
                                <div class="related-price">₱1,449</div>
                            </div>
                            <div class="related-item" onclick="openFoodModal({name: 'Grilled Salmon', description: 'Fresh salmon fillet grilled perfectly', image: '../assets/training/Seafood/0.jpg'})">
                                <div class="related-image">
                                    <img src="../assets/training/Seafood/0.jpg" alt="Grilled Salmon">
                                </div>
                                <div class="related-name">Grilled Salmon</div>
                                <div class="related-price">₱1,349</div>
                            </div>
                            <div class="related-item" onclick="openFoodModal({name: 'Pork Tenderloin', description: 'Juicy pork tenderloin with sauce', image: '../assets/training/Meat/88.jpg'})">
                                <div class="related-image">
                                    <img src="../assets/training/Meat/88.jpg" alt="Pork Tenderloin">
                                </div>
                                <div class="related-name">Pork Tenderloin</div>
                                <div class="related-price">₱1,199</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bottom Action Bar -->
                <div class="bottom-action-bar">
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="foodModal.decreaseQuantity()">−</button>
                        <span class="quantity-value" id="modalQuantity">1</span>
                        <button class="quantity-btn" onclick="foodModal.increaseQuantity()">+</button>
                    </div>
                    <button class="add-to-cart-button" onclick="foodModal.addToCart()">
                        <span>Add to Cart</span>
                        <span class="cart-total" id="modalCartTotal">₱1,249</span>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Size options
        const sizeOptions = this.modal.querySelectorAll('.size-option');
        sizeOptions.forEach(option => {
            option.addEventListener('click', () => {
                sizeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.updateTotal();
            });
        });

        // Add-ons
        const addonCheckboxes = this.modal.querySelectorAll('.addon-checkbox');
        addonCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateTotal());
        });

        // Favorite button
        const favoriteBtn = this.modal.querySelector('#modalFavoriteBtn');
        favoriteBtn.addEventListener('click', () => {
            favoriteBtn.classList.toggle('active');
        });

        // Prevent modal content clicks from closing modal
        this.modal.querySelector('.food-modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open(foodData = {}) {
        this.isOpen = true;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Populate with food data
        if (foodData.image) {
            this.modal.querySelector('#modalFoodImage').src = foodData.image;
        }
        if (foodData.name) {
            this.modal.querySelector('#modalFoodTitle').textContent = foodData.name;
        }
        if (foodData.description) {
            this.modal.querySelector('#modalFoodDescription').textContent = foodData.description;
        }

        // Reset to defaults
        this.modal.querySelector('#modalQuantity').textContent = '1';
        this.modal.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
        this.modal.querySelector('.size-option').classList.add('active');
        this.modal.querySelectorAll('.addon-checkbox').forEach(cb => cb.checked = false);
        this.updateTotal();
    }

    close() {
        this.isOpen = false;
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    increaseQuantity() {
        const quantityEl = this.modal.querySelector('#modalQuantity');
        let quantity = parseInt(quantityEl.textContent);
        quantity++;
        quantityEl.textContent = quantity;
        this.updateTotal();
    }

    decreaseQuantity() {
        const quantityEl = this.modal.querySelector('#modalQuantity');
        let quantity = parseInt(quantityEl.textContent);
        if (quantity > 1) {
            quantity--;
            quantityEl.textContent = quantity;
            this.updateTotal();
        }
    }

    updateTotal() {
        const quantity = parseInt(this.modal.querySelector('#modalQuantity').textContent);
        const activeSize = this.modal.querySelector('.size-option.active');
        const basePrice = parseInt(activeSize.dataset.price);
        
        let addonsTotal = 0;
        this.modal.querySelectorAll('.addon-checkbox:checked').forEach(checkbox => {
            addonsTotal += parseInt(checkbox.dataset.price);
        });

        const total = (basePrice + addonsTotal) * quantity;
        this.modal.querySelector('#modalCartTotal').textContent = '₱' + total.toLocaleString('en-PH');
    }

    addToCart() {
        const quantity = parseInt(this.modal.querySelector('#modalQuantity').textContent);
        const foodName = this.modal.querySelector('#modalFoodTitle').textContent;
        const total = this.modal.querySelector('#modalCartTotal').textContent;
        
        // Update cart badge
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            const currentCount = parseInt(cartBadge.textContent) || 0;
            cartBadge.textContent = currentCount + quantity;
        }
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: var(--turf-green); color: white; padding: 12px 24px; border-radius: 12px; font-weight: 600; z-index: 10000; animation: slideDown 0.3s ease;';
        successMsg.textContent = `Added ${quantity}x ${foodName} to cart`;
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => successMsg.remove(), 300);
        }, 2000);
        
        this.close();
    }
}

// Initialize modal when DOM is ready
let foodModal;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        foodModal = new FoodModal();
    });
} else {
    foodModal = new FoodModal();
}

// Helper function to open modal with food data
function openFoodModal(foodData) {
    if (foodModal) {
        foodModal.open(foodData);
    }
}
