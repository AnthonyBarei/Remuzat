# Remuzat Booking System

A beautiful booking system for the village of Remuzat, built with Laravel 9 and React 18.

![Remuzat Booking System](https://img.shields.io/badge/Laravel-9-red?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Material-UI](https://img.shields.io/badge/Material--UI-5.0-blue?style=for-the-badge&logo=mui)

## 🌟 Features

### Booking System
- **Beautiful Calendar Interface**: Week-based calendar view with intuitive booking management
- **Multi-day Bookings**: Support for extended stays with visual indicators
- **Booking Types**: Currently supports holiday bookings (expandable to meetings/vacations)
- **Status Management**: Pending, approved, and cancelled booking states
- **Smart Overlap Management**: 
  - Users cannot overlap their own reservations
  - Users can overlap other users' reservations (requires admin validation)
  - Visual indicators for overlapping bookings
  - Admin warnings with specific user names
- **Real-time Updates**: Immediate UI updates after booking creation

### User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: User preference-based theming with Material-UI
- **Color Customization**: Users can set their preferred color scheme
- **Loading States**: Smooth loading indicators and error handling
- **Form Validation**: Client and server-side validation with clear feedback

### Authentication & Security
- **Laravel Sanctum**: Secure API authentication
- **User Registration/Login**: Complete authentication flow
- **Role-based Access**: User and admin permissions with policy-based authorization
- **CSRF Protection**: Built-in security measures
- **Input Validation**: Comprehensive data validation
- **Admin Panel**: Complete admin interface for user and booking management
- **Email Verification**: Secure email verification system
- **Admin Validation**: Two-step user validation (email + admin approval)
- **Email Notifications**: Comprehensive email system for user lifecycle events

### Landing Page
- **Beautiful Hero Section**: Showcasing the village of Remuzat
- **Responsive Navigation**: Fixed transparent navbar with smooth scrolling
- **Feature Highlights**: Key benefits of the booking system
- **Call-to-Action**: Clear path to start booking

## 🚀 Tech Stack

### Backend
- **Laravel 9**: PHP framework with elegant syntax
- **MySQL/PostgreSQL**: Database support
- **Laravel Sanctum**: API authentication
- **Eloquent ORM**: Database relationships and queries

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Material-UI (MUI)**: Beautiful, accessible components
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing

## 📁 Project Structure

```
remuzat/
├── app/
│   ├── Http/Controllers/Api/     # API controllers
│   ├── Models/                   # Eloquent models
│   └── Http/Resources/           # API resources
├── resources/js/
│   ├── components/
│   │   ├── Booking/             # Booking components
│   │   ├── Layouts/             # Layout components
│   │   ├── Pages/               # Page components
│   │   └── Routes/              # Route components
│   └── context/                 # React context
├── database/migrations/          # Database migrations
└── routes/api.php               # API routes
```

## 🛠️ Installation

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 16+
- MySQL/PostgreSQL

### Backend Setup
```bash
# Clone the repository
git clone <repository-url>
cd remuzat

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env file
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=remuzat
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations
php artisan migrate

# Start the server
php artisan serve
```

### Frontend Setup
```bash
# Install Node.js dependencies
npm install

# Build assets for development
npm run dev

# Or build for production
npm run build
```

## 🎯 Usage

### For Users
1. Visit the landing page to learn about Remuzat
2. Navigate to `/reservation` to access the booking system
3. Register or login to your account
4. Use the calendar interface to create bookings
5. View and manage your existing bookings

### For Admins
1. Access the admin panel at `/admin`
2. View all reservations with filtering and statistics
3. Approve, reject, or modify bookings
4. Manage users (authorize, delete, resend validation emails)
5. Monitor overlapping bookings with visual indicators
6. Receive email notifications for new bookings and user registrations
7. Users automatically receive validation confirmation emails

### For Developers
- API documentation available at `/api` endpoints
- All booking endpoints require authentication
- Use Postman or similar tools for API testing
- Check the `.cursorrules` file for coding standards

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/email/verify` - Verify email address
- `POST /api/email/resend` - Resend verification email
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password with token

### Bookings
- `GET /api/reservations` - List user's bookings
- `POST /api/reservations` - Create new booking
- `PUT /api/reservations/{id}` - Update booking
- `DELETE /api/reservations/{id}` - Cancel booking

### Admin Endpoints
- `GET /api/admin/reservations` - List all bookings with filtering and pagination
- `PUT /api/admin/reservations/{id}` - Admin update booking
- `POST /api/admin/reservations/{id}/approve` - Approve booking
- `POST /api/admin/reservations/{id}/reject` - Reject booking
- `GET /api/admin/reservations/statistics` - Get booking statistics
- `GET /api/users` - List all users
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `POST /api/users/{id}/authorize` - Authorize user
- `POST /api/users/{id}/resend-validation` - Resend validation email

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## 🎨 Customization

### Theming
- Modify `resources/js/context/theme.js` for theme changes
- User color preferences are stored in the database
- Material-UI theme provider handles dark/light modes

### Booking Types
- Currently supports "booking" type (holidays)
- Extend `BookingController` and database for additional types
- Update frontend components to handle new types

### Email System
- Email templates located in `resources/views/emails/`
- Mail classes in `app/Mail/`
- Email service in `app/Services/EmailService.php`
- Configure SMTP settings in `.env` file
- Test emails using artisan commands: `php artisan test:email` and `php artisan test:user-validated-email`

## 🧪 Testing

```bash
# Run PHP tests
php artisan test

# Run frontend tests (if configured)
npm test

# Test email functionality
php artisan test:email user@example.com
php artisan test:user-validated-email user@example.com
```

## 📝 Contributing

1. Follow the coding standards in `.cursorrules`
2. Use TypeScript for all frontend components
3. Implement proper error handling
4. Add tests for new features
5. Ensure responsive design

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🤝 Support

For support and questions, please refer to the project documentation or create an issue in the repository.

---

**Built with ❤️ for the beautiful village of Remuzat**
