<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminNewBooking extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;
    public $overlappingBookings;

    /**
     * Create a new message instance.
     */
    public function __construct(Booking $booking, $overlappingBookings = null)
    {
        $this->booking = $booking->load('user');
        $this->overlappingBookings = $overlappingBookings ?? collect();
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nouvelle réservation - Action requise - Remuzat',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.admin-new-booking',
            with: [
                'booking' => $this->booking,
                'overlappingBookings' => $this->overlappingBookings,
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
} 