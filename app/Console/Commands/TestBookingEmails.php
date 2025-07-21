<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use App\Services\EmailService;
use Illuminate\Support\Facades\Log;

class TestBookingEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:booking-emails {--booking-id= : ID of the booking to test with}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test booking approval and rejection emails';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $bookingId = $this->option('booking-id');
        
        if (!$bookingId) {
            // Find a pending booking to test with
            $booking = Booking::with(['user', 'validatedBy'])
                ->where('status', 'pending')
                ->first();
                
            if (!$booking) {
                $this->error('Aucune réservation en attente trouvée. Veuillez spécifier un ID de réservation avec --booking-id=ID');
                return 1;
            }
            
            $bookingId = $booking->id;
            $this->info("Utilisation de la réservation #{$bookingId} pour les tests");
        } else {
            $booking = Booking::with(['user', 'validatedBy'])->find($bookingId);
            
            if (!$booking) {
                $this->error("Réservation #{$bookingId} non trouvée");
                return 1;
            }
        }

        $this->info("Test des emails pour la réservation #{$booking->id}");
        $this->info("Client: {$booking->user->firstname} {$booking->user->lastname} ({$booking->user->email})");
        $this->info("Période: " . \Carbon\Carbon::parse($booking->start)->format('d/m/Y') . " - " . \Carbon\Carbon::parse($booking->end)->format('d/m/Y'));
        $this->info("Statut actuel: {$booking->status}");
        $this->line('');

        $emailService = new EmailService();

        // Test approval email
        $this->info('🧪 Test de l\'email d\'approbation...');
        try {
            $emailService->sendBookingApprovedEmail($booking);
            $this->info('✅ Email d\'approbation envoyé avec succès');
        } catch (\Exception $e) {
            $this->error('❌ Erreur lors de l\'envoi de l\'email d\'approbation: ' . $e->getMessage());
            Log::error('Test booking approval email failed', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);
        }

        $this->line('');

        // Test rejection email
        $this->info('🧪 Test de l\'email de refus...');
        try {
            $emailService->sendBookingRejectedEmail($booking);
            $this->info('✅ Email de refus envoyé avec succès');
        } catch (\Exception $e) {
            $this->error('❌ Erreur lors de l\'envoi de l\'email de refus: ' . $e->getMessage());
            Log::error('Test booking rejection email failed', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);
        }

        $this->line('');
        $this->info('🎉 Tests terminés ! Vérifiez les emails reçus.');

        return 0;
    }
} 