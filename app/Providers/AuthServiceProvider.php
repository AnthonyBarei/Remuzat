<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\User;
use App\Models\Booking;
use App\Policies\UserPolicy;
use App\Policies\AdminPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        User::class => UserPolicy::class,
        Booking::class => AdminPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // Register admin gates
        Gate::define('access-admin', [AdminPolicy::class, 'accessAdmin']);
        Gate::define('view-dashboard', [AdminPolicy::class, 'viewDashboard']);
        Gate::define('view-analytics', [AdminPolicy::class, 'viewAnalytics']);
        Gate::define('view-system-overview', [AdminPolicy::class, 'viewSystemOverview']);
        Gate::define('manage-users', [AdminPolicy::class, 'manageUsers']);
        Gate::define('manage-bookings', [AdminPolicy::class, 'manageBookings']);
    }
}
