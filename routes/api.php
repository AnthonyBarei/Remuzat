<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Gate;

use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\SuperAdminController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\EmailVerificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);
Route::get('/authenticated', [LoginController::class, 'authenticated']);

// Password reset routes
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
Route::post('/verify-reset-token', [PasswordResetController::class, 'verifyResetToken']);

// Email verification routes
Route::post('/email/verify', [EmailVerificationController::class, 'verify']);
Route::post('/email/resend', [EmailVerificationController::class, 'resend']);

// Protected routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/me', [LoginController::class, 'me']);
    
    // Admin routes with policy-based authorization
    Route::group(['middleware' => ['auth:sanctum', 'admin.policy']], function () {
        // Test route to verify authentication and admin access
        Route::get('/admin/test', function () {
            return response()->json([
                'success' => true,
                'message' => 'Admin test route working with policies',
                'user' => auth()->user(),
                'is_admin' => auth()->user()->is_admin,
                'role' => auth()->user()->role,
                'can_access_admin' => Gate::allows('access-admin'),
                'can_view_dashboard' => Gate::allows('view-dashboard'),
                'can_manage_users' => Gate::allows('manage-users')
            ]);
        });
        
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/admin/analytics/bookings', [AdminController::class, 'bookingAnalytics']);
        Route::get('/admin/analytics/users', [AdminController::class, 'userAnalytics']);
        Route::get('/admin/system/overview', [AdminController::class, 'systemOverview']);
        Route::get('/count/users', [UserController::class, 'count']);
        Route::get('/users/pending', [UserController::class, 'getPendingUsers']);
        Route::post('/users/{user}/authorize', [UserController::class, 'authorizeUser']);
        Route::post('/users/{user}/reject', [UserController::class, 'rejectUser']);
        Route::post('/users/{user}/resend-validation', [UserController::class, 'resendValidationEmail']);
        Route::resource('/users', UserController::class);
        
        // Admin reservation routes
        Route::get('/admin/reservations', [BookingController::class, 'adminIndex']);
        Route::get('/admin/reservations/statistics', [BookingController::class, 'statistics']);
        Route::put('/admin/reservations/{booking}', [BookingController::class, 'adminUpdate']);
        Route::post('/admin/reservations/{booking}/approve', [BookingController::class, 'approve']);
        Route::post('/admin/reservations/{booking}/reject', [BookingController::class, 'reject']);
        Route::delete('/admin/reservations/{booking}', [BookingController::class, 'adminDestroy']);
    });

    // Super Admin routes with super admin middleware
    Route::group(['middleware' => ['auth:sanctum', 'super.admin'], 'prefix' => 'super-admin'], function () {
        // Test route to verify super admin access
        Route::get('/test', function () {
            return response()->json([
                'success' => true,
                'message' => 'Super admin test route working',
                'user' => auth()->user(),
                'role' => auth()->user()->role,
                'is_super_admin' => auth()->user()->isSuperAdmin(),
                'can_access_super_admin' => Gate::allows('access-super-admin'),
                'can_manage_admins' => Gate::allows('manage-admins'),
                'can_manage_user_roles' => Gate::allows('manage-user-roles')
            ]);
        });

        // Super admin dashboard and analytics
        Route::get('/dashboard', [SuperAdminController::class, 'dashboard']);
        Route::get('/users', [SuperAdminController::class, 'getUsers']);
        Route::put('/users/{user}/role', [SuperAdminController::class, 'updateUserRole']);
        Route::post('/users/{user}/promote', [SuperAdminController::class, 'promoteToAdmin']);
        Route::post('/users/{user}/demote', [SuperAdminController::class, 'demoteAdmin']);
        Route::post('/users/{user}/resend-validation', [SuperAdminController::class, 'resendValidationEmail']);
        Route::get('/system/settings', [SuperAdminController::class, 'getSystemSettings']);
        Route::get('/system/logs', [SuperAdminController::class, 'getSystemLogs']);
    });

    // User routes
    Route::get('/reservations', [BookingController::class, 'index']);
    Route::post('/reservations', [BookingController::class, 'store']);
    Route::put('/reservations/{booking}', [BookingController::class, 'update']);
    Route::delete('/reservations/{booking}', [BookingController::class, 'destroy']);
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::delete('/user/profile', [UserController::class, 'deleteProfile']);
    
    // Email verification check (protected)
    Route::get('/email/check', [EmailVerificationController::class, 'check']);
});
