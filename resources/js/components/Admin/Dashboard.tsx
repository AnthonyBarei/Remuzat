import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Paper,
    Chip,
    LinearProgress,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    BookOnline,
    Cancel,
    Event,
    People,
    TrendingUp,
    TrendingDown
} from '@mui/icons-material';
import { useAuth } from '../../context/hooks/useAuth';

const colors = {
    beigeStone: '#F5F0EB',
    softLavender: '#B9A5C4',
    provencalBlueGrey: '#6D7885',
    lightOliveGreen: '#A6B29F',
    paleTerracotta: '#D8A47F',
    softSunYellow: '#F4C95D',
    discreetPoppyRed: '#D96C57',
    chestnutBrown: '#4A3F35',
};

interface DashboardData {
    summary: {
        users: {
            total: number;
            admins: number;
            new_this_month: number;
            growth: number;
        };
        reservations: {
            total: number;
            pending: number;
            approved: number;
            cancelled: number;
            upcoming: number;
            upcoming_growth: number;
            growth: number;
        };
        occupancy: {
            rate: number;
            growth: number;
        };
        revenue: {
            total: number;
            growth: number;
        };
    };
    charts: {
        monthly_reservations: Array<{month: string; count: number}>;
        daily_reservations: Array<{date: string; count: number}>;
        status_breakdown: Array<{status: string; count: number; color: string}>;
    };
    recent_activity: {
        users: Array<any>;
        bookings: Array<any>;
    };
    quick_stats: {
        avg_booking_duration: number;
        most_active_user: any;
        peak_booking_day: string;
        cancellation_rate: number;
    };
}

// Default data
const defaultDashboardData: DashboardData = {
    summary: {
        users: { total: 0, admins: 0, new_this_month: 0, growth: 0 },
        reservations: { total: 0, pending: 0, approved: 0, cancelled: 0, upcoming: 0, upcoming_growth: 0, growth: 0 },
        occupancy: { rate: 0, growth: 0 },
        revenue: { total: 0, growth: 0 }
    },
    charts: {
        monthly_reservations: [],
        daily_reservations: [],
        status_breakdown: []
    },
    recent_activity: {
        users: [],
        bookings: []
    },
    quick_stats: {
        avg_booking_duration: 0,
        most_active_user: null,
        peak_booking_day: '',
        cancellation_rate: 0
    }
};

const StatCard = ({ title, value, icon, color, trend, subtitle }: any) => (
    <Card sx={{
        bgcolor: 'white',
        borderRadius: 3,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: `1px solid ${colors.softLavender}20`,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }
    }}>
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Typography variant="body2" sx={{ color: colors.provencalBlueGrey, mb: 1, fontWeight: 500 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ 
                        fontWeight: 700, 
                        color: colors.chestnutBrown,
                        mb: 1
                    }}>
                        {value}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body2" sx={{ color: colors.provencalBlueGrey }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <Box sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: color + '20',
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icon}
                </Box>
            </Box>
            {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {trend > 0 ? (
                        <TrendingUp sx={{ fontSize: 16, color: colors.lightOliveGreen }} />
                    ) : (
                        <TrendingDown sx={{ fontSize: 16, color: colors.discreetPoppyRed }} />
                    )}
                    <Typography variant="body2" sx={{ 
                        color: trend > 0 ? colors.lightOliveGreen : colors.discreetPoppyRed,
                        fontWeight: 600
                    }}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.provencalBlueGrey }}>
                        vs mois dernier
                    </Typography>
                </Box>
            )}
        </CardContent>
    </Card>
);

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const token = (user as any).token;
    const [dashboardData, setDashboardData] = useState<DashboardData>(defaultDashboardData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            validateTokenAndFetchData();
        }
    }, [token]);

    const validateTokenAndFetchData = async () => {
        try {
            // First validate the token
            const response = await fetch('/api/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                // Token is invalid, this will trigger the auth interceptor
                throw new Error('Token validation failed');
            }

            // Token is valid, proceed with data fetching
            fetchDashboardData();
        } catch (error) {
            console.log('Token validation failed:', error);
            // The auth interceptor will handle the logout
        }
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            console.log('Token:', token); // Debug token
            
            const response = await fetch('/api/admin/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log('Response status:', response.status); // Debug response
            
            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error response:', errorText); // Debug error
                throw new Error(`Erreur lors du chargement des données: ${response.status}`);
            }

            const result = await response.json();
            const data = result.data;
            
            setDashboardData(data);
        } catch (err) {
            console.log('Fetch error:', err); // Debug error
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ 
                fontWeight: 700, 
                color: colors.chestnutBrown,
                mb: 4
            }}>
                Tableau de bord
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Réservations en attente"
                        value={dashboardData.summary.reservations.pending}
                        icon={<BookOnline />}
                        color={colors.softSunYellow}
                        trend={dashboardData.summary.reservations.growth}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Annulations"
                        value={dashboardData.summary.reservations.cancelled}
                        icon={<Cancel />}
                        color={colors.discreetPoppyRed}
                        trend={dashboardData.quick_stats.cancellation_rate}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Séjours à venir"
                        value={dashboardData.summary.reservations.upcoming}
                        icon={<Event />}
                        color={colors.lightOliveGreen}
                        trend={dashboardData.summary.reservations.upcoming_growth}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Nouveaux utilisateurs"
                        value={dashboardData.summary.users.new_this_month}
                        icon={<People />}
                        color={colors.softLavender}
                        trend={dashboardData.summary.users.growth}
                    />
                </Grid>
            </Grid>

            {/* Additional Stats */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{
                        bgcolor: 'white',
                        borderRadius: 3,
                        p: 3,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        border: `1px solid ${colors.softLavender}20`,
                    }}>
                        <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            color: colors.chestnutBrown,
                            mb: 2
                        }}>
                            Taux d'occupation
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Typography variant="h3" sx={{ 
                                fontWeight: 700, 
                                color: colors.lightOliveGreen
                            }}>
                                {dashboardData.summary.occupancy.rate}%
                            </Typography>
                            <Chip 
                                label={`+${dashboardData.summary.occupancy.growth}%`} 
                                size="small" 
                                sx={{ 
                                    bgcolor: colors.lightOliveGreen + '20',
                                    color: colors.lightOliveGreen,
                                    fontWeight: 600
                                }}
                            />
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={dashboardData.summary.occupancy.rate} 
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: colors.beigeStone,
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: colors.lightOliveGreen,
                                    borderRadius: 4,
                                }
                            }}
                        />
                        <Typography variant="body2" sx={{ 
                            color: colors.provencalBlueGrey,
                            mt: 1
                        }}>
                            Moyenne sur les 30 derniers jours
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{
                        bgcolor: 'white',
                        borderRadius: 3,
                        p: 3,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        border: `1px solid ${colors.softLavender}20`,
                    }}>
                        <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            color: colors.chestnutBrown,
                            mb: 2
                        }}>
                            Statistiques rapides
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ color: colors.provencalBlueGrey }}>
                                    Total réservations
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: colors.chestnutBrown }}>
                                    {dashboardData.summary.reservations.total}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ color: colors.provencalBlueGrey }}>
                                    Croissance mensuelle
                                </Typography>
                                <Chip 
                                    label={`+${dashboardData.summary.reservations.growth}%`} 
                                    size="small" 
                                    sx={{ 
                                        bgcolor: colors.lightOliveGreen + '20',
                                        color: colors.lightOliveGreen,
                                        fontWeight: 600
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ color: colors.provencalBlueGrey }}>
                                    Taux d'annulation
                                </Typography>
                                <Chip 
                                    label={`${dashboardData.quick_stats.cancellation_rate}%`} 
                                    size="small" 
                                    sx={{ 
                                        bgcolor: colors.discreetPoppyRed + '20',
                                        color: colors.discreetPoppyRed,
                                        fontWeight: 600
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ color: colors.provencalBlueGrey }}>
                                    Durée moyenne
                                </Typography>
                                <Chip 
                                    label={`${dashboardData.quick_stats.avg_booking_duration} jours`} 
                                    size="small" 
                                    sx={{ 
                                        bgcolor: colors.softLavender + '20',
                                        color: colors.softLavender,
                                        fontWeight: 600
                                    }}
                                />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard; 