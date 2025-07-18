<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Check if super admin already exists
        $existingSuperAdmin = User::where('role', 'super_admin')->first();
        
        if ($existingSuperAdmin) {
            $this->command->info('Super admin already exists: ' . $existingSuperAdmin->email);
            return;
        }

        // Create the first super admin (website owner)
        $superAdmin = User::create([
            'firstname' => 'Super',
            'lastname' => 'Admin',
            'email' => 'superadmin@remuzat.com',
            'password' => Hash::make('superadmin123'),
            'role' => 'super_admin',
            'is_admin' => true,
            'email_verified_at' => now(),
            'color_preference' => '#F44336', // Red color for super admin
        ]);

        $this->command->info('Super admin created successfully!');
        $this->command->info('Email: ' . $superAdmin->email);
        $this->command->info('Password: superadmin123');
        $this->command->info('Please change the password after first login!');
    }
}
