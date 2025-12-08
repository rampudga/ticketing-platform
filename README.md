# 🎫 Dynamic Ticketing Platform

A full-stack event ticketing system with complete CRUD operations, shopping cart, and checkout functionality.

## 🎯 Project Overview

This ticketing platform features:
- Organizer Dashboard - Create, edit, delete, and manage event tickets
- Buyer Interface - Browse tickets, add to cart, and complete purchases
- Zero page reloads - All operations via AJAX for smooth UX

Built with: PHP, MySQL, JavaScript, jQuery, HTML/CSS

---

## 🚀 Quick Setup

### Prerequisites
- XAMPP (with PHP 8.x and MySQL)
- Web browser

### Installation Steps

1. Extract & Place Files
```
Extract ZIP to: C:\xampp\htdocs\ticketing-platform
```

2. Create Database
- Open: `http://localhost/phpmyadmin`
- Create new database: `ticketing_platform`
- Click Import tab
- Select file: `ticketing_platform.sql`
- Click Go

3. Configure Database (if needed)

Edit `includes/db.php` if your MySQL settings differ:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');           
define('DB_NAME', 'ticketing_platform');
define('DB_PORT', 3307);         
```

4. Set Permissions

Ensure `assets/uploads/` folder is writable for image uploads.

5. Start Application
- Start Apache & MySQL in XAMPP
- Organizer: `http://localhost/ticketing-platform/organizer.php`
- Buyer: `http://localhost/ticketing-platform/index.php`

---

## 📁 Project Structure

```
ticketing-platform/
├── api/                      # 8 RESTful API endpoints
│   ├── create_ticket.php     # Create new ticket
│   ├── get_tickets.php       # Retrieve tickets
│   ├── update_ticket.php     # Update ticket
│   ├── delete_ticket.php     # Delete ticket
│   ├── add_to_cart.php       # Add to shopping cart
│   ├── get_cart.php          # Get cart items
│   ├── remove_from_cart.php  # Remove from cart
│   └── clear_cart.php        # Clear entire cart
├── assets/
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript logic
│   └── uploads/              # Uploaded images
├── includes/
│   └── db.php                # Database connection
├── index.php                 # Buyer interface
├── organizer.php             # Organizer dashboard
├── ticketing_platform.sql    # Database schema
└── README.md                 # This file
```

---

## ✨ Key Features

### Organizer Dashboard (`organizer.php`)
✅ Create Tickets - Form with validation, image upload, date selection  
✅ View All Tickets - Table with images, prices, quantities, visibility  
✅ Edit Tickets - Pre-populated form, update any field  
✅ Delete Tickets - Confirmation modal, cascade deletion  
✅ Real-time Updates - No page reloads via AJAX  

### Buyer Interface (`index.php`)
✅ Browse Tickets - Grid layout, shows only available tickets  
✅ Add to Cart - Quantity selector, cart badge counter  
✅ View Cart - Modal with items, subtotals, and total  
✅ Remove Items - Update cart dynamically  
✅ Checkout Flow - Review order → Complete purchase → Success message  
✅ Session-based Cart - Persists across page navigation  

---

## 🔒 Security Features

- SQL Injection Prevention - Prepared statements with bound parameters
- XSS Protection - HTML escaping on all outputs
- File Upload Security - Type/size validation, unique filenames
- Input Validation - Client-side and server-side checks
- Session Security - Secure session handling

---

## 💾 Database Schema

### `tickets` Table
Stores all ticket information including title, description, dates, price, quantity, visibility, and image path.

Key Fields: id, title, description, sale_start_date, sale_end_date, quantity, price, visibility (public/private), image_path

### `cart_items` Table
Session-based shopping cart linking users to tickets.

Key Fields: id, session_id, ticket_id, quantity, added_at

Relationships: Foreign key to tickets table with cascade delete

---

## 🧪 Testing Guide

### Test Organizer Features:
1. Navigate to `organizer.php`
2. Fill form and click "Create Ticket"
3. Upload an image (JPG/PNG, max 5MB)
4. View new ticket in table
5. Click "Edit" → Modify fields → Save
6. Click "Delete" → Confirm deletion

### Test Buyer Features:
1. Navigate to `index.php`
2. Browse available tickets
3. Increase quantity using +/- buttons
4. Click "Add to Cart" (cart badge updates)
5. Click "Cart" button (modal opens)
6. Click "Remove" on an item
7. Click "Proceed to Review"
8. Review order summary
9. Click "Complete Purchase"
10. See success confirmation

---

## 🛠️ Technologies Used

Backend:
- PHP 8.x
- MySQL 5.7+
- Session management

Frontend:
- HTML5 & CSS3
- JavaScript (ES6)
- jQuery 3.6.0
- AJAX for async operations

Architecture:
- RESTful API design
- MVC-inspired structure
- Responsive design

---

## 🐛 Troubleshooting

### Database Connection Failed
- Verify MySQL is running in XAMPP
- Check credentials in `includes/db.php`
- Confirm database `ticketing_platform` exists

### Image Upload Failed
- Check `assets/uploads/` folder exists
- Verify folder has write permissions
- Ensure file is under 5MB
- Use JPG, PNG, GIF, or WEBP format

### Cart Not Working
- Clear browser cookies
- Check browser console for errors
- Verify sessions are enabled in PHP

### MySQL Port Error
- If MySQL uses port 3307 instead of 3306
- Update `DB_PORT` in `includes/db.php`

---

## 📊 API Documentation

### Ticket Management

```http
GET  /api/get_tickets.php              # Get all tickets
GET  /api/get_tickets.php?filter=active # Get active tickets only
POST /api/create_ticket.php            # Create new ticket
POST /api/update_ticket.php            # Update existing ticket
POST /api/delete_ticket.php            # Delete ticket
```

### Shopping Cart

```http
GET  /api/get_cart.php                 # Get cart items
POST /api/add_to_cart.php              # Add item to cart
POST /api/remove_from_cart.php         # Remove item from cart
POST /api/clear_cart.php               # Clear entire cart
```

Response Format:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

---

## 🎓 Technical Highlights

1. Zero Page Reloads
All CRUD operations and cart management use AJAX for seamless UX.

2. Session-based Cart
No login required - cart persists using PHP sessions.

3. Image Management
Automatic upload, validation, and cleanup on delete/update.

4. Date Validation
Server-side checks ensure tickets only show during sale period.

5. Real-time Updates
Dynamic DOM manipulation updates UI instantly.

---

## 🚀 Future Enhancements

Phase 1:
- User authentication system
- Order history tracking
- Email notifications
- Payment gateway integration

Phase 2:
- Advanced search and filters
- Analytics dashboard
- QR code ticket generation
- PDF ticket downloads

Phase 3:
- Multi-language support
- Mobile app (React Native)
- Social media integration
- Review and rating system


## 🙏 Acknowledgments

Thank you for reviewing this project. I'm excited to discuss the implementation details, technical decisions, and potential improvements during the interview.

---

Questions? Feel free to reach out via email or LinkedIn!

---