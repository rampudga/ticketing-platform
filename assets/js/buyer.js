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
                        <button class="add-to-cart-btn" onclick="addToCart(${ticket.id})" ${!ticket.is_on_sale ? 'disabled' : ''}>
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

// Increase quantity selector
function increaseQuantity(ticketId) {
    const input = $(`#qty-${ticketId}`);
    const max = parseInt(input.attr('max'));
    let val = parseInt(input.val());
    if (val < max) input.val(val + 1);
}

// Decrease quantity selector
function decreaseQuantity(ticketId) {
    const input = $(`#qty-${ticketId}`);
    let val = parseInt(input.val());
    if (val > 1) input.val(val - 1);
}

// Add to cart
function addToCart(ticketId) {
    const quantity = parseInt($(`#qty-${ticketId}`).val());

    $.ajax({
        url: 'api/add_to_cart.php',
        method: 'POST',
        data: { ticket_id: ticketId, quantity: quantity },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                showAlert('success', `${response.data.title} added to cart!`);
                updateCartBadge();
                $(`#qty-${ticketId}`).val(1);
            } else {
                showAlert('error', response.message);
            }
        },
        error: function () {
            showAlert('error', 'Failed to add to cart');
        }
    });
}

// Update cart badge count
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

// Load cart contents
function loadCart() {
    $.ajax({
        url: 'api/get_cart.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) displayCart(response.data);
        }
    });
}

// Display cart items (UPDATED with quantity editing)
function displayCart(cartData) {
    const contentDiv = $('#cartContent');
    const footerDiv = $('#cartFooter');

    if (cartData.items.length === 0) {
        contentDiv.html(`
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>Your cart is empty</p>
            </div>
        `);
        footerDiv.html('');
        return;
    }

    let itemsHtml = '<div class="cart-items">';

    cartData.items.forEach(item => {
        const imageUrl = item.image_path || 'https://via.placeholder.com/80/667eea/ffffff?text=Ticket';

        itemsHtml += `
            <div class="cart-item">
                <img src="${imageUrl}" class="cart-item-image">

                <div class="cart-item-details">
                    <div class="cart-item-title">${escapeHtml(item.title)}</div>
                    <div class="cart-item-price">$${parseFloat(item.price).toFixed(2)} each</div>

                    <div class="cart-qty-editor">
                        <button class="qty-btn" onclick="updateCartQty(${item.cart_id}, ${item.quantity - 1})">−</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQty(${item.cart_id}, ${item.quantity + 1})">+</button>
                    </div>

                    <div class="cart-item-subtotal">
                        Subtotal: $${item.subtotal}
                    </div>
                </div>

                <div class="cart-item-actions">
                    <button class="remove-btn" onclick="removeFromCart(${item.cart_id})">Remove</button>
                </div>
            </div>
        `;
    });

    itemsHtml += '</div>';
    contentDiv.html(itemsHtml);

    // Footer
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

// NEW FEATURE: update quantity inside cart
function updateCartQty(cartId, newQty) {
    if (newQty < 1) return;

    $.ajax({
        url: 'api/update_cart_quantity.php',
        method: 'POST',
        data: { cart_id: cartId, quantity: newQty },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                loadCart();
                updateCartBadge();
            } else {
                showAlert('error', response.message);
            }
        },
        error: function () {
            showAlert('error', 'Failed to update quantity');
        }
    });
}

// Remove cart item
function removeFromCart(cartId) {
    $.ajax({
        url: 'api/remove_from_cart.php',
        method: 'POST',
        data: { cart_id: cartId },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                loadCart();
                updateCartBadge();
            }
        }
    });
}

// Review modal
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
            }
        }
    });
}

// Display review summary
function displayReview(cartData) {
    let html = '<div class="review-summary">';

    cartData.items.forEach(item => {
        html += `
            <div class="review-item">
                <strong>${escapeHtml(item.title)}</strong>
                <div>Quantity: ${item.quantity} × $${parseFloat(item.price).toFixed(2)}</div>
                <div><strong>$${item.subtotal}</strong></div>
            </div>
        `;
    });

    html += `
        <div class="review-total">
            <span>Total Amount:</span>
            <span>$${cartData.total}</span>
        </div>
    </div>`;

    $('#reviewContent').html(html);
}

// Checkout
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
            }
        }
    });
}

function closeSuccess() {
    $('#successModal').removeClass('active');
    loadTickets();
}

function closeReview() {
    $('#reviewModal').removeClass('active');
}

// Alerts
function showAlert(type, message) {
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    const alert = $(`<div class="alert ${alertClass}">${escapeHtml(message)}</div>`);

    $('#alertContainer').html(alert);
    alert.fadeIn();

    setTimeout(() => alert.fadeOut(() => alert.remove()), 4000);
}

// Escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}
