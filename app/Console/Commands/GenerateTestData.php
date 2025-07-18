<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class GenerateTestData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:test-data {--users=10 : Number of users to generate} {--bookings=20 : Number of bookings to generate} {--clear : Clear existing test data}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate comprehensive test data with users of different roles and various booking scenarios';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('🚀 Starting test data generation...');

        if ($this->option('clear')) {
            $this->clearTestData();
        }

        $this->generateUsers();
        $this->generateBookings();

        $this->info('✅ Test data generation completed successfully!');
        $this->displaySummary();

        return 0;
    }

    /**
     * Clear existing test data
     */
    private function clearTestData()
    {
        $this->info('🗑️  Clearing existing test data...');
        
        // Keep the original super admin
        $originalSuperAdmin = User::where('email', 'superadmin@remuzat.com')->first();
        
        // Delete all other test users and their bookings
        User::where('email', '!=', 'superadmin@remuzat.com')->delete();
        Booking::truncate();
        
        $this->info('✅ Test data cleared (original super admin preserved)');
    }

    /**
     * Generate users with different roles
     */
    private function generateUsers()
    {
        $this->info('👥 Generating users...');

        $userCount = $this->option('users');
        $roles = ['user', 'admin', 'super_admin'];
        $roleWeights = [70, 25, 5]; // 70% users, 25% admins, 5% super admins

        $firstNames = [
            'Jean', 'Marie', 'Pierre', 'Sophie', 'Michel', 'Isabelle', 'François', 'Catherine',
            'Philippe', 'Nathalie', 'David', 'Valérie', 'Thomas', 'Sandrine', 'Nicolas', 'Laure',
            'Sébastien', 'Céline', 'Vincent', 'Delphine', 'Alexandre', 'Émilie', 'Guillaume', 'Julie',
            'Raphaël', 'Caroline', 'Antoine', 'Aurélie', 'Maxime', 'Stéphanie'
        ];

        $lastNames = [
            'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand',
            'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David',
            'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel', 'Girard', 'André', 'Lefèvre',
            'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez'
        ];

        $usersCreated = 0;
        $roleCounts = ['user' => 0, 'admin' => 0, 'super_admin' => 0];

        for ($i = 0; $i < $userCount; $i++) {
            // Determine role based on weights
            $role = $this->getWeightedRole($roles, $roleWeights);
            
            // Skip super admin creation if we already have one (except the original)
            if ($role === 'super_admin' && User::where('role', 'super_admin')->count() > 0) {
                $role = 'admin'; // Fallback to admin
            }

            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $email = strtolower($firstName . '.' . $lastName . rand(1, 999) . '@test.com');

            $user = User::create([
                'firstname' => $firstName,
                'lastname' => $lastName,
                'email' => $email,
                'password' => Hash::make('password123'),
                'role' => $role,
                'is_admin' => in_array($role, ['admin', 'super_admin']),
                'email_verified_at' => now(),
                'color_preference' => $this->getRandomColor(),
            ]);

            $roleCounts[$role]++;
            $usersCreated++;

            if ($usersCreated % 5 === 0) {
                $this->info("Created {$usersCreated} users...");
            }
        }

        $this->info("✅ Created {$usersCreated} users:");
        $this->info("   - {$roleCounts['user']} regular users");
        $this->info("   - {$roleCounts['admin']} admins");
        $this->info("   - {$roleCounts['super_admin']} super admins");
    }

    /**
     * Generate bookings with various scenarios
     */
    private function generateBookings()
    {
        $this->info('📅 Generating bookings with various scenarios...');

        $bookingCount = $this->option('bookings');
        $users = User::all();
        $statuses = ['pending', 'approved', 'cancelled'];
        $statusWeights = [30, 60, 10]; // 30% pending, 60% approved, 10% cancelled

        $scenarios = [
            'normal' => 40,      // Normal bookings
            'overlap' => 30,     // Overlapping bookings
            'gap' => 20,         // Gaps between bookings
            'long' => 10         // Long duration bookings
        ];

        $bookingsCreated = 0;
        $scenarioCounts = ['normal' => 0, 'overlap' => 0, 'gap' => 0, 'long' => 0];

        // Start from today
        $currentDate = Carbon::now()->startOfDay();

        for ($i = 0; $i < $bookingCount; $i++) {
            $scenario = $this->getWeightedRole(array_keys($scenarios), array_values($scenarios));
            $user = $users->random();
            $status = $this->getWeightedRole($statuses, $statusWeights);

            $booking = $this->createBookingScenario($scenario, $user, $currentDate, $status);
            
            if ($booking) {
                $scenarioCounts[$scenario]++;
                $bookingsCreated++;
            }

            // Move forward in time
            $currentDate->addDays(rand(1, 3));

            if ($bookingsCreated % 5 === 0) {
                $this->info("Created {$bookingsCreated} bookings...");
            }
        }

        $this->info("✅ Created {$bookingsCreated} bookings:");
        $this->info("   - {$scenarioCounts['normal']} normal bookings");
        $this->info("   - {$scenarioCounts['overlap']} overlapping bookings");
        $this->info("   - {$scenarioCounts['gap']} gap bookings");
        $this->info("   - {$scenarioCounts['long']} long duration bookings");
    }

    /**
     * Create booking based on scenario
     */
    private function createBookingScenario($scenario, $user, $currentDate, $status)
    {
        $startDate = $currentDate->copy();
        
        switch ($scenario) {
            case 'normal':
                $duration = rand(1, 7);
                break;
            case 'overlap':
                // Create overlap with existing booking
                $existingBooking = Booking::where('status', 'approved')
                    ->where('start', '>=', $startDate->copy()->subDays(30))
                    ->where('end', '<=', $startDate->copy()->addDays(30))
                    ->first();
                
                if ($existingBooking) {
                    $startDate = $existingBooking->start->copy()->addDays(rand(-2, 2));
                    $duration = rand(1, 5);
                } else {
                    $duration = rand(1, 7);
                }
                break;
            case 'gap':
                // Create gap between bookings
                $lastBooking = Booking::where('status', 'approved')
                    ->where('end', '<', $startDate)
                    ->orderBy('end', 'desc')
                    ->first();
                
                if ($lastBooking) {
                    $startDate = $lastBooking->end->copy()->addDays(rand(3, 7));
                }
                $duration = rand(1, 4);
                break;
            case 'long':
                $duration = rand(10, 21); // Long duration
                break;
            default:
                $duration = rand(1, 7);
        }

        $endDate = $startDate->copy()->addDays($duration - 1);

        // Don't create bookings in the past
        if ($startDate->isPast()) {
            return null;
        }

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
     * Get weighted random role
     */
    private function getWeightedRole($roles, $weights)
    {
        $totalWeight = array_sum($weights);
        $random = rand(1, $totalWeight);
        $currentWeight = 0;

        foreach ($roles as $index => $role) {
            $currentWeight += $weights[$index];
            if ($random <= $currentWeight) {
                return $role;
            }
        }

        return $roles[0]; // Fallback
    }

    /**
     * Get random color preference
     */
    private function getRandomColor()
    {
        $colors = [
            '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336',
            '#00BCD4', '#8BC34A', '#FF5722', '#3F51B5', '#009688'
        ];
        
        return $colors[array_rand($colors)];
    }

    /**
     * Display summary of generated data
     */
    private function displaySummary()
    {
        $this->newLine();
        $this->info('📊 Test Data Summary:');
        $this->info('=====================');
        
        $totalUsers = User::count();
        $totalBookings = Booking::count();
        
        $this->info("👥 Total Users: {$totalUsers}");
        $this->info("   - Regular Users: " . User::where('role', 'user')->count());
        $this->info("   - Admins: " . User::where('role', 'admin')->count());
        $this->info("   - Super Admins: " . User::where('role', 'super_admin')->count());
        
        $this->info("📅 Total Bookings: {$totalBookings}");
        $this->info("   - Pending: " . Booking::where('status', 'pending')->count());
        $this->info("   - Approved: " . Booking::where('status', 'approved')->count());
        $this->info("   - Cancelled: " . Booking::where('status', 'cancelled')->count());
        
        $this->newLine();
        $this->info('🔑 Test Credentials:');
        $this->info('===================');
        $this->info('All test users have password: password123');
        $this->info('Super Admin: superadmin@remuzat.com');
        
        // Show some sample users
        $sampleUsers = User::where('email', '!=', 'superadmin@remuzat.com')
            ->inRandomOrder()
            ->limit(5)
            ->get(['firstname', 'lastname', 'email', 'role']);
        
        $this->info('Sample test users:');
        foreach ($sampleUsers as $user) {
            $this->info("   - {$user->firstname} {$user->lastname} ({$user->email}) - {$user->role}");
        }
        
        $this->newLine();
        $this->info('🧪 Test Scenarios Available:');
        $this->info('============================');
        $this->info('✅ Normal bookings (1-7 days)');
        $this->info('✅ Overlapping bookings (to test overlap detection)');
        $this->info('✅ Gap bookings (to test gap detection)');
        $this->info('✅ Long duration bookings (10-21 days)');
        $this->info('✅ Mixed booking statuses (pending, approved, cancelled)');
        $this->info('✅ Users with different roles and permissions');
        
        $this->newLine();
        $this->info('💡 Usage Tips:');
        $this->info('==============');
        $this->info('• Use --clear to remove existing test data');
        $this->info('• Use --users=20 to generate 20 users');
        $this->info('• Use --bookings=50 to generate 50 bookings');
        $this->info('• Example: php artisan generate:test-data --clear --users=15 --bookings=30');
    }
}
