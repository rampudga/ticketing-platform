<?php
require_once '../includes/db.php';

// Accept both POST and DELETE requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    json_response(false, 'Invalid request method');
}

$session_id = $_SESSION['cart_session_id'];

// Get cart item ID or ticket ID
$cart_id = null;
$ticket_id = null;

if (isset($_POST['cart_id'])) {
    $cart_id = intval($_POST['cart_id']);
} elseif (isset($_GET['cart_id'])) {
    $cart_id = intval($_GET['cart_id']);
} elseif (isset($_POST['ticket_id'])) {
    $ticket_id = intval($_POST['ticket_id']);
} elseif (isset($_GET['ticket_id'])) {
    $ticket_id = intval($_GET['ticket_id']);
}

if (!$cart_id && !$ticket_id) {
    json_response(false, 'Cart ID or Ticket ID is required');
}

// Build delete query
if ($cart_id) {
    $sql = "DELETE FROM cart_items WHERE id = ? AND session_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("is", $cart_id, $session_id);
} else {
    $sql = "DELETE FROM cart_items WHERE ticket_id = ? AND session_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("is", $ticket_id, $session_id);
}

if (!$stmt) {
    json_response(false, 'Database error: ' . $conn->error);
}

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        json_response(true, 'Item removed from cart successfully', [
            'removed' => true,
            'cart_id' => $cart_id,
            'ticket_id' => $ticket_id
        ]);
    } else {
        json_response(false, 'Item not found in cart');
    }
} else {
    json_response(false, 'Failed to remove item: ' . $stmt->error);
}

$stmt->close();
$conn->close();
