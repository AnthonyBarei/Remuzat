<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\EmailService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class TestUserValidatedEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:user-validated-email {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test user validated email functionality by sending a validation notification email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info("Testing user validated email functionality for: {$email}");
        
        try {
            // Find or create a test user
            $user = User::where('email', $email)->first();
            
            if (!$user) {
                $this->error("User with email {$email} not found.");
                return 1;
            }
            
            $this->info("Found user: {$user->firstname} {$user->lastname}");
            
            // Test the email service
            $emailService = new EmailService();
            
            $this->info("Sending user validated email...");
            $emailService->sendUserValidatedEmail($user);
            
            $this->info("Email sent successfully!");
            
            return 0;
        } catch (\Exception $e) {
            $this->error("Error sending email: " . $e->getMessage());
            Log::error('Test user validated email failed: ' . $e->getMessage(), [
                'email' => $email,
                'exception' => $e
            ]);
            return 1;
        }
    }
} 