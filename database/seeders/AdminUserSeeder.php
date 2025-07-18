<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'firstname' => 'Admin',
            'lastname' => 'User',
            'email' => 'admin@remuzat.com',
            'password' => Hash::make('password123'),
            'is_admin' => true,
            'color_preference' => '#2196F3'
        ]);

        $this->command->info('Admin user created successfully!');
        $this->command->info('Email: admin@remuzat.com');
        $this->command->info('Password: password123');
    }
}
