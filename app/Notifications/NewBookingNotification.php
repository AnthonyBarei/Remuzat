<?php

namespace App\Notifications;

use App\Models\Booking;
use App\Mail\AdminNewBooking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewBookingNotification extends Notification
{
    use Queueable;

    public $booking;
    public $overlappingBookings;

    /**
     * Create a new notification instance.
     */
    public function __construct(Booking $booking, $overlappingBookings = null)
    {
        $this->booking = $booking;
        $this->overlappingBookings = $overlappingBookings;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Nouvelle réservation - Action requise - Remuzat')
            ->view('emails.admin-new-booking', [
                'booking' => $this->booking->load('user'),
                'overlappingBookings' => $this->overlappingBookings ?? collect(),
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'user_id' => $this->booking->user_id,
            'start_date' => $this->booking->start,
            'end_date' => $this->booking->end,
            'status' => $this->booking->status,
            'overlapping_count' => $this->overlappingBookings ? $this->overlappingBookings->count() : 0,
        ];
    }
} 