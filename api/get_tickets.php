<?php
require_once '../includes/db.php';

// Get filter parameter (optional)
$filter = isset($_GET['filter']) ? sanitize_input($_GET['filter']) : 'all';

// Build query based on filter
$sql = "SELECT * FROM tickets";
$conditions = [];

if ($filter === 'public') {
    $conditions[] = "visibility = 'public'";
} elseif ($filter === 'active') {
    $conditions[] = "visibility = 'public'";
    $conditions[] = "sale_start_date <= NOW()";
    $conditions[] = "sale_end_date >= NOW()";
    $conditions[] = "quantity > 0";
}

if (!empty($conditions)) {
    $sql .= " WHERE " . implode(" AND ", $conditions);
}

$sql .= " ORDER BY created_at DESC";

$result = $conn->query($sql);

if (!$result) {
    json_response(false, 'Database error: ' . $conn->error);
}

$tickets = [];
while ($row = $result->fetch_assoc()) {
    // Check if ticket is currently on sale
    $now = time();
    $start = strtotime($row['sale_start_date']);
    $end = strtotime($row['sale_end_date']);

    $row['is_on_sale'] = ($now >= $start && $now <= $end && $row['quantity'] > 0);
    $tickets[] = $row;
}

json_response(true, 'Tickets retrieved successfully', $tickets);

$conn->close();
