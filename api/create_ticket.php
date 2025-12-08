<?php
require_once '../includes/db.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(false, 'Invalid request method');
}

// Validate required fields
$required_fields = ['title', 'sale_start_date', 'sale_end_date', 'quantity', 'price'];
foreach ($required_fields as $field) {
    if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
        json_response(false, "Field '$field' is required");
    }
}

// Sanitize inputs
$title = sanitize_input($_POST['title']);
$description = isset($_POST['description']) ? sanitize_input($_POST['description']) : '';
$sale_start_date = sanitize_input($_POST['sale_start_date']);
$sale_end_date = sanitize_input($_POST['sale_end_date']);
$quantity = intval($_POST['quantity']);
$price = floatval($_POST['price']);
$visibility = isset($_POST['visibility']) ? sanitize_input($_POST['visibility']) : 'public';

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

// Handle image upload
$image_path = null;
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

// Insert into database
$sql = "INSERT INTO tickets (title, description, sale_start_date, sale_end_date, quantity, price, visibility, image_path) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    json_response(false, 'Database error: ' . $conn->error);
}

$stmt->bind_param("ssssisss", $title, $description, $sale_start_date, $sale_end_date, $quantity, $price, $visibility, $image_path);

if ($stmt->execute()) {
    $ticket_id = $stmt->insert_id;
    json_response(true, 'Ticket created successfully', [
        'id' => $ticket_id,
        'title' => $title,
        'price' => $price,
        'quantity' => $quantity,
        'image_path' => $image_path
    ]);
} else {
    json_response(false, 'Failed to create ticket: ' . $stmt->error);
}

$stmt->close();
$conn->close();
