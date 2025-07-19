<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Booking;
use Carbon\Carbon;

class SuperAdminController extends BaseController
{
    /**
     * Get super admin dashboard with advanced statistics
     *
     * @return \Illuminate\Http\Response
     */
    public function dashboard()
    {
        if (Gate::denies('view-super-admin-dashboard')) {
            return $this->sendError('Accès refusé. Privilèges super administrateur requis.', [], 403);
        }

        try {
            // Get comprehensive statistics
            $totalUsers = User::count();
            $adminUsers = User::where('role', 'admin')->count();
            $superAdminUsers = User::where('role', 'super_admin')->count();
            $regularUsers = User::where('role', 'user')->count();

            // Role distribution
            $roleDistribution = [
                ['role' => 'Utilisateurs', 'count' => $regularUsers, 'color' => '#2196F3'],
                ['role' => 'Administrateurs', 'count' => $adminUsers, 'color' => '#FF9800'],
                ['role' => 'Super Admins', 'count' => $superAdminUsers, 'color' => '#F44336']
            ];

            // System health metrics
            $systemHealth = [
                'database_size' => $this->getDatabaseSize(),
                'last_backup' => $this->getLastBackupDate(),
                'system_uptime' => $this->getSystemUptime(),
                'active_sessions' => $this->getActiveSessions(),
                'pending_tasks' => $this->getPendingTasks()
            ];

            // Advanced analytics
            $advancedAnalytics = [
                'user_growth_rate' => $this->calculateUserGrowthRate(),
                'admin_activity' => $this->getAdminActivity(),
                'system_performance' => $this->getSystemPerformance(),
                'security_metrics' => $this->getSecurityMetrics()
            ];

            $data = [
                'summary' => [
                    'total_users' => $totalUsers,
                    'admin_users' => $adminUsers,
                    'super_admin_users' => $superAdminUsers,
                    'regular_users' => $regularUsers
                ],
                'role_distribution' => $roleDistribution,
                'system_health' => $systemHealth,
                'advanced_analytics' => $advancedAnalytics
            ];

            return $this->sendResponse($data, 'Données du tableau de bord super administrateur récupérées avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des données du tableau de bord super administrateur.', $e->getMessage());
        }
    }

    /**
     * Get all users with role management capabilities
     *
     * @return \Illuminate\Http\Response
     */
    public function getUsers()
    {
        if (Gate::denies('manage-admins')) {
            return $this->sendError('Accès refusé. Privilèges super administrateur requis.', [], 403);
        }

        try {
            $users = User::with('bookings')
                ->select(['id', 'firstname', 'lastname', 'email', 'role', 'is_admin', 'email_verified_at', 'created_at'])
                ->orderBy('created_at', 'desc')
                ->get();

            return $this->sendResponse($users, 'Utilisateurs récupérés avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des utilisateurs.', $e->getMessage());
        }
    }

    /**
     * Update user role
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function updateUserRole(Request $request, User $user)
    {
        if (Gate::denies('manage-user-roles')) {
            return $this->sendError('Accès refusé. Privilèges super administrateur requis.', [], 403);
        }

        try {
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'role' => 'required|in:user,admin,super_admin',
            ]);

            if ($validator->fails()) {
                return $this->sendError('Erreur de validation.', $validator->errors());
            }

            // Prevent self-demotion
            if ($user->id === auth()->id()) {
                return $this->sendError('Vous ne pouvez pas changer votre propre rôle.', [], 403);
            }

            $oldRole = $user->role;
            $newRole = $request->input('role');

            // Update role and is_admin field
            $user->role = $newRole;
            $user->is_admin = in_array($newRole, ['admin', 'super_admin']);
            $user->save();

            $roleNames = [
                'user' => 'Utilisateur',
                'admin' => 'Administrateur',
                'super_admin' => 'Super Administrateur'
            ];

            $message = "Rôle de {$user->firstname} {$user->lastname} changé de {$roleNames[$oldRole]} à {$roleNames[$newRole]}.";

            return $this->sendResponse([
                'user' => $user,
                'old_role' => $oldRole,
                'new_role' => $newRole
            ], $message);
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la mise à jour du rôle utilisateur.', $e->getMessage());
        }
    }

    /**
     * Promote user to admin
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function promoteToAdmin(User $user)
    {
        if (Gate::denies('promote-to-admin', $user)) {
            return $this->sendError('Accès refusé. Privilèges super administrateur requis.', [], 403);
        }

        try {
            $user->role = 'admin';
            $user->is_admin = true;
            $user->save();

            $message = "{$user->firstname} {$user->lastname} promu au rang d'administrateur.";

            return $this->sendResponse($user, $message);
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la promotion de l\'utilisateur au rang d\'administrateur.', $e->getMessage());
        }
    }

    /**
     * Demote admin to user
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function demoteAdmin(User $user)
    {
        if (Gate::denies('demote-admin', $user)) {
            return $this->sendError('Accès refusé. Privilèges super administrateur requis.', [], 403);
        }

        try {
            $user->role = 'user';
            $user->is_admin = false;
            $user->save();

            $message = "{$user->firstname} {$user->lastname} rétrogradé au rang d'utilisateur.";

            return $this->sendResponse($user, $message);
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la rétrogradation de l\'administrateur.', $e->getMessage());
        }
    }

    /**
     * Get system settings
     *
     * @return \Illuminate\Http\Response
     */
    public function getSystemSettings()
    {
        if (Gate::denies('manage-system-settings')) {
            return $this->sendError('Accès refusé. Privilèges super administrateur requis.', [], 403);
        }

        try {
            $settings = [
                'app_name' => config('app.name'),
                'app_env' => config('app.env'),
                'app_debug' => config('app.debug'),
                'database_connection' => config('database.default'),
                'mail_driver' => config('mail.default'),
                'cache_driver' => config('cache.default'),
                'session_driver' => config('session.driver'),
                'queue_driver' => config('queue.default'),
            ];

            return $this->sendResponse($settings, 'Paramètres système récupérés avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des paramètres système.', $e->getMessage());
        }
    }

    /**
     * Get system logs
     *
     * @return \Illuminate\Http\Response
     */
    public function getSystemLogs()
    {
        if (Gate::denies('view-system-logs')) {
            return $this->sendError('Accès refusé. Privilèges super administrateur requis.', [], 403);
        }

        try {
            // This is a simplified version. In a real application, you'd want to implement proper log reading
            $logs = [
                'error_logs' => 'Logs d\'erreurs (non implémenté)',
                'access_logs' => 'Logs d\'accès (non implémenté)',
                'security_logs' => 'Logs de sécurité (non implémenté)'
            ];

            return $this->sendResponse($logs, 'Logs système récupérés avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des logs système.', $e->getMessage());
        }
    }

    // Helper methods for dashboard statistics
    private function getDatabaseSize()
    {
        // Mock implementation
        return '2.5 MB';
    }

    private function getLastBackupDate()
    {
        // Mock implementation
        return Carbon::now()->subDay()->format('Y-m-d H:i:s');
    }

    private function getSystemUptime()
    {
        // Mock implementation
        return '99.9%';
    }

    private function getActiveSessions()
    {
        // Mock implementation
        return 15;
    }

    private function getPendingTasks()
    {
        // Mock implementation
        return 3;
    }

    private function calculateUserGrowthRate()
    {
        $currentMonth = User::whereMonth('created_at', Carbon::now()->month)->count();
        $lastMonth = User::whereMonth('created_at', Carbon::now()->subMonth()->month)->count();
        
        if ($lastMonth === 0) {
            return $currentMonth > 0 ? 100 : 0;
        }
        
        return round((($currentMonth - $lastMonth) / $lastMonth) * 100, 1);
    }

    private function getAdminActivity()
    {
        // Mock implementation
        return [
            'recent_admin_actions' => 25,
            'admin_login_frequency' => 'High',
            'most_active_admin' => 'Admin User'
        ];
    }

    private function getSystemPerformance()
    {
        // Mock implementation
        return [
            'avg_response_time' => '120ms',
            'memory_usage' => '45%',
            'cpu_usage' => '30%'
        ];
    }

    private function getSecurityMetrics()
    {
        // Mock implementation
        return [
            'failed_login_attempts' => 5,
            'suspicious_activities' => 0,
            'security_score' => 'A+'
        ];
    }
}
