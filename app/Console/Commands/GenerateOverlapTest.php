<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class GenerateOverlapTest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:overlap-test {--clear : Clear existing test data}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate specific test scenarios for overlap detection testing';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('🧪 Generating overlap test scenarios...');

        if ($this->option('clear')) {
            $this->clearTestData();
        }

        $this->generateTestUsers();
        $this->generateOverlapScenarios();

        $this->info('✅ Overlap test scenarios generated successfully!');
        $this->displayOverlapSummary();

        return 0;
    }

    /**
     * Clear existing test data
     */
    private function clearTestData()
    {
        $this->info('🗑️  Clearing existing test data...');
        
        // Keep the original super admin
        User::where('email', '!=', 'superadmin@remuzat.com')->delete();
        Booking::truncate();
        
        $this->info('✅ Test data cleared (original super admin preserved)');
    }

    /**
     * Generate test users
     */
    private function generateTestUsers()
    {
        $this->info('👥 Creating test users...');

        $users = [
            [
                'firstname' => 'Alice',
                'lastname' => 'Martin',
                'email' => 'alice.martin@test.com',
                'role' => 'user',
                'color' => '#2196F3'
            ],
            [
                'firstname' => 'Bob',
                'lastname' => 'Bernard',
                'email' => 'bob.bernard@test.com',
                'role' => 'user',
                'color' => '#4CAF50'
            ],
            [
                'firstname' => 'Charlie',
                'lastname' => 'Dubois',
                'email' => 'charlie.dubois@test.com',
                'role' => 'user',
                'color' => '#FF9800'
            ],
            [
                'firstname' => 'Admin',
                'lastname' => 'Test',
                'email' => 'admin.test@test.com',
                'role' => 'admin',
                'color' => '#9C27B0'
            ]
        ];

        foreach ($users as $userData) {
            User::create([
                'firstname' => $userData['firstname'],
                'lastname' => $userData['lastname'],
                'email' => $userData['email'],
                'password' => Hash::make('password123'),
                'role' => $userData['role'],
                'is_admin' => in_array($userData['role'], ['admin', 'super_admin']),
                'email_verified_at' => now(),
                'color_preference' => $userData['color'],
            ]);
        }

        $this->info('✅ Created 4 test users');
    }

    /**
     * Generate specific overlap scenarios
     */
    private function generateOverlapScenarios()
    {
        $this->info('📅 Creating overlap test scenarios...');

        $users = User::where('email', '!=', 'superadmin@remuzat.com')->get();
        $alice = User::where('email', 'alice.martin@test.com')->first();
        $bob = User::where('email', 'bob.bernard@test.com')->first();
        $charlie = User::where('email', 'charlie.dubois@test.com')->first();
        $admin = User::where('email', 'admin.test@test.com')->first();

        // Start from next week
        $baseDate = Carbon::now()->addWeek()->startOfWeek();

        // Scenario 1: Same user overlap (should be prevented)
        $this->createBooking($alice, $baseDate->copy()->addDays(1), 5, 'approved');
        $this->createBooking($alice, $baseDate->copy()->addDays(3), 3, 'pending'); // Overlaps with previous

        // Scenario 2: Different users overlap (should be allowed but marked pending)
        $this->createBooking($bob, $baseDate->copy()->addDays(10), 4, 'approved');
        $this->createBooking($charlie, $baseDate->copy()->addDays(12), 3, 'pending'); // Overlaps with Bob

        // Scenario 3: Multiple overlaps
        $this->createBooking($alice, $baseDate->copy()->addDays(20), 7, 'approved');
        $this->createBooking($bob, $baseDate->copy()->addDays(22), 5, 'pending'); // Overlaps with Alice
        $this->createBooking($charlie, $baseDate->copy()->addDays(24), 4, 'pending'); // Overlaps with both

        // Scenario 4: Gap scenario (no overlaps)
        $this->createBooking($admin, $baseDate->copy()->addDays(30), 3, 'approved');
        $this->createBooking($alice, $baseDate->copy()->addDays(35), 2, 'approved'); // Gap of 2 days

        // Scenario 5: Edge case overlaps
        $this->createBooking($bob, $baseDate->copy()->addDays(40), 5, 'approved');
        $this->createBooking($charlie, $baseDate->copy()->addDays(44), 3, 'pending'); // Ends exactly when Bob's starts
        $this->createBooking($admin, $baseDate->copy()->addDays(45), 2, 'pending'); // Starts exactly when Bob's ends

        // Scenario 6: Long duration with overlaps
        $this->createBooking($alice, $baseDate->copy()->addDays(50), 10, 'approved');
        $this->createBooking($bob, $baseDate->copy()->addDays(55), 3, 'pending'); // Overlaps in middle
        $this->createBooking($charlie, $baseDate->copy()->addDays(58), 5, 'pending'); // Overlaps at end

        // Scenario 7: Same day bookings
        $this->createBooking($admin, $baseDate->copy()->addDays(60), 1, 'approved');
        $this->createBooking($alice, $baseDate->copy()->addDays(60), 1, 'pending'); // Same day

        // Scenario 8: Cancelled bookings (should not affect overlap detection)
        $this->createBooking($bob, $baseDate->copy()->addDays(70), 5, 'cancelled');
        $this->createBooking($charlie, $baseDate->copy()->addDays(72), 3, 'approved'); // Should be allowed

        $this->info('✅ Created 15 test bookings with various overlap scenarios');
    }

    /**
     * Create a booking
     */
    private function createBooking($user, $startDate, $duration, $status)
    {
        $endDate = $startDate->copy()->addDays($duration - 1);
        $startDay = $startDate->dayOfYear;
        $endDay = $endDate->dayOfYear;
        $gap = 0; // For test data, we'll set gap to 0

        return Booking::create([
            'start' => $startDate,
            'end' => $endDate,
            'start_day' => $startDay,
            'end_day' => $endDay,
            'gap' => $gap,
            'duration' => $duration,
            'type' => 'booking',
            'added_by' => $user->id,
            'status' => $status,
            'validated_by' => $status === 'approved' ? User::where('role', 'admin')->first()?->id : null,
        ]);
    }

    /**
     * Display overlap test summary
     */
    private function displayOverlapSummary()
    {
        $this->newLine();
        $this->info('🧪 Overlap Test Scenarios:');
        $this->info('==========================');
        
        $this->info('📅 Test Bookings Created:');
        $this->info('   - Alice: 4 bookings (including overlaps)');
        $this->info('   - Bob: 4 bookings (including overlaps)');
        $this->info('   - Charlie: 4 bookings (including overlaps)');
        $this->info('   - Admin: 3 bookings (including overlaps)');
        
        $this->newLine();
        $this->info('🔍 Test Scenarios:');
        $this->info('   1. Same user overlap (should be prevented)');
        $this->info('   2. Different users overlap (should be allowed but pending)');
        $this->info('   3. Multiple overlaps (complex scenario)');
        $this->info('   4. Gap scenario (no overlaps)');
        $this->info('   5. Edge case overlaps (exact start/end dates)');
        $this->info('   6. Long duration with overlaps');
        $this->info('   7. Same day bookings');
        $this->info('   8. Cancelled bookings (should not affect overlap detection)');
        
        $this->newLine();
        $this->info('🔑 Test Credentials:');
        $this->info('===================');
        $this->info('All users have password: password123');
        $this->info('• Alice: alice.martin@test.com (Regular User)');
        $this->info('• Bob: bob.bernard@test.com (Regular User)');
        $this->info('• Charlie: charlie.dubois@test.com (Regular User)');
        $this->info('• Admin: admin.test@test.com (Admin)');
        $this->info('• Super Admin: superadmin@remuzat.com (Super Admin)');
        
        $this->newLine();
        $this->info('📊 Expected Results:');
        $this->info('===================');
        $this->info('✅ Same user overlaps should be prevented');
        $this->info('✅ Different user overlaps should be allowed but marked pending');
        $this->info('✅ Admin should see overlap warnings in admin panel');
        $this->info('✅ Cancelled bookings should not block new bookings');
        $this->info('✅ Gap bookings should be approved immediately');
        
        $this->newLine();
        $this->info('💡 Testing Tips:');
        $this->info('===============');
        $this->info('• Try creating new bookings that overlap with existing ones');
        $this->info('• Check the admin panel for overlap warnings');
        $this->info('• Test the overlap detection in the booking form');
        $this->info('• Verify that cancelled bookings don\'t block new bookings');
    }
}
