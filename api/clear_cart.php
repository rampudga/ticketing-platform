<?php
require_once '../includes/db.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(false, 'Invalid request method');
}

$session_id = $_SESSION['cart_session_id'];

// Delete all cart items for this session
$sql = "DELETE FROM cart_items WHERE session_id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    json_response(false, 'Database error: ' . $conn->error);
}

$stmt->bind_param("s", $session_id);

if ($stmt->execute()) {
    $deleted_count = $stmt->affected_rows;
    json_response(true, 'Cart cleared successfully', [
        'deleted_count' => $deleted_count
    ]);
} else {
    json_response(false, 'Failed to clear cart: ' . $stmt->error);
}

$stmt->close();
$conn->close();
