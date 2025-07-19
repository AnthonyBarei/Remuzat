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
use Illuminate\Support\Facades\Log;

class EmailService
{
    /**
     * Send email verification to a user.
     */
    public function sendVerificationEmail(User $user): void
    {
        try {
            Mail::to($user->email)->send(new VerifyEmail($user));
        } catch (\Exception $e) {
            Log::error('Failed to send verification email: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'email' => $user->email,
                'exception' => $e
            ]);
            throw $e;
        }
    }

    /**
     * Send password reset email to a user.
     */
    public function sendPasswordResetEmail(User $user): string
    {
        try {
            $token = Password::createToken($user);
            
            // Debug: Log the token creation
            Log::info('Password reset token created in EmailService', [
                'user_id' => $user->id,
                'email' => $user->email,
                'token' => $token,
                'token_length' => strlen($token)
            ]);
            
            Mail::to($user->email)->send(new ResetPassword($user, $token));
            return $token;
        } catch (\Exception $e) {
            Log::error('Failed to send password reset email: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'email' => $user->email,
                'exception' => $e
            ]);
            throw $e;
        }
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
        try {
            if (!$user->hasVerifiedEmail()) {
                $this->sendVerificationEmail($user);
            }
        } catch (\Exception $e) {
            Log::error('Failed to resend verification email: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'email' => $user->email,
                'exception' => $e
            ]);
            throw $e;
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