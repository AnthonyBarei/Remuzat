<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Booking;
use Carbon\Carbon;

class AdminController extends BaseController
{
    /**
     * Get comprehensive dashboard statistics
     *
     * @return \Illuminate\Http\Response
     */
    public function dashboard()
    {
        if (Gate::denies('view-dashboard')) {
            return $this->sendError('Accès refusé. Privilèges administrateur requis.', [], 403);
        }

        try {
            // Get current month and previous month for comparison
            $currentMonth = Carbon::now();
            $previousMonth = Carbon::now()->subMonth();

            // ===== USER STATISTICS =====
            $totalUsers = User::count();
            $adminUsers = User::where('is_admin', true)->count();
            $newUsersThisMonth = User::whereMonth('created_at', $currentMonth->month)->count();
            $newUsersLastMonth = User::whereMonth('created_at', $previousMonth->month)->count();
            $userGrowth = $newUsersLastMonth > 0 ? (($newUsersThisMonth - $newUsersLastMonth) / $newUsersLastMonth) * 100 : 0;

            // Recent users (last 7 days)
            $recentUsers = User::where('created_at', '>=', Carbon::now()->subDays(7))
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get(['id', 'firstname', 'lastname', 'email', 'created_at']);

            // ===== BOOKING STATISTICS =====
            $totalReservations = Booking::count();
            $pendingReservations = Booking::where('status', 'pending')->count();
            $approvedReservations = Booking::where('status', 'approved')->count();
            $cancelledReservations = Booking::where('status', 'cancelled')->count();
            
            // Upcoming stays (next 30 days)
            $upcomingStays = Booking::where('start', '>=', Carbon::now())
                ->where('start', '<=', Carbon::now()->addDays(30))
                ->where('status', 'approved')
                ->count();

            // Calculate upcoming stays growth (current period vs previous period)
            $currentPeriodUpcoming = Booking::where('start', '>=', Carbon::now())
                ->where('start', '<=', Carbon::now()->addDays(30))
                ->where('status', 'approved')
                ->count();
            
            $previousPeriodUpcoming = Booking::where('start', '>=', Carbon::now()->subDays(30))
                ->where('start', '<=', Carbon::now())
                ->where('status', 'approved')
                ->count();
            
            $upcomingStaysGrowth = $previousPeriodUpcoming > 0 ? (($currentPeriodUpcoming - $previousPeriodUpcoming) / $previousPeriodUpcoming) * 100 : 0;

            // Recent bookings (last 7 days) - only include bookings with valid users
            $recentBookings = Booking::with('user:id,firstname,lastname,email')
                ->where('created_at', '>=', Carbon::now()->subDays(7))
                ->whereHas('user') // Only include bookings with existing users
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get(['id', 'added_by', 'start', 'end', 'status', 'created_at']);

            // ===== OCCUPANCY CALCULATIONS =====
            $totalDays = 30;
            $occupiedDays = Booking::where('start', '>=', Carbon::now()->subDays(30))
                ->where('end', '<=', Carbon::now())
                ->where('status', 'approved')
                ->sum(DB::raw('DATEDIFF(end, start) + 1'));
            
            $occupancyRate = $totalDays > 0 ? min(100, ($occupiedDays / $totalDays) * 100) : 0;

            // Calculate occupancy growth (current month vs previous month)
            $currentMonthOccupiedDays = Booking::where('start', '>=', Carbon::now()->startOfMonth())
                ->where('end', '<=', Carbon::now()->endOfMonth())
                ->where('status', 'approved')
                ->sum(DB::raw('DATEDIFF(end, start) + 1'));
            
            $previousMonthOccupiedDays = Booking::where('start', '>=', Carbon::now()->subMonth()->startOfMonth())
                ->where('end', '<=', Carbon::now()->subMonth()->endOfMonth())
                ->where('status', 'approved')
                ->sum(DB::raw('DATEDIFF(end, start) + 1'));
            
            $currentMonthDays = Carbon::now()->daysInMonth;
            $previousMonthDays = Carbon::now()->subMonth()->daysInMonth;
            
            $currentMonthRate = $currentMonthDays > 0 ? min(100, ($currentMonthOccupiedDays / $currentMonthDays) * 100) : 0;
            $previousMonthRate = $previousMonthDays > 0 ? min(100, ($previousMonthOccupiedDays / $previousMonthDays) * 100) : 0;
            
            $occupancyGrowth = $previousMonthRate > 0 ? (($currentMonthRate - $previousMonthRate) / $previousMonthRate) * 100 : 0;

            // ===== GROWTH CALCULATIONS =====
            $reservationsThisMonth = Booking::whereMonth('created_at', $currentMonth->month)->count();
            $reservationsLastMonth = Booking::whereMonth('created_at', $previousMonth->month)->count();
            $reservationGrowth = $reservationsLastMonth > 0 ? (($reservationsThisMonth - $reservationsLastMonth) / $reservationsLastMonth) * 100 : 0;

            // ===== CHART DATA =====
            // Monthly reservations for the last 6 months
            $monthlyReservations = [];
            for ($i = 5; $i >= 0; $i--) {
                $month = Carbon::now()->subMonths($i);
                $count = Booking::whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count();
                $monthlyReservations[] = [
                    'month' => $month->format('M Y'),
                    'count' => $count
                ];
            }

            // Daily reservations for the last 30 days
            $dailyReservations = [];
            for ($i = 29; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i);
                $count = Booking::whereDate('created_at', $date)->count();
                $dailyReservations[] = [
                    'date' => $date->format('d/m'),
                    'count' => $count
                ];
            }

            // ===== STATUS BREAKDOWN =====
            $statusBreakdown = [
                ['status' => 'En attente', 'count' => $pendingReservations, 'color' => '#FFA726'],
                ['status' => 'Approuvées', 'count' => $approvedReservations, 'color' => '#66BB6A'],
                ['status' => 'Annulées', 'count' => $cancelledReservations, 'color' => '#EF5350']
            ];

            // ===== REVENUE CALCULATIONS (if applicable) =====
            // This could be expanded if you add pricing to bookings
            $totalRevenue = 0; // Placeholder for future implementation

            $data = [
                'summary' => [
                    'users' => [
                        'total' => $totalUsers,
                        'admins' => $adminUsers,
                        'new_this_month' => $newUsersThisMonth,
                        'growth' => round($userGrowth, 1)
                    ],
                    'reservations' => [
                        'total' => $totalReservations,
                        'pending' => $pendingReservations,
                        'approved' => $approvedReservations,
                        'cancelled' => $cancelledReservations,
                        'upcoming' => $upcomingStays,
                        'upcoming_growth' => round($upcomingStaysGrowth, 1),
                        'growth' => round($reservationGrowth, 1)
                    ],
                    'occupancy' => [
                        'rate' => round($occupancyRate, 1),
                        'growth' => round($occupancyGrowth, 1)
                    ],
                    'revenue' => [
                        'total' => $totalRevenue,
                        'growth' => 0 // Mock growth for now
                    ]
                ],
                'charts' => [
                    'monthly_reservations' => $monthlyReservations,
                    'daily_reservations' => $dailyReservations,
                    'status_breakdown' => $statusBreakdown
                ],
                'recent_activity' => [
                    'users' => $recentUsers,
                    'bookings' => $recentBookings
                ],
                'quick_stats' => [
                    'avg_booking_duration' => $this->calculateAverageBookingDuration(),
                    'most_active_user' => $this->getMostActiveUser(),
                    'peak_booking_day' => $this->getPeakBookingDay(),
                    'cancellation_rate' => $this->calculateCancellationRate()
                ]
            ];

            return $this->sendResponse($data, 'Données du tableau de bord récupérées avec succès.');
        } catch (\Exception $e) {
            Log::error('Dashboard error: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->sendError('Erreur lors de la récupération des données du tableau de bord.', $e->getMessage());
        }
    }

    /**
     * Calculate average booking duration
     */
    private function calculateAverageBookingDuration()
    {
        $avgDuration = Booking::where('status', 'approved')
            ->whereNotNull('start')
            ->whereNotNull('end')
            ->selectRaw('AVG(DATEDIFF(end, start) + 1) as avg_days')
            ->first();

        return round($avgDuration->avg_days ?? 0, 1);
    }

    /**
     * Get most active user
     */
    private function getMostActiveUser()
    {
        $mostActive = Booking::select('added_by', DB::raw('COUNT(*) as booking_count'))
            ->with('user:id,firstname,lastname')
            ->whereHas('user') // Only include bookings with existing users
            ->groupBy('added_by')
            ->orderBy('booking_count', 'desc')
            ->first();

        if (!$mostActive || !$mostActive->user) {
            return null;
        }

        return [
            'name' => $mostActive->user->firstname . ' ' . $mostActive->user->lastname,
            'bookings' => $mostActive->booking_count
        ];
    }

    /**
     * Get peak booking day of the week
     */
    private function getPeakBookingDay()
    {
        $peakDay = Booking::selectRaw('DAYOFWEEK(created_at) as day_of_week, COUNT(*) as count')
            ->groupBy('day_of_week')
            ->orderBy('count', 'desc')
            ->first();

        if (!$peakDay) {
            return 'Aucune donnée';
        }

        $days = [
            1 => 'Dimanche',
            2 => 'Lundi', 
            3 => 'Mardi',
            4 => 'Mercredi',
            5 => 'Jeudi',
            6 => 'Vendredi',
            7 => 'Samedi'
        ];

        return $days[$peakDay->day_of_week] ?? 'Inconnu';
    }

    /**
     * Calculate cancellation rate
     */
    private function calculateCancellationRate()
    {
        $totalBookings = Booking::count();
        $cancelledBookings = Booking::where('status', 'cancelled')->count();

        if ($totalBookings === 0) {
            return 0;
        }

        return round(($cancelledBookings / $totalBookings) * 100, 1);
    }

    /**
     * Get detailed booking analytics
     */
    public function bookingAnalytics(Request $request)
    {
        if (Gate::denies('view-analytics')) {
            return $this->sendError('Accès refusé. Privilèges administrateur requis.', [], 403);
        }

        try {
            $period = $request->get('period', 'month'); // week, month, year
            $startDate = $request->get('start_date');
            $endDate = $request->get('end_date');

            $query = Booking::query();

            if ($startDate && $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            } else {
                switch ($period) {
                    case 'week':
                        $query->where('created_at', '>=', Carbon::now()->subWeek());
                        break;
                    case 'month':
                        $query->where('created_at', '>=', Carbon::now()->subMonth());
                        break;
                    case 'year':
                        $query->where('created_at', '>=', Carbon::now()->subYear());
                        break;
                }
            }

            $analytics = [
                'total_bookings' => $query->count(),
                'by_status' => $query->select('status', DB::raw('COUNT(*) as count'))
                    ->groupBy('status')
                    ->get(),
                'by_day' => $query->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get(),
                'by_user' => $query->select('user_id', DB::raw('COUNT(*) as count'))
                    ->with('user:id,firstname,lastname')
                    ->whereHas('user') // Only include bookings with existing users
                    ->groupBy('user_id')
                    ->orderBy('count', 'desc')
                    ->limit(10)
                    ->get()
            ];

            return $this->sendResponse($analytics, 'Analyses des réservations récupérées avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des analyses des réservations.', $e->getMessage());
        }
    }

    /**
     * Get user analytics
     */
    public function userAnalytics(Request $request)
    {
        if (Gate::denies('view-analytics')) {
            return $this->sendError('Accès refusé. Privilèges administrateur requis.', [], 403);
        }

        try {
            $period = $request->get('period', 'month');

            $query = User::query();

            switch ($period) {
                case 'week':
                    $query->where('created_at', '>=', Carbon::now()->subWeek());
                    break;
                case 'month':
                    $query->where('created_at', '>=', Carbon::now()->subMonth());
                    break;
                case 'year':
                    $query->where('created_at', '>=', Carbon::now()->subYear());
                    break;
            }

            $analytics = [
                'total_users' => User::count(),
                'new_users' => $query->count(),
                'by_day' => $query->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get(),
                'top_users' => User::withCount('bookings')
                    ->orderBy('bookings_count', 'desc')
                    ->limit(10)
                    ->get(['id', 'firstname', 'lastname', 'email', 'created_at'])
            ];

            return $this->sendResponse($analytics, 'Analyses des utilisateurs récupérées avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération des analyses des utilisateurs.', $e->getMessage());
        }
    }

    /**
     * Get system overview
     */
    public function systemOverview()
    {
        if (Gate::denies('view-system-overview')) {
            return $this->sendError('Accès refusé. Privilèges administrateur requis.', [], 403);
        }

        try {
            $overview = [
                'database' => [
                    'users_count' => User::count(),
                    'bookings_count' => Booking::count(),
                    'pending_bookings' => Booking::where('status', 'pending')->count(),
                    'system_health' => 'healthy'
                ],
                'performance' => [
                    'avg_response_time' => '120ms', // Mock data
                    'uptime' => '99.9%',
                    'last_backup' => Carbon::now()->subDay()->format('Y-m-d H:i:s')
                ],
                'recent_activity' => [
                    'last_user_registration' => User::latest()->first()?->created_at,
                    'last_booking' => Booking::latest()->first()?->created_at,
                    'active_sessions' => 5 // Mock data
                ]
            ];

            return $this->sendResponse($overview, 'Aperçu du système récupéré avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la récupération de l\'aperçu du système.', $e->getMessage());
        }
    }
} 