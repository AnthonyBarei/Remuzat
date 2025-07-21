# Remuzat Email System

This document describes the comprehensive email system implemented for the Remuzat booking platform.

## Features Implemented

### 1. Email Verification System
- **User Registration**: Automatic email verification sent when users register
- **Email Verification**: Secure verification links with expiration (60 minutes)
- **Resend Verification**: Users can request new verification emails
- **Verification Status**: Check if user's email is verified

### 2. Password Reset System
- **Forgot Password**: Users can request password reset links
- **Secure Reset**: Token-based password reset with expiration (60 minutes)
- **Token Verification**: Validate reset tokens before allowing password change
- **Password Update**: Secure password reset with confirmation

### 3. Admin Notifications
- **New Booking Alerts**: Admins receive email notifications for new bookings
- **Overlap Detection**: Notifications include information about overlapping bookings
- **Booking Details**: Complete booking information in admin notifications
- **Action Links**: Direct links to admin panel for quick action

### 4. User Validation Notifications
- **Admin Validation**: Users receive email notifications when their account is validated by an admin
- **Welcome Message**: Congratulatory email with access instructions
- **Account Activation**: Clear information about what users can now do
- **Direct Access Link**: Direct link to the booking system

## Email Templates

### Layout Template
- **File**: `resources/views/emails/layouts/app.blade.php`
- **Features**: 
  - Responsive design
  - Remuzat branding with gradient header
  - Professional styling with Material-UI inspired design
  - Mobile-friendly layout

### Email Templates
1. **Email Verification**: `resources/views/emails/verify-email.blade.php`
2. **Password Reset**: `resources/views/emails/reset-password.blade.php`
3. **Admin New Booking**: `resources/views/emails/admin-new-booking.blade.php`
4. **User Validated**: `resources/views/emails/user-validated.blade.php`

## Backend Implementation

### Mail Classes
- **VerifyEmail**: `app/Mail/VerifyEmail.php`
- **ResetPassword**: `app/Mail/ResetPassword.php`
- **AdminNewBooking**: `app/Mail/AdminNewBooking.php`
- **UserValidated**: `app/Mail/UserValidated.php`

### Controllers
- **EmailVerificationController**: `app/Http/Controllers/Api/EmailVerificationController.php`
- **PasswordResetController**: `app/Http/Controllers/Api/PasswordResetController.php`

### Services
- **EmailService**: `app/Services/EmailService.php`
  - Centralized email sending logic
  - Error handling and logging
  - Admin notification management
  - User validation notification management

### Notifications
- **NewBookingNotification**: `app/Notifications/NewBookingNotification.php`
  - Queue-based notifications for better performance
  - Admin notification for new bookings

## Frontend Implementation

### Components
1. **ForgotPassword**: `resources/js/components/Pages/Auth/ForgotPassword.jsx`
2. **ResetPassword**: `resources/js/components/Pages/Auth/ResetPassword.jsx`
3. **EmailVerification**: `resources/js/components/Pages/Auth/EmailVerification.jsx`

### Features
- **Form Validation**: Client-side validation for all forms
- **Loading States**: Proper loading indicators during API calls
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Clear success messages and redirects
- **Responsive Design**: Mobile-friendly interfaces

## API Endpoints

### Public Endpoints
```
POST /api/forgot-password          # Request password reset
POST /api/reset-password           # Reset password with token
POST /api/verify-reset-token       # Verify reset token
POST /api/email/verify             # Verify email address
POST /api/email/resend             # Resend verification email
```

### Protected Endpoints
```
GET /api/email/check               # Check email verification status
```

## Configuration

### Environment Variables
Add these to your `.env` file:

```env
# Email Configuration
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@remuzat.com
MAIL_FROM_NAME="Remuzat Booking System"

# Frontend URL for email links
FRONTEND_URL=http://localhost:3000

# Queue Configuration (for notifications)
QUEUE_CONNECTION=database
```

### Database Setup
Ensure you have the password reset table:
```bash
php artisan migrate
```

## Usage Examples

### 1. User Registration Flow
1. User registers at `/signup`
2. System automatically sends verification email
3. User clicks verification link in email
4. Email is verified and user can log in

### 2. Password Reset Flow
1. User requests password reset at `/forgot-password`
2. System sends reset email with secure token
3. User clicks reset link and enters new password
4. Password is updated and user can log in

### 3. Admin Notification Flow
1. User creates new booking
2. System detects overlapping bookings (if any)
3. System sends notification email to all admins
4. Admins receive detailed booking information
5. Admins can take action via admin panel

### 4. User Validation Flow
1. Admin validates user account in admin panel
2. System sends validation notification email to user
3. User receives congratulatory email with access instructions
4. User can now access the booking system

## Security Features

### Email Verification
- Secure signed URLs with expiration
- Hash verification for email addresses
- 60-minute expiration for verification links

### Password Reset
- Secure token-based reset system
- Token expiration (60 minutes)
- Password confirmation requirement
- Secure password hashing

### Admin Notifications
- Only sent to admin users
- Include booking details for verification
- Overlap detection and warnings

### User Validation Notifications
- Only sent to validated users
- Include access instructions and welcome message
- Direct links to booking system

## Error Handling

### Backend
- Comprehensive try-catch blocks
- Error logging for debugging
- Graceful fallbacks for email failures
- User-friendly error messages

### Frontend
- Network error handling
- Form validation errors
- Loading state management
- Success/error feedback

## Testing

### Email Testing
For development, you can use:
- **Log Driver**: Emails are logged to `storage/logs/laravel.log`
- **Array Driver**: Emails are stored in memory for testing
- **Mailtrap**: For testing email delivery

### Configuration for Testing
```env
MAIL_MAILER=log
# or
MAIL_MAILER=array
```

## Performance Considerations

### Queue System
- Admin notifications use Laravel's queue system
- Prevents blocking user requests
- Better performance for email sending

### Email Optimization
- HTML emails with inline CSS
- Responsive design for mobile devices
- Optimized image usage
- Clear call-to-action buttons

## Future Enhancements

### Planned Features
1. **Email Templates**: More customizable email templates
2. **Email Preferences**: User email preference settings
3. **Booking Confirmations**: Email confirmations for approved bookings
4. **Reminder Emails**: Booking reminders and notifications
5. **Email Analytics**: Track email open rates and click-through rates

### Additional Email Types
- Welcome emails after verification
- Booking status update emails
- Cancellation confirmation emails
- Admin activity notifications

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check SMTP configuration
   - Verify email credentials
   - Check firewall settings

2. **Verification links not working**
   - Ensure FRONTEND_URL is set correctly
   - Check URL signing configuration
   - Verify route definitions

3. **Admin notifications not received**
   - Check admin user email addresses
   - Verify queue system is running
   - Check notification configuration

### Debug Commands
```bash
# Test email configuration
php artisan tinker
Mail::raw('Test email', function($message) { $message->to('test@example.com')->subject('Test'); });

# Check queue status
php artisan queue:work

# Clear email cache
php artisan config:clear
```

## Support

For issues or questions about the email system:
1. Check the Laravel documentation for mail configuration
2. Review the error logs in `storage/logs/laravel.log`
3. Test email configuration using the debug commands above
4. Verify all environment variables are set correctly 