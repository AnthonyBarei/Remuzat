<?php

namespace App\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\User;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, User $model)
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, User $model)
    {
        // Admins can update any user, but super admins have additional privileges
        if (!$user->isAdmin()) {
            return false;
        }

        // Super admins can update anyone except themselves (to prevent self-demotion)
        if ($user->isSuperAdmin()) {
            return $user->id !== $model->id;
        }

        // Regular admins can update regular users and other admins, but not super admins
        return !$model->isSuperAdmin();
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, User $model)
    {
        // Only super admins can delete users
        if (!$user->isSuperAdmin()) {
            return false;
        }

        // Super admins cannot delete themselves
        return $user->id !== $model->id;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, User $model)
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, User $model)
    {
        // Only super admins can permanently delete users
        if (!$user->isSuperAdmin()) {
            return false;
        }

        // Super admins cannot delete themselves
        return $user->id !== $model->id;
    }

    /**
     * Determine if the user can manage user roles (super admin only).
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function manageUserRoles(User $user)
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine if the user can promote users to admin (super admin only).
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
     * Determine if the user can demote admins (super admin only).
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
     * Determine if the user can resend validation emails.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $targetUser
     * @return bool
     */
    public function resendValidationEmail(User $user, User $targetUser)
    {
        // Only admins can resend validation emails
        if (!$user->isAdmin()) {
            return false;
        }

        // Super admins can resend to anyone except themselves
        if ($user->isSuperAdmin()) {
            return $user->id !== $targetUser->id;
        }

        // Regular admins can resend to regular users and other admins, but not super admins
        return !$targetUser->isSuperAdmin();
    }
}
