<?php
require_once 'includes/db.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Browse Tickets - Ticketing Platform</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/buyer.css">
</head>

<body>
    <!-- Header -->
    <div class="header">
        <div class="container">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1>🎫 Ticketing Platform</h1>
                    <p>Find and purchase your perfect event tickets</p>
                </div>
                <button class="cart-button" onclick="openCart()">
                    🛒 Cart <span class="cart-badge" id="cartBadge">0</span>
                </button>
            </div>
            <div class="nav-links">
                <a href="index.php">Browse Tickets</a>
                <a href="organizer.php">Organizer Dashboard</a>
            </div>
        </div>
    </div>

    <div class="container">
        <!-- Alert Messages -->
        <div id="alertContainer"></div>

        <!-- Tickets Grid -->
        <div class="tickets-section">
            <h2>Available Tickets</h2>
            <div id="ticketsGrid">
                <div class="text-center" style="padding: 60px;">
                    <div class="loading" style="width: 50px; height: 50px; border-width: 5px;"></div>
                    <p style="margin-top: 20px; color: #9ca3af; font-size: 1.1rem;">Loading tickets...</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Cart Modal -->
    <div id="cartModal" class="modal-overlay">
        <div class="modal modal-large">
            <div class="modal-header">
                <h3>🛒 Shopping Cart</h3>
                <button class="close-btn" onclick="closeCart()">&times;</button>
            </div>

            <div id="cartContent">
                <!-- Cart items will be loaded here -->
            </div>

            <div id="cartFooter" class="cart-footer">
                <!-- Cart total and actions will be loaded here -->
            </div>
        </div>
    </div>

    <!-- Review/Checkout Modal -->
    <div id="reviewModal" class="modal-overlay">
        <div class="modal modal-large">
            <div class="modal-header">
                <h3>📋 Order Review</h3>
                <button class="close-btn" onclick="closeReview()">&times;</button>
            </div>

            <div id="reviewContent">
                <!-- Review content will be loaded here -->
            </div>

            <div class="modal-actions" style="margin-top: 30px;">
                <button class="btn btn-secondary" onclick="backToCart()">← Back to Cart</button>
                <button class="btn btn-success" onclick="completeCheckout()">Complete Purchase</button>
            </div>
        </div>
    </div>

    <!-- Success Modal -->
    <div id="successModal" class="modal-overlay">
        <div class="modal">
            <div style="text-align: center;">
                <div style="font-size: 60px; margin-bottom: 20px;">✅</div>
                <h3 style="color: #10b981; margin-bottom: 15px;">Purchase Successful!</h3>
                <p style="color: #6b7280; margin-bottom: 25px;">Thank you for your purchase. Your tickets have been confirmed.</p>
                <button class="btn btn-primary" onclick="closeSuccess()">Continue Shopping</button>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="assets/js/buyer.js"></script>
</body>

</html>