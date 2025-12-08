        const orderTabs = document.querySelectorAll('.order-tab');
        const orderCards = document.querySelectorAll('.order-card');
        const ordersSection = document.getElementById('ordersSection');
        const emptyState = document.getElementById('emptyState');

        // Tab filtering
        orderTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Update active tab
                orderTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                const status = this.dataset.status;
                filterOrders(status);
            });
        });

        function filterOrders(status) {
            let visibleCount = 0;

            orderCards.forEach(card => {
                if(status === 'all' || card.dataset.status === status) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Show empty state if no orders
            if(visibleCount === 0) {
                ordersSection.style.display = 'none';
                emptyState.classList.add('active');
            } else {
                ordersSection.style.display = 'block';
                emptyState.classList.remove('active');
            }
        }
