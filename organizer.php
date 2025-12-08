<?php
require_once 'includes/db.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Organizer Dashboard - Ticketing Platform</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>
    <!-- Header -->
    <div class="header">
        <div class="container">
            <h1>🎫 Event Organizer Dashboard</h1>
            <p>Manage your event tickets with ease</p>
            <div class="nav-links">
                <a href="organizer.php">Dashboard</a>
                <a href="index.php">View Buyer Page</a>
            </div>
        </div>
    </div>

    <div class="container">
        <!-- Alert Messages -->
        <div id="alertContainer"></div>

        <!-- Create/Edit Ticket Form -->
        <div class="card">
            <h2 id="formTitle">Create New Ticket</h2>
            <form id="ticketForm" enctype="multipart/form-data">
                <input type="hidden" id="ticketId" name="id">

                <div class="form-group">
                    <label for="title">Ticket Title *</label>
                    <input type="text" id="title" name="title" required placeholder="e.g., VIP Concert Pass">
                </div>

                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" placeholder="Describe your ticket..."></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="sale_start_date">Sale Start Date *</label>
                        <input type="datetime-local" id="sale_start_date" name="sale_start_date" required>
                    </div>

                    <div class="form-group">
                        <label for="sale_end_date">Sale End Date *</label>
                        <input type="datetime-local" id="sale_end_date" name="sale_end_date" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="quantity">Quantity *</label>
                        <input type="number" id="quantity" name="quantity" required min="0" placeholder="100">
                    </div>

                    <div class="form-group">
                        <label for="price">Price ($) *</label>
                        <input type="number" id="price" name="price" required min="0" step="0.01" placeholder="29.99">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="visibility">Visibility *</label>
                        <select id="visibility" name="visibility" required>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="image">Ticket Image</label>
                        <input type="file" id="image" name="image" accept="image/*">
                    </div>
                </div>

                <div id="imagePreview" class="image-preview hidden">
                    <img id="previewImg" src="" alt="Preview">
                </div>

                <div class="form-group mt-20">
                    <button type="submit" class="btn btn-primary" id="submitBtn">
                        <span id="btnText">Create Ticket</span>
                        <span id="btnLoading" class="loading hidden"></span>
                    </button>
                    <button type="button" class="btn btn-secondary" id="cancelBtn" style="display: none;">Cancel</button>
                </div>
            </form>
        </div>

        <!-- Tickets List -->
        <div class="card">
            <h2>All Tickets</h2>
            <div id="ticketsContainer">
                <div class="text-center" style="padding: 40px;">
                    <div class="loading" style="width: 40px; height: 40px; border-width: 4px;"></div>
                    <p style="margin-top: 15px; color: #9ca3af;">Loading tickets...</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div id="deleteModal" class="modal-overlay">
        <div class="modal">
            <h3>⚠️ Confirm Deletion</h3>
            <p>Are you sure you want to delete this ticket? This action cannot be undone.</p>
            <div class="modal-actions">
                <button class="btn btn-secondary btn-sm" onclick="closeDeleteModal()">Cancel</button>
                <button class="btn btn-danger btn-sm" onclick="confirmDelete()">Delete</button>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="assets/js/organizer.js"></script>
</body>

</html>