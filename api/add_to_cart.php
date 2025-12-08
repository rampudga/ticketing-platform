<?php
require_once '../includes/db.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(false, 'Invalid request method');
}

// Validate required fields
if (!isset($_POST['ticket_id']) || !isset($_POST['quantity'])) {
    json_response(false, 'Ticket ID and quantity are required');
}

$ticket_id = intval($_POST['ticket_id']);
$quantity = intval($_POST['quantity']);
$session_id = $_SESSION['cart_session_id'];

// Validate quantity
if ($quantity <= 0) {
    json_response(false, 'Quantity must be greater than 0');
}

// Check if ticket exists and is available
$check_sql = "SELECT * FROM tickets WHERE id = ? AND visibility = 'public'";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("i", $ticket_id);
$check_stmt->execute();
$result = $check_stmt->get_result();

if ($result->num_rows === 0) {
    json_response(false, 'Ticket not found or not available');
}

$ticket = $result->fetch_assoc();
$check_stmt->close();

// Check if ticket is currently on sale
$now = date('Y-m-d H:i:s');
if ($now < $ticket['sale_start_date'] || $now > $ticket['sale_end_date']) {
    json_response(false, 'This ticket is not currently on sale');
}

// Check if enough quantity is available
if ($ticket['quantity'] < $quantity) {
    json_response(false, 'Not enough tickets available. Only ' . $ticket['quantity'] . ' remaining');
}

// Check if item already exists in cart
$existing_sql = "SELECT * FROM cart_items WHERE session_id = ? AND ticket_id = ?";
$existing_stmt = $conn->prepare($existing_sql);
$existing_stmt->bind_param("si", $session_id, $ticket_id);
$existing_stmt->execute();
$existing_result = $existing_stmt->get_result();

if ($existing_result->num_rows > 0) {
    // Update existing cart item
    $existing_item = $existing_result->fetch_assoc();
    $new_quantity = $existing_item['quantity'] + $quantity;

    // Check if total quantity exceeds available tickets
    if ($new_quantity > $ticket['quantity']) {
        json_response(false, 'Cannot add more tickets. Maximum available: ' . $ticket['quantity']);
    }

    $update_sql = "UPDATE cart_items SET quantity = ? WHERE session_id = ? AND ticket_id = ?";
    $update_stmt = $conn->prepare($update_sql);
    $update_stmt->bind_param("isi", $new_quantity, $session_id, $ticket_id);

    if ($update_stmt->execute()) {
        json_response(true, 'Cart updated successfully', [
            'ticket_id' => $ticket_id,
            'quantity' => $new_quantity,
            'title' => $ticket['title'],
            'price' => $ticket['price']
        ]);
    } else {
        json_response(false, 'Failed to update cart: ' . $update_stmt->error);
    }
    $update_stmt->close();
} else {
    // Insert new cart item
    $insert_sql = "INSERT INTO cart_items (session_id, ticket_id, quantity) VALUES (?, ?, ?)";
    $insert_stmt = $conn->prepare($insert_sql);
    $insert_stmt->bind_param("sii", $session_id, $ticket_id, $quantity);

    if ($insert_stmt->execute()) {
        json_response(true, 'Item added to cart successfully', [
            'ticket_id' => $ticket_id,
            'quantity' => $quantity,
            'title' => $ticket['title'],
            'price' => $ticket['price']
        ]);
    } else {
        json_response(false, 'Failed to add to cart: ' . $insert_stmt->error);
    }
    $insert_stmt->close();
}

$existing_stmt->close();
$conn->close();
