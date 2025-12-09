# 🎫 Dynamic Ticketing Platform

A full-stack event ticketing system with complete CRUD operations, shopping cart, and checkout functionality.

## 🎯 Project Overview

This ticketing platform features:
- Organizer Dashboard - Create, edit, delete, and manage event tickets
- Buyer Interface - Browse tickets, add to cart, and complete purchases
- Zero page reloads - All operations via AJAX for smooth UX

Built with: PHP, MySQL, JavaScript, jQuery, HTML/CSS

## 🚀 Quick Setup

### Prerequisites
- XAMPP (with PHP 8.x and MySQL)
- Web browser


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

## 💾 Database Schema

### `tickets` Table
Stores all ticket information including title, description, dates, price, quantity, visibility, and image path.

Key Fields: id, title, description, sale_start_date, sale_end_date, quantity, price, visibility (public/private), image_path

### `cart_items` Table
Session-based shopping cart linking users to tickets.

Key Fields: id, session_id, ticket_id, quantity, added_at

Relationships: Foreign key to tickets table with cascade delete


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


