        const searchInput = document.getElementById('searchInput');
        const clearBtn = document.getElementById('clearBtn');
        const popularSection = document.getElementById('popularSection');
        const recentSection = document.getElementById('recentSection');
        const resultsSection = document.getElementById('resultsSection');
        const emptyState = document.getElementById('emptyState');
        const resultsGrid = document.getElementById('resultsGrid');
        const resultsCount = document.getElementById('resultsCount');

        // Sample data
        const foodItems = [
            {name: 'Chicken Adobo Rice', restaurant: 'Golden Spoon Restaurant', price: 199, rating: 4.8, image: '../assets/training/Rice/1.jpg', category: 'rice'},
            {name: 'Beef Tapa Rice', restaurant: 'Golden Spoon Restaurant', price: 249, rating: 4.7, image: '../assets/training/Rice/5.jpg', category: 'rice'},
            {name: 'Classic Burger', restaurant: 'Burger Palace', price: 499, rating: 4.6, image: '../assets/training/Fried food/15.jpg', category: 'fried'},
            {name: 'Pancit Canton', restaurant: 'Noodle Express', price: 145, rating: 4.7, image: '../assets/training/Noodles-Pasta/8.jpg', category: 'noodles'},
            {name: 'Grilled Bangus', restaurant: 'Golden Spoon Restaurant', price: 299, rating: 4.8, image: '../assets/training/Seafood/12.jpg', category: 'seafood'},
            {name: 'Pork Sisig Rice', restaurant: 'Golden Spoon Restaurant', price: 219, rating: 4.9, image: '../assets/training/Rice/8.jpg', category: 'rice'},
        ];

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                if(searchInput.value) performSearch();
            });
        });

        // Search input
        searchInput.addEventListener('input', function() {
            if(this.value.length > 0) {
                clearBtn.classList.add('active');
                performSearch();
            } else {
                clearBtn.classList.remove('active');
                showDefaultView();
            }
        });

        clearBtn.addEventListener('click', function() {
            searchInput.value = '';
            this.classList.remove('active');
            showDefaultView();
        });

        function searchFor(query) {
            searchInput.value = query;
            clearBtn.classList.add('active');
            performSearch();
        }

        function performSearch() {
            const query = searchInput.value.toLowerCase();
            const activeFilter = document.querySelector('.filter-tab.active').dataset.filter;
            
            let results = foodItems.filter(item => {
                const matchesQuery = item.name.toLowerCase().includes(query) || 
                                    item.restaurant.toLowerCase().includes(query);
                const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
                return matchesQuery && matchesFilter;
            });

            if(results.length > 0) {
                displayResults(results);
            } else {
                showEmptyState();
            }
        }

        function displayResults(results) {
            popularSection.style.display = 'none';
            recentSection.style.display = 'none';
            resultsSection.classList.add('active');
            emptyState.classList.remove('active');

            resultsCount.textContent = `Found ${results.length} result${results.length > 1 ? 's' : ''}`;
            
            resultsGrid.innerHTML = results.map(item => `
                <div class="result-card" onclick="window.location.href='merchant-detail.html'">
                    <div class="result-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="result-info">
                        <div>
                            <div class="result-name">${item.name}</div>
                            <div class="result-restaurant">${item.restaurant}</div>
                            <div class="result-meta">
                                <span>⭐ ${item.rating}</span>
                                <span>•</span>
                                <span>20-30 min</span>
                            </div>
                        </div>
                        <div class="result-price">₱${item.price}</div>
                    </div>
                </div>
            `).join('');
        }

        function showEmptyState() {
            popularSection.style.display = 'none';
            recentSection.style.display = 'none';
            resultsSection.classList.remove('active');
            emptyState.classList.add('active');
        }

        function showDefaultView() {
            popularSection.style.display = 'block';
            recentSection.style.display = 'block';
            resultsSection.classList.remove('active');
            emptyState.classList.remove('active');
        }

        function removeRecent(button) {
            button.closest('.recent-item').remove();
        }
