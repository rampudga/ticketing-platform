<?php
require_once '../includes/db.php';

// Accept both POST and DELETE requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    json_response(false, 'Invalid request method');
}

// Get ticket ID from POST data or query string
$ticket_id = null;
if (isset($_POST['id'])) {
    $ticket_id = intval($_POST['id']);
} elseif (isset($_GET['id'])) {
    $ticket_id = intval($_GET['id']);
}

if (!$ticket_id) {
    json_response(false, 'Ticket ID is required');
}

// Check if ticket exists and get image path
$check_sql = "SELECT image_path FROM tickets WHERE id = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("i", $ticket_id);
$check_stmt->execute();
$result = $check_stmt->get_result();

if ($result->num_rows === 0) {
    json_response(false, 'Ticket not found');
}

$ticket = $result->fetch_assoc();
$check_stmt->close();

// Delete the ticket from database
$sql = "DELETE FROM tickets WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    json_response(false, 'Database error: ' . $conn->error);
}

$stmt->bind_param("i", $ticket_id);

if ($stmt->execute()) {
    // Delete associated image file if exists
    if ($ticket['image_path'] && file_exists('../' . $ticket['image_path'])) {
        unlink('../' . $ticket['image_path']);
    }

    json_response(true, 'Ticket deleted successfully', ['id' => $ticket_id]);
} else {
    json_response(false, 'Failed to delete ticket: ' . $stmt->error);
}

$stmt->close();
$conn->close();
