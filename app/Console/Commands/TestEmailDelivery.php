<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\EmailService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class TestEmailDelivery extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:email-delivery {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test email delivery with detailed debugging';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info("=== Email Delivery Test ===");
        $this->info("Testing delivery to: {$email}");
        
        // Check mail configuration
        $this->info("\n📧 Mail Configuration:");
        $this->info("   Driver: " . config('mail.default'));
        $this->info("   Host: " . config('mail.mailers.smtp.host'));
        $this->info("   Port: " . config('mail.mailers.smtp.port'));
        $this->info("   Encryption: " . config('mail.mailers.smtp.encryption'));
        $this->info("   From: " . config('mail.from.address') . ' (' . config('mail.from.name') . ')');
        
        // Find or create test user
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $this->warn("User not found. Creating test user...");
            $user = User::create([
                'firstname' => 'Test',
                'lastname' => 'Delivery',
                'email' => $email,
                'password' => bcrypt('password'),
                'admin_validated' => false,
            ]);
            $this->info("Created test user: {$user->firstname} {$user->lastname}");
        } else {
            $this->info("Found user: {$user->firstname} {$user->lastname}");
        }
        
        $this->info("\n📤 Sending test emails...");
        
        // Test 1: Simple text email
        $this->info("\n1️⃣ Simple text email:");
        try {
            Mail::raw('Ceci est un test de livraison email depuis Remuzat. Si vous recevez cet email, la livraison fonctionne correctement.', function($message) use ($email) {
                $message->to($email)
                        ->subject('Test de livraison - Remuzat')
                        ->replyTo(config('mail.from.address'))
                        ->priority(1);
            });
            $this->info("   ✅ Envoyé avec succès");
        } catch (\Exception $e) {
            $this->error("   ❌ Échec: " . $e->getMessage());
        }
        
        // Test 2: HTML email with template
        $this->info("\n2️⃣ Email HTML avec template:");
        try {
            Mail::send('emails.user-validated', ['user' => $user], function($message) use ($email, $user) {
                $message->to($email)
                        ->subject('Test HTML - Votre compte a été validé - Remuzat')
                        ->replyTo(config('mail.from.address'))
                        ->priority(1);
            });
            $this->info("   ✅ Envoyé avec succès");
        } catch (\Exception $e) {
            $this->error("   ❌ Échec: " . $e->getMessage());
        }
        
        // Test 3: Verification email
        $this->info("\n3️⃣ Email de vérification:");
        try {
            $emailService = new EmailService();
            $emailService->sendVerificationEmail($user);
            $this->info("   ✅ Envoyé avec succès");
        } catch (\Exception $e) {
            $this->error("   ❌ Échec: " . $e->getMessage());
        }
        
        // Test 4: User validated email
        $this->info("\n4️⃣ Email de validation utilisateur:");
        try {
            $emailService = new EmailService();
            $emailService->sendUserValidatedEmail($user);
            $this->info("   ✅ Envoyé avec succès");
        } catch (\Exception $e) {
            $this->error("   ❌ Échec: " . $e->getMessage());
        }
        
        $this->info("\n=== Instructions de vérification ===");
        $this->info("1. Vérifiez votre boîte de réception principale");
        $this->info("2. Vérifiez votre dossier SPAM/JUNK");
        $this->info("3. Vérifiez les filtres Outlook");
        $this->info("4. Ajoutez " . config('mail.from.address') . " à vos contacts");
        $this->info("5. Vérifiez les paramètres de sécurité Outlook");
        
        $this->info("\n=== Conseils pour améliorer la livraison ===");
        $this->info("• Ajoutez l'adresse d'expédition à vos contacts");
        $this->info("• Marquez les emails comme 'Non spam' si ils sont dans le spam");
        $this->info("• Vérifiez les paramètres de sécurité de votre client email");
        $this->info("• Contactez votre hébergeur pour vérifier la configuration SPF/DKIM");
        
        return 0;
    }
} 