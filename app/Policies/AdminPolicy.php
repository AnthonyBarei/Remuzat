<?php

namespace App\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\User;
use App\Models\Booking;

class AdminPolicy
{
    use HandlesAuthorization;

    /**
     * Determine if the user can access admin dashboard.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function viewDashboard(User $user)
    {
        return $user->is_admin;
    }

    /**
     * Determine if the user can view analytics.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function viewAnalytics(User $user)
    {
        return $user->is_admin;
    }

    /**
     * Determine if the user can view system overview.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function viewSystemOverview(User $user)
    {
        return $user->is_admin;
    }

    /**
     * Determine if the user can manage users.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function manageUsers(User $user)
    {
        return $user->is_admin;
    }

    /**
     * Determine if the user can manage bookings.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function manageBookings(User $user)
    {
        return $user->is_admin;
    }

    /**
     * Determine if the user can access any admin functionality.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function accessAdmin(User $user)
    {
        return $user->is_admin;
    }

    /**
     * Determine whether the user can view any bookings.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->is_admin;
    }

    /**
     * Determine whether the user can view the booking.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Booking  $booking
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Booking $booking)
    {
        return $user->is_admin;
    }

    /**
     * Determine whether the user can create bookings.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->is_admin;
    }

    /**
     * Determine whether the user can update the booking.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Booking  $booking
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Booking $booking)
    {
        return $user->is_admin;
    }

    /**
     * Determine whether the user can delete the booking.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Booking  $booking
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Booking $booking)
    {
        return $user->is_admin;
    }
}
