<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewUserNotification extends Notification
{
    use Queueable;

    public $newUser;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $newUser)
    {
        $this->newUser = $newUser;
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
        $adminPanelUrl = config('app.url') . '/admin';
        
        return (new MailMessage)
            ->subject('Nouvel utilisateur en attente de validation - Remuzat')
            ->greeting('Bonjour ' . $notifiable->firstname . ' ' . $notifiable->lastname . ',')
            ->line('Un nouvel utilisateur s\'est inscrit sur la plateforme Remuzat et attend votre validation.')
            ->line('**Informations de l\'utilisateur :**')
            ->line('• Nom : ' . $this->newUser->firstname . ' ' . $this->newUser->lastname)
            ->line('• Email : ' . $this->newUser->email)
            ->line('• Date d\'inscription : ' . $this->newUser->created_at->format('d/m/Y H:i'))
            ->action('Accéder au panneau d\'administration', $adminPanelUrl)
            ->line('Veuillez vous connecter au panneau d\'administration pour valider ou rejeter cette inscription.')
            ->line('Merci d\'utiliser notre plateforme !');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'new_user_id' => $this->newUser->id,
            'new_user_name' => $this->newUser->firstname . ' ' . $this->newUser->lastname,
            'new_user_email' => $this->newUser->email,
            'registration_date' => $this->newUser->created_at,
        ];
    }
}
