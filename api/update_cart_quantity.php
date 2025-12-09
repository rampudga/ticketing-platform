<?php
require_once '../includes/db.php';

$cart_id = intval($_POST['cart_id'] ?? 0);
$quantity = intval($_POST['quantity'] ?? 1);

if ($cart_id < 1 || $quantity < 1) {
    json_response(false, "Invalid quantity");
}

$session_id = $_SESSION['cart_session_id'];

// Check stock
$q = $conn->query("
    SELECT c.ticket_id, t.quantity AS available
    FROM cart_items c
    JOIN tickets t ON c.ticket_id = t.id
    WHERE c.id = $cart_id AND c.session_id = '$session_id'
");

if ($q->num_rows === 0) {
    json_response(false, "Item not found");
}

$row = $q->fetch_assoc();
$ticket_id = $row['ticket_id'];
$available = $row['available'];

if ($quantity > $available) {
    json_response(false, "Only $available left in stock");
}

// Update quantity
$update = $conn->query("
    UPDATE cart_items 
    SET quantity = $quantity 
    WHERE id = $cart_id 
    AND session_id = '$session_id'
");

if ($update) {
    json_response(true, "Quantity updated");
} else {
    json_response(false, "Failed to update");
}
