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

class VerifyEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $verificationUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
        $this->verificationUrl = $this->generateVerificationUrl($user);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirmez votre adresse email - Remuzat',
            tags: ['verification', 'remuzat'],
            metadata: [
                'user_id' => $this->user->id,
                'email_type' => 'verification',
            ],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.verify-email',
            with: [
                'user' => $this->user,
                'verificationUrl' => $this->verificationUrl,
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
     * Generate the verification URL for the user.
     */
    protected function generateVerificationUrl(User $user): string
    {
        // Generate the verification URL for the frontend
        $frontendUrl = config('email.frontend_url', config('app.url'));
        
        // Ensure we have a valid URL
        if (empty($frontendUrl) || $frontendUrl === 'http://localhost') {
            $frontendUrl = 'http://localhost:3000'; // Default fallback
        }
        
        $verificationUrl = $frontendUrl . '/email/verify?' . http_build_query([
            'id' => $user->getKey(),
            'hash' => sha1($user->getEmailForVerification()),
        ]);

        return $verificationUrl;
    }
} 