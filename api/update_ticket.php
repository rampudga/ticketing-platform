<?php
require_once '../includes/db.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(false, 'Invalid request method');
}

// Validate ticket ID
if (!isset($_POST['id']) || empty($_POST['id'])) {
    json_response(false, 'Ticket ID is required');
}

$ticket_id = intval($_POST['id']);

// Check if ticket exists
$check_sql = "SELECT * FROM tickets WHERE id = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("i", $ticket_id);
$check_stmt->execute();
$result = $check_stmt->get_result();

if ($result->num_rows === 0) {
    json_response(false, 'Ticket not found');
}

$existing_ticket = $result->fetch_assoc();
$check_stmt->close();

// Get updated values (use existing values if not provided)
$title = isset($_POST['title']) && !empty(trim($_POST['title']))
    ? sanitize_input($_POST['title'])
    : $existing_ticket['title'];

$description = isset($_POST['description'])
    ? sanitize_input($_POST['description'])
    : $existing_ticket['description'];

$sale_start_date = isset($_POST['sale_start_date']) && !empty($_POST['sale_start_date'])
    ? sanitize_input($_POST['sale_start_date'])
    : $existing_ticket['sale_start_date'];

$sale_end_date = isset($_POST['sale_end_date']) && !empty($_POST['sale_end_date'])
    ? sanitize_input($_POST['sale_end_date'])
    : $existing_ticket['sale_end_date'];

$quantity = isset($_POST['quantity'])
    ? intval($_POST['quantity'])
    : $existing_ticket['quantity'];

$price = isset($_POST['price'])
    ? floatval($_POST['price'])
    : $existing_ticket['price'];

$visibility = isset($_POST['visibility'])
    ? sanitize_input($_POST['visibility'])
    : $existing_ticket['visibility'];

$image_path = $existing_ticket['image_path'];

// Validate quantity and price
if ($quantity < 0) {
    json_response(false, 'Quantity must be a positive number');
}
if ($price < 0) {
    json_response(false, 'Price must be a positive number');
}

// Validate dates
$start = strtotime($sale_start_date);
$end = strtotime($sale_end_date);
if ($start === false || $end === false) {
    json_response(false, 'Invalid date format');
}
if ($end < $start) {
    json_response(false, 'End date must be after start date');
}

// Handle new image upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $file_type = $_FILES['image']['type'];

    if (!in_array($file_type, $allowed_types)) {
        json_response(false, 'Invalid image type. Only JPG, PNG, GIF, and WEBP are allowed');
    }

    // Check file size (max 5MB)
    if ($_FILES['image']['size'] > 5 * 1024 * 1024) {
        json_response(false, 'Image size must be less than 5MB');
    }

    // Delete old image if exists
    if ($existing_ticket['image_path'] && file_exists('../' . $existing_ticket['image_path'])) {
        unlink('../' . $existing_ticket['image_path']);
    }

    // Generate unique filename
    $extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $filename = uniqid('ticket_') . '.' . $extension;
    $upload_dir = '../assets/uploads/';

    // Create uploads directory if it doesn't exist
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $target_path = $upload_dir . $filename;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $target_path)) {
        $image_path = 'assets/uploads/' . $filename;
    } else {
        json_response(false, 'Failed to upload image');
    }
}

// Update database
$sql = "UPDATE tickets 
        SET title = ?, description = ?, sale_start_date = ?, sale_end_date = ?, 
            quantity = ?, price = ?, visibility = ?, image_path = ?
        WHERE id = ?";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    json_response(false, 'Database error: ' . $conn->error);
}

$stmt->bind_param(
    "ssssisssi",
    $title,
    $description,
    $sale_start_date,
    $sale_end_date,
    $quantity,
    $price,
    $visibility,
    $image_path,
    $ticket_id
);

if ($stmt->execute()) {
    json_response(true, 'Ticket updated successfully', [
        'id' => $ticket_id,
        'title' => $title,
        'price' => $price,
        'quantity' => $quantity,
        'image_path' => $image_path
    ]);
} else {
    json_response(false, 'Failed to update ticket: ' . $stmt->error);
}

$stmt->close();
$conn->close();
