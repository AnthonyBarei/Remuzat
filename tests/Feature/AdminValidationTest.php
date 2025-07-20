<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class AdminValidationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function test_new_user_registration_requires_admin_validation()
    {
        // Create a regular user
        $user = User::factory()->create([
            'admin_validated' => false,
            'email_verified_at' => now(),
        ]);

        // Try to login - should fail because admin validation is required
        $response = $this->post('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(403);
        $response->assertJson([
            'success' => false,
            'message' => 'Compte en attente de validation.',
        ]);
    }

    public function test_admin_can_authorize_user()
    {
        // Create an admin user
        $admin = User::factory()->create([
            'is_admin' => true,
            'role' => 'admin',
            'admin_validated' => true,
        ]);

        // Create a regular user
        $user = User::factory()->create([
            'admin_validated' => false,
            'email_verified_at' => now(),
        ]);

        // Admin authorizes the user
        $response = $this->actingAs($admin)
            ->post("/api/users/{$user->id}/authorize");

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => "Utilisateur {$user->firstname} {$user->lastname} autorisé avec succès.",
        ]);

        // Check that user is now admin validated
        $user->refresh();
        $this->assertTrue($user->admin_validated);
        $this->assertNotNull($user->email_verified_at);
    }

    public function test_admin_can_reject_user()
    {
        // Create a super admin user
        $admin = User::factory()->create([
            'is_admin' => true,
            'role' => 'super_admin',
            'admin_validated' => true,
        ]);

        // Create a regular user
        $user = User::factory()->create([
            'admin_validated' => false,
        ]);

        // Admin rejects the user
        $response = $this->actingAs($admin)
            ->post("/api/users/{$user->id}/reject");

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => "Utilisateur {$user->firstname} {$user->lastname} rejeté et supprimé avec succès.",
        ]);

        // Check that user is deleted
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_admin_can_get_pending_users()
    {
        // Clean up any existing users first
        User::query()->delete();
        
        // Create an admin user
        $admin = User::factory()->create([
            'is_admin' => true,
            'role' => 'admin',
            'admin_validated' => true,
        ]);

        // Create pending users
        $pendingUser1 = User::factory()->create([
            'admin_validated' => false,
            'email_verified_at' => now(),
        ]);

        $pendingUser2 = User::factory()->create([
            'admin_validated' => false,
            'email_verified_at' => now(),
        ]);

        // Create an authorized user
        $authorizedUser = User::factory()->create([
            'admin_validated' => true,
            'email_verified_at' => now(),
        ]);

        // Admin gets pending users
        $response = $this->actingAs($admin)
            ->get('/api/users/pending');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Utilisateurs en attente récupérés avec succès.',
        ]);

        $data = $response->json('data');
        
        // Debug: Print the actual users returned
        $actualUserIds = collect($data)->pluck('id')->toArray();
        $expectedUserIds = [$pendingUser1->id, $pendingUser2->id];
        
        // Check that only pending users are returned
        $this->assertContains($pendingUser1->id, $actualUserIds);
        $this->assertContains($pendingUser2->id, $actualUserIds);
        $this->assertNotContains($authorizedUser->id, $actualUserIds);
        $this->assertNotContains($admin->id, $actualUserIds);
        
        // Should have exactly 2 pending users
        $this->assertCount(2, $data, "Expected 2 pending users, but got " . count($data) . ". Expected: " . implode(',', $expectedUserIds) . ", Actual: " . implode(',', $actualUserIds));
    }

    public function test_authorized_user_can_login()
    {
        // Create an authorized user
        $user = User::factory()->create([
            'admin_validated' => true,
            'email_verified_at' => now(),
        ]);

        // User can login successfully
        $response = $this->post('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Connexion réussie.',
        ]);
    }

    public function test_admin_users_are_automatically_validated()
    {
        // Create an admin user
        $admin = User::factory()->create([
            'is_admin' => true,
            'admin_validated' => false, // This should be overridden
        ]);

        // Admin should be able to login even with admin_validated = false
        $response = $this->post('/api/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Connexion réussie.',
        ]);
    }
}
