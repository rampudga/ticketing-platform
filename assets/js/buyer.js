// Initialize on page load
$(document).ready(function () {
    loadTickets();
    updateCartBadge();
});

// Load available tickets
function loadTickets() {
    $.ajax({
        url: 'api/get_tickets.php?filter=active',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                displayTickets(response.data);
            } else {
                showAlert('error', 'Failed to load tickets');
            }
        },
        error: function (xhr) {
            console.error('Error loading tickets:', xhr);
            $('#ticketsGrid').html('<div class="empty-state"><p>Failed to load tickets</p></div>');
        }
    });
}

// Display tickets in grid
function displayTickets(tickets) {
    const container = $('#ticketsGrid');

    if (tickets.length === 0) {
        container.html(`
            <div class="empty-state">
                <p style="font-size: 1.4rem; margin-bottom: 15px;">No tickets available</p>
                <p>Check back later for new events!</p>
            </div>
        `);
        return;
    }

    let html = '<div class="tickets-grid">';

    tickets.forEach(ticket => {
        const imageUrl = ticket.image_path || 'https://via.placeholder.com/400x200/667eea/ffffff?text=Event+Ticket';
        const isLowStock = ticket.quantity < 10;
        const quantityClass = isLowStock ? 'low-stock' : '';
        const statusClass = ticket.is_on_sale ? 'available' : 'not-available';
        const statusText = ticket.is_on_sale ? '✓ Available Now' : '✗ Not Available';

        html += `
            <div class="ticket-card" data-ticket-id="${ticket.id}">
                <img src="${imageUrl}" alt="${escapeHtml(ticket.title)}" class="ticket-card-image">
                <div class="ticket-card-content">
                    <span class="ticket-status ${statusClass}">${statusText}</span>
                    <h3 class="ticket-card-title">${escapeHtml(ticket.title)}</h3>
                    <p class="ticket-card-description">${escapeHtml(ticket.description || 'No description available')}</p>
                    
                    <div class="ticket-card-info">
                        <div class="ticket-price">$${parseFloat(ticket.price).toFixed(2)}</div>
                        <div class="ticket-quantity ${quantityClass}">
                            ${ticket.quantity} available
                            ${isLowStock ? ' - Hurry!' : ''}
                        </div>
                    </div>
                    
                    <div class="ticket-card-actions">
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="decreaseQuantity(${ticket.id})">−</button>
                            <input type="number" class="quantity-input" id="qty-${ticket.id}" value="1" min="1" max="${ticket.quantity}" readonly>
                            <button class="quantity-btn" onclick="increaseQuantity(${ticket.id})">+</button>
                        </div>
                        <button class="add-to-cart-btn" 
                                onclick="addToCart(${ticket.id})" 
                                ${!ticket.is_on_sale ? 'disabled' : ''}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.html(html);
}

// Increase quantity
function increaseQuantity(ticketId) {
    const input = $(`#qty-${ticketId}`);
    const max = parseInt(input.attr('max'));
    let val = parseInt(input.val());
    if (val < max) {
        input.val(val + 1);
    }
}

// Decrease quantity
function decreaseQuantity(ticketId) {
    const input = $(`#qty-${ticketId}`);
    let val = parseInt(input.val());
    if (val > 1) {
        input.val(val - 1);
    }
}

// Add to cart
function addToCart(ticketId) {
    const quantity = parseInt($(`#qty-${ticketId}`).val());

    $.ajax({
        url: 'api/add_to_cart.php',
        method: 'POST',
        data: {
            ticket_id: ticketId,
            quantity: quantity
        },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                showAlert('success', `${response.data.title} added to cart!`);
                updateCartBadge();
                $(`#qty-${ticketId}`).val(1); // Reset quantity
            } else {
                showAlert('error', response.message);
            }
        },
        error: function (xhr) {
            console.error('Error adding to cart:', xhr);
            showAlert('error', 'Failed to add to cart');
        }
    });
}

// Update cart badge
function updateCartBadge() {
    $.ajax({
        url: 'api/get_cart.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                $('#cartBadge').text(response.data.item_count);
            }
        }
    });
}

// Open cart modal
function openCart() {
    loadCart();
    $('#cartModal').addClass('active');
}

// Close cart modal
function closeCart() {
    $('#cartModal').removeClass('active');
}

// Load cart items
function loadCart() {
    $.ajax({
        url: 'api/get_cart.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                displayCart(response.data);
            } else {
                showAlert('error', 'Failed to load cart');
            }
        },
        error: function (xhr) {
            console.error('Error loading cart:', xhr);
        }
    });
}

// Display cart items
function displayCart(cartData) {
    const contentDiv = $('#cartContent');
    const footerDiv = $('#cartFooter');

    if (cartData.items.length === 0) {
        contentDiv.html(`
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p style="font-size: 1.2rem; margin-bottom: 10px;">Your cart is empty</p>
                <p>Add some tickets to get started!</p>
            </div>
        `);
        footerDiv.html('');
        return;
    }

    // Display items
    let itemsHtml = '<div class="cart-items">';
    cartData.items.forEach(item => {
        const imageUrl = item.image_path || 'https://via.placeholder.com/80/667eea/ffffff?text=Ticket';
        const warning = item.warning ? `<div style="color: #ef4444; font-size: 0.85rem; margin-top: 5px;">${item.warning}</div>` : '';

        itemsHtml += `
            <div class="cart-item">
                <img src="${imageUrl}" alt="${escapeHtml(item.title)}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${escapeHtml(item.title)}</div>
                    <div class="cart-item-price">$${parseFloat(item.price).toFixed(2)} each</div>
                    <div class="cart-item-quantity">Quantity: ${item.quantity} | Subtotal: $${item.subtotal}</div>
                    ${warning}
                </div>
                <div class="cart-item-actions">
                    <button class="remove-btn" onclick="removeFromCart(${item.cart_id})">Remove</button>
                </div>
            </div>
        `;
    });
    itemsHtml += '</div>';
    contentDiv.html(itemsHtml);

    // Display footer
    footerDiv.html(`
        <div class="cart-total">
            <span class="cart-total-label">Total:</span>
            <span class="cart-total-amount">$${cartData.total}</span>
        </div>
        <div class="cart-actions">
            <button class="btn btn-secondary" onclick="closeCart()">Continue Shopping</button>
            <button class="btn btn-success" onclick="proceedToReview()">Proceed to Review</button>
        </div>
    `);
}

// Remove from cart
function removeFromCart(cartId) {
    $.ajax({
        url: 'api/remove_from_cart.php',
        method: 'POST',
        data: { cart_id: cartId },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                showAlert('success', 'Item removed from cart');
                loadCart();
                updateCartBadge();
            } else {
                showAlert('error', response.message);
            }
        },
        error: function (xhr) {
            console.error('Error removing from cart:', xhr);
            showAlert('error', 'Failed to remove item');
        }
    });
}

// Proceed to review
function proceedToReview() {
    $.ajax({
        url: 'api/get_cart.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success && response.data.items.length > 0) {
                displayReview(response.data);
                closeCart();
                $('#reviewModal').addClass('active');
            } else {
                showAlert('error', 'Your cart is empty');
            }
        }
    });
}

// Display review/checkout
function displayReview(cartData) {
    let html = '<div class="review-summary"><h4 style="margin-bottom: 15px;">Order Summary</h4>';

    cartData.items.forEach(item => {
        html += `
            <div class="review-item">
                <div>
                    <strong>${escapeHtml(item.title)}</strong>
                    <div style="color: #6b7280; font-size: 0.9rem;">Quantity: ${item.quantity} × $${parseFloat(item.price).toFixed(2)}</div>
                </div>
                <div style="font-weight: 600;">$${item.subtotal}</div>
            </div>
        `;
    });

    html += `
        <div class="review-total">
            <span>Total Amount:</span>
            <span>$${cartData.total}</span>
        </div>
    </div>
    <div style="background: #eff6ff; padding: 15px; border-radius: 8px; color: #1e40af;">
        <strong>Note:</strong> This is a demo checkout. No actual payment will be processed.
    </div>
    `;

    $('#reviewContent').html(html);
}

// Back to cart
function backToCart() {
    $('#reviewModal').removeClass('active');
    openCart();
}

// Complete checkout
function completeCheckout() {
    $.ajax({
        url: 'api/clear_cart.php',
        method: 'POST',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                $('#reviewModal').removeClass('active');
                $('#successModal').addClass('active');
                updateCartBadge();
            } else {
                showAlert('error', 'Checkout failed');
            }
        },
        error: function (xhr) {
            console.error('Error completing checkout:', xhr);
            showAlert('error', 'Checkout failed');
        }
    });
}

// Close success modal
function closeSuccess() {
    $('#successModal').removeClass('active');
    loadTickets(); // Reload tickets
}

// Close review modal
function closeReview() {
    $('#reviewModal').removeClass('active');
}

// Show alert
function showAlert(type, message) {
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    const alert = $(`<div class="alert ${alertClass}">${escapeHtml(message)}</div>`);

    $('#alertContainer').html(alert);
    alert.fadeIn();

    setTimeout(() => {
        alert.fadeOut(() => alert.remove());
    }, 4000);
}

// Escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}