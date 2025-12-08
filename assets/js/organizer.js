// Global variables
let isEditing = false;
let deleteTicketId = null;

// Initialize on page load
$(document).ready(function () {
    loadTickets();
    setupFormHandlers();
    setupImagePreview();
});

// Load all tickets
function loadTickets() {
    $.ajax({
        url: 'api/get_tickets.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                displayTickets(response.data);
            } else {
                showAlert('error', 'Failed to load tickets: ' + response.message);
            }
        },
        error: function (xhr) {
            console.error('Error loading tickets:', xhr);
            showAlert('error', 'Failed to load tickets. Please refresh the page.');
        }
    });
}

// Display tickets in table
function displayTickets(tickets) {
    const container = $('#ticketsContainer');

    if (tickets.length === 0) {
        container.html(`
            <div class="empty-state">
                <p style="font-size: 1.2rem; margin-bottom: 10px;">No tickets yet</p>
                <p>Create your first ticket using the form above</p>
            </div>
        `);
        return;
    }

    let html = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Visibility</th>
                        <th>Sale Period</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;

    tickets.forEach(ticket => {
        const imageUrl = ticket.image_path ? ticket.image_path : 'https://via.placeholder.com/60';
        const visibilityBadge = ticket.visibility === 'public'
            ? '<span class="badge badge-public">Public</span>'
            : '<span class="badge badge-private">Private</span>';

        const startDate = new Date(ticket.sale_start_date).toLocaleDateString();
        const endDate = new Date(ticket.sale_end_date).toLocaleDateString();

        html += `
            <tr>
                <td><img src="${imageUrl}" alt="${ticket.title}" class="ticket-image"></td>
                <td><strong>${escapeHtml(ticket.title)}</strong></td>
                <td>$${parseFloat(ticket.price).toFixed(2)}</td>
                <td>${ticket.quantity}</td>
                <td>${visibilityBadge}</td>
                <td>${startDate} - ${endDate}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary btn-sm" onclick="editTicket(${ticket.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="openDeleteModal(${ticket.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.html(html);
}

// Setup form handlers
function setupFormHandlers() {
    $('#ticketForm').on('submit', function (e) {
        e.preventDefault();
        submitTicketForm();
    });

    $('#cancelBtn').on('click', function () {
        resetForm();
    });
}

// Setup image preview
function setupImagePreview() {
    $('#image').on('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('#previewImg').attr('src', e.target.result);
                $('#imagePreview').removeClass('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            $('#imagePreview').addClass('hidden');
        }
    });
}

// Submit ticket form (create or update)
function submitTicketForm() {
    const formData = new FormData($('#ticketForm')[0]);
    const url = isEditing ? 'api/update_ticket.php' : 'api/create_ticket.php';

    // Show loading state
    $('#btnText').text(isEditing ? 'Updating...' : 'Creating...');
    $('#submitBtn').prop('disabled', true);

    $.ajax({
        url: url,
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                showAlert('success', response.message);
                resetForm();
                loadTickets();
            } else {
                showAlert('error', response.message);
            }
        },
        error: function (xhr) {
            console.error('Error submitting form:', xhr);
            showAlert('error', 'Failed to save ticket. Please try again.');
        },
        complete: function () {
            $('#btnText').text(isEditing ? 'Update Ticket' : 'Create Ticket');
            $('#submitBtn').prop('disabled', false);
        }
    });
}

// Edit ticket
function editTicket(id) {
    $.ajax({
        url: 'api/get_tickets.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                const ticket = response.data.find(t => t.id == id);
                if (ticket) {
                    populateForm(ticket);
                    // Scroll to form
                    $('html, body').animate({
                        scrollTop: $('#ticketForm').offset().top - 100
                    }, 500);
                }
            }
        },
        error: function (xhr) {
            console.error('Error loading ticket:', xhr);
            showAlert('error', 'Failed to load ticket details.');
        }
    });
}

// Populate form with ticket data
function populateForm(ticket) {
    isEditing = true;

    $('#ticketId').val(ticket.id);
    $('#title').val(ticket.title);
    $('#description').val(ticket.description);
    $('#quantity').val(ticket.quantity);
    $('#price').val(ticket.price);
    $('#visibility').val(ticket.visibility);

    // Format dates for datetime-local input
    $('#sale_start_date').val(formatDateTimeLocal(ticket.sale_start_date));
    $('#sale_end_date').val(formatDateTimeLocal(ticket.sale_end_date));

    // Show image preview if exists
    if (ticket.image_path) {
        $('#previewImg').attr('src', ticket.image_path);
        $('#imagePreview').removeClass('hidden');
    }

    // Update form UI
    $('#formTitle').text('Edit Ticket');
    $('#btnText').text('Update Ticket');
    $('#cancelBtn').show();
}

// Reset form
function resetForm() {
    isEditing = false;
    $('#ticketForm')[0].reset();
    $('#ticketId').val('');
    $('#imagePreview').addClass('hidden');
    $('#formTitle').text('Create New Ticket');
    $('#btnText').text('Create Ticket');
    $('#cancelBtn').hide();
}

// Open delete confirmation modal
function openDeleteModal(id) {
    deleteTicketId = id;
    $('#deleteModal').addClass('active');
}

// Close delete modal
function closeDeleteModal() {
    deleteTicketId = null;
    $('#deleteModal').removeClass('active');
}

// Confirm delete
function confirmDelete() {
    if (!deleteTicketId) return;

    $.ajax({
        url: 'api/delete_ticket.php',
        method: 'POST',
        data: { id: deleteTicketId },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                showAlert('success', response.message);
                loadTickets();
                closeDeleteModal();
            } else {
                showAlert('error', response.message);
            }
        },
        error: function (xhr) {
            console.error('Error deleting ticket:', xhr);
            showAlert('error', 'Failed to delete ticket. Please try again.');
        }
    });
}

// Show alert message
function showAlert(type, message) {
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    const alert = $(`
        <div class="alert ${alertClass}">
            ${escapeHtml(message)}
        </div>
    `);

    $('#alertContainer').html(alert);
    alert.fadeIn();

    setTimeout(() => {
        alert.fadeOut(() => alert.remove());
    }, 5000);
}

// Format date for datetime-local input
function formatDateTimeLocal(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}