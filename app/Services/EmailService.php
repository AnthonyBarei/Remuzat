<?php

namespace App\Services;

use App\Models\User;
use App\Models\Booking;
use App\Mail\VerifyEmail;
use App\Mail\ResetPassword;
use App\Mail\AdminNewBooking;
use App\Notifications\NewBookingNotification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;

class EmailService
{
    /**
     * Send email verification to a user.
     */
    public function sendVerificationEmail(User $user): void
    {
        Mail::to($user->email)->send(new VerifyEmail($user));
    }

    /**
     * Send password reset email to a user.
     */
    public function sendPasswordResetEmail(User $user): string
    {
        $token = Password::createToken($user);
        Mail::to($user->email)->send(new ResetPassword($user, $token));
        return $token;
    }

    /**
     * Send admin notification for new booking.
     */
    public function sendAdminNewBookingNotification(Booking $booking, $overlappingBookings = null): void
    {
        // Get all admin users
        $adminUsers = User::where('is_admin', true)
            ->orWhereIn('role', ['admin', 'super_admin'])
            ->get();

        // Send notification to all admins
        foreach ($adminUsers as $admin) {
            $admin->notify(new NewBookingNotification($booking, $overlappingBookings));
        }
    }

    /**
     * Send admin notification for new booking using direct mail.
     */
    public function sendAdminNewBookingEmail(Booking $booking, $overlappingBookings = null): void
    {
        // Get all admin users
        $adminUsers = User::where('is_admin', true)
            ->orWhereIn('role', ['admin', 'super_admin'])
            ->get();

        // Send email to all admins
        foreach ($adminUsers as $admin) {
            Mail::to($admin->email)->send(new AdminNewBooking($booking, $overlappingBookings));
        }
    }

    /**
     * Resend verification email to a user.
     */
    public function resendVerificationEmail(User $user): void
    {
        if (!$user->hasVerifiedEmail()) {
            $this->sendVerificationEmail($user);
        }
    }

    /**
     * Send welcome email after successful verification.
     */
    public function sendWelcomeEmail(User $user): void
    {
        // TODO: Implement welcome email
        // Mail::to($user->email)->send(new \App\Mail\WelcomeEmail($user));
    }

    /**
     * Send booking confirmation email to user.
     */
    public function sendBookingConfirmationEmail(Booking $booking): void
    {
        // TODO: Implement booking confirmation email
        // Mail::to($booking->user->email)->send(new \App\Mail\BookingConfirmation($booking));
    }

    /**
     * Send booking status update email to user.
     */
    public function sendBookingStatusUpdateEmail(Booking $booking): void
    {
        // TODO: Implement booking status update email
        // Mail::to($booking->user->email)->send(new \App\Mail\BookingStatusUpdate($booking));
    }
} 