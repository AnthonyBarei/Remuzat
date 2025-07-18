<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Gate;

use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\AdminController;

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

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Public routes
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);
Route::get('/authenticated', [LoginController::class, 'authenticated']);

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
        Route::resource('/users', UserController::class);
        Route::post('/users/{user}/authorize', [UserController::class, 'authorizeUser']);
        Route::post('/users/{user}/resend-validation', [UserController::class, 'resendValidationEmail']);
        
        // Admin reservation routes
        Route::get('/admin/reservations', [BookingController::class, 'adminIndex']);
        Route::get('/admin/reservations/statistics', [BookingController::class, 'statistics']);
        Route::put('/admin/reservations/{booking}', [BookingController::class, 'adminUpdate']);
        Route::post('/admin/reservations/{booking}/approve', [BookingController::class, 'approve']);
        Route::post('/admin/reservations/{booking}/reject', [BookingController::class, 'reject']);
    });

    // Booking routes
    Route::resource('/reservations', BookingController::class);
});
