<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UpdateExistingAdminsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Update existing admin users to have admin_validated = true
        $adminUsers = User::where('is_admin', true)
            ->orWhereIn('role', ['admin', 'super_admin'])
            ->get();

        foreach ($adminUsers as $admin) {
            $admin->admin_validated = true;
            $admin->save();
        }

        $this->command->info('Updated ' . $adminUsers->count() . ' admin users with admin_validated = true');
    }
}
