<?php

namespace App\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\User;

class SuperAdminPolicy
{
    use HandlesAuthorization;

    /**
     * Determine if the user can access super admin dashboard.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function viewSuperAdminDashboard(User $user)
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine if the user can manage other admins.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function manageAdmins(User $user)
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine if the user can manage system settings.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function manageSystemSettings(User $user)
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine if the user can view advanced analytics.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function viewAdvancedAnalytics(User $user)
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine if the user can manage user roles.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function manageUserRoles(User $user)
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine if the user can access system logs.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function viewSystemLogs(User $user)
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine if the user can manage database backups.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function manageBackups(User $user)
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine if the user can access super admin functionality.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function accessSuperAdmin(User $user)
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine if the user can promote other users to admin.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $targetUser
     * @return bool
     */
    public function promoteToAdmin(User $user, User $targetUser)
    {
        return $user->isSuperAdmin() && $targetUser->id !== $user->id;
    }

    /**
     * Determine if the user can demote other admins.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $targetUser
     * @return bool
     */
    public function demoteAdmin(User $user, User $targetUser)
    {
        return $user->isSuperAdmin() && $targetUser->id !== $user->id;
    }

    /**
     * Determine if the user can delete any user.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $targetUser
     * @return bool
     */
    public function deleteAnyUser(User $user, User $targetUser)
    {
        return $user->isSuperAdmin() && $targetUser->id !== $user->id;
    }
}
