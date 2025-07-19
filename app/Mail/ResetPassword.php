<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

class ResetPassword extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $resetUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, string $token)
    {
        $this->user = $user;
        $this->resetUrl = $this->generateResetUrl($user, $token);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Réinitialisation de votre mot de passe - Remuzat',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.reset-password',
            with: [
                'user' => $this->user,
                'resetUrl' => $this->resetUrl,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    /**
     * Generate the password reset URL.
     */
    protected function generateResetUrl(User $user, string $token): string
    {
        // Generate the reset URL for the frontend
        $frontendUrl = config('email.frontend_url', config('app.url'));
        
        // Ensure we have a valid URL
        if (empty($frontendUrl) || $frontendUrl === 'http://localhost') {
            $frontendUrl = 'http://localhost:3000'; // Default fallback
        }
        
        $resetUrl = $frontendUrl . '/reset-password?' . http_build_query([
            'email' => $user->email,
            'token' => $token,
        ]);

        return $resetUrl;
    }
} 