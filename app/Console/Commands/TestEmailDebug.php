<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\EmailService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class TestEmailDebug extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:email-debug {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Debug email functionality and identify issues';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info("=== Email Debug Test ===");
        $this->info("Testing email: {$email}");
        
        // Check mail configuration
        $this->info("\n1. Checking mail configuration:");
        $this->info("   Mail driver: " . config('mail.default'));
        $this->info("   Mail host: " . config('mail.mailers.smtp.host'));
        $this->info("   Mail port: " . config('mail.mailers.smtp.port'));
        $this->info("   Mail encryption: " . config('mail.mailers.smtp.encryption'));
        $this->info("   From address: " . config('mail.from.address'));
        $this->info("   From name: " . config('mail.from.name'));
        
        // Find or create test user
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $this->warn("User with email {$email} not found. Creating test user...");
            $user = User::create([
                'firstname' => 'Test',
                'lastname' => 'User',
                'email' => $email,
                'password' => bcrypt('password'),
                'admin_validated' => false,
            ]);
            $this->info("Created test user: {$user->firstname} {$user->lastname}");
        } else {
            $this->info("Found user: {$user->firstname} {$user->lastname}");
        }
        
        // Test 1: Simple mail send
        $this->info("\n2. Testing simple mail send:");
        try {
            Mail::raw('Test email from Remuzat', function($message) use ($email) {
                $message->to($email)
                        ->subject('Test Email - Remuzat');
            });
            $this->info("   ✅ Simple mail sent successfully");
        } catch (\Exception $e) {
            $this->error("   ❌ Simple mail failed: " . $e->getMessage());
            Log::error('Simple mail test failed: ' . $e->getMessage());
        }
        
        // Test 2: EmailService verification email
        $this->info("\n3. Testing EmailService verification email:");
        try {
            $emailService = new EmailService();
            $emailService->sendVerificationEmail($user);
            $this->info("   ✅ Verification email sent successfully");
        } catch (\Exception $e) {
            $this->error("   ❌ Verification email failed: " . $e->getMessage());
            Log::error('Verification email test failed: ' . $e->getMessage());
        }
        
        // Test 3: User validated email
        $this->info("\n4. Testing user validated email:");
        try {
            $emailService = new EmailService();
            $emailService->sendUserValidatedEmail($user);
            $this->info("   ✅ User validated email sent successfully");
        } catch (\Exception $e) {
            $this->error("   ❌ User validated email failed: " . $e->getMessage());
            Log::error('User validated email test failed: ' . $e->getMessage());
        }
        
        // Test 4: Admin notification
        $this->info("\n5. Testing admin notification:");
        try {
            $emailService = new EmailService();
            $emailService->sendAdminNewUserNotification($user);
            $this->info("   ✅ Admin notification sent successfully");
        } catch (\Exception $e) {
            $this->error("   ❌ Admin notification failed: " . $e->getMessage());
            Log::error('Admin notification test failed: ' . $e->getMessage());
        }
        
        $this->info("\n=== Debug Test Complete ===");
        
        return 0;
    }
} 