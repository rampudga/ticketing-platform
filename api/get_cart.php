<?php
require_once '../includes/db.php';

$session_id = $_SESSION['cart_session_id'];

// Get all cart items with ticket details
$sql = "SELECT ci.id as cart_id, ci.quantity, ci.added_at,
               t.id as ticket_id, t.title, t.description, t.price, 
               t.image_path, t.quantity as available_quantity,
               t.sale_start_date, t.sale_end_date
        FROM cart_items ci
        INNER JOIN tickets t ON ci.ticket_id = t.id
        WHERE ci.session_id = ?
        ORDER BY ci.added_at DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $session_id);
$stmt->execute();
$result = $stmt->get_result();

$cart_items = [];
$total = 0;
$item_count = 0;

while ($row = $result->fetch_assoc()) {
    // Calculate subtotal for this item
    $subtotal = $row['price'] * $row['quantity'];
    $row['subtotal'] = number_format($subtotal, 2);

    // Check if ticket is still available
    $now = date('Y-m-d H:i:s');
    $row['is_available'] = (
        $now >= $row['sale_start_date'] &&
        $now <= $row['sale_end_date'] &&
        $row['available_quantity'] >= $row['quantity']
    );

    // Add warning if quantity in cart exceeds available quantity
    if ($row['quantity'] > $row['available_quantity']) {
        $row['warning'] = 'Only ' . $row['available_quantity'] . ' tickets available';
    }

    $cart_items[] = $row;
    $total += $subtotal;
    $item_count += $row['quantity'];
}

$stmt->close();
$conn->close();

json_response(true, 'Cart retrieved successfully', [
    'items' => $cart_items,
    'total' => number_format($total, 2),
    'item_count' => $item_count,
    'cart_count' => count($cart_items)
]);
