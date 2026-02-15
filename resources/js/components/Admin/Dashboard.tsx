import React, { useState, useEffect } from 'react';
import {
    Grid, Card, CardContent, Typography, Box, Paper, Chip, LinearProgress,
    CircularProgress, Alert, useTheme, useMediaQuery, Skeleton, Stack
} from '@mui/material';
import {
    BookOnlineOutlined, CancelOutlined, EventOutlined, PeopleOutlined,
    TrendingUp, TrendingDown, AccessTimeOutlined, CalendarTodayOutlined
} from '@mui/icons-material';
import { useAuth } from '../../context/hooks/useAuth';

interface DashboardData {
    summary: {
        users: { total: number; admins: number; new_this_month: number; growth: number; };
        reservations: { total: number; pending: number; approved: number; cancelled: number; upcoming: number; upcoming_growth: number; growth: number; };
        occupancy: { rate: number; growth: number; };
        revenue: { total: number; growth: number; };
    };
    charts: {
        monthly_reservations: Array<{ month: string; count: number }>;
        daily_reservations: Array<{ date: string; count: number }>;
        status_breakdown: Array<{ status: string; count: number; color: string }>;
    };
    recent_activity: { users: Array<any>; bookings: Array<any>; };
    quick_stats: { avg_booking_duration: number; most_active_user: any; peak_booking_day: string; cancellation_rate: number; };
}

const defaultDashboardData: DashboardData = {
    summary: {
        users: { total: 0, admins: 0, new_this_month: 0, growth: 0 },
        reservations: { total: 0, pending: 0, approved: 0, cancelled: 0, upcoming: 0, upcoming_growth: 0, growth: 0 },
        occupancy: { rate: 0, growth: 0 },
        revenue: { total: 0, growth: 0 }
    },
    charts: { monthly_reservations: [], daily_reservations: [], status_breakdown: [] },
    recent_activity: { users: [], bookings: [] },
    quick_stats: { avg_booking_duration: 0, most_active_user: null, peak_booking_day: '', cancellation_rate: 0 }
};

const StatCard = ({ title, value, icon, bgTint, iconColor, trend, subtitle }: any) => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Card elevation={0} sx={{
            bgcolor: '#fff', borderRadius: { xs: 2.5, sm: 3 },
            border: `1px solid ${theme.palette.divider}`,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(84,73,65,0.08)' },
            height: '100%',
        }}>
            <CardContent sx={{ p: { xs: 1.75, sm: 2.5 }, '&:last-child': { pb: { xs: 1.75, sm: 2.5 } } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 1, sm: 1.5 } }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.25, fontWeight: 500, fontSize: { xs: '0.68rem', sm: '0.78rem' } }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.35rem', sm: '1.75rem' } }}>
                            {value}
                        </Typography>
                    </Box>
                    <Box sx={{
                        p: { xs: 0.85, sm: 1.25 }, borderRadius: { xs: 2, sm: 2.5 }, bgcolor: bgTint, color: iconColor,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {icon}
                    </Box>
                </Box>
                {subtitle && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem', mb: 0.5 }}>
                        {subtitle}
                    </Typography>
                )}
                {trend !== undefined && trend !== null && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                        {trend >= 0 ? (
                            <TrendingUp sx={{ fontSize: { xs: 13, sm: 15 }, color: 'success.main' }} />
                        ) : (
                            <TrendingDown sx={{ fontSize: { xs: 13, sm: 15 }, color: 'error.main' }} />
                        )}
                        <Typography variant="body2" sx={{
                            color: trend >= 0 ? 'success.main' : 'error.main',
                            fontWeight: 600, fontSize: { xs: '0.68rem', sm: '0.75rem' },
                        }}>
                            {trend >= 0 ? '+' : ''}{trend}%
                        </Typography>
                        {!isXs && (
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                                vs mois dernier
                            </Typography>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

const QuickStatRow = ({ label, value, chipColor, chipBg }: any) => (
    <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        py: 1.25, borderBottom: '1px solid', borderColor: 'divider',
        '&:last-child': { borderBottom: 'none', pb: 0 }, '&:first-of-type': { pt: 0 },
    }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.82rem' }}>
            {label}
        </Typography>
        <Chip
            label={value}
            size="small"
            sx={{
                bgcolor: chipBg, color: chipColor, fontWeight: 600, fontSize: '0.72rem',
                height: 24, borderRadius: 1.5,
            }}
        />
    </Box>
);

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const token = (user as any).token;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [dashboardData, setDashboardData] = useState<DashboardData>(defaultDashboardData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (token) validateTokenAndFetchData();
    }, [token]);

    const validateTokenAndFetchData = async () => {
        try {
            const response = await fetch('/api/me', {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Token validation failed');
            fetchDashboardData();
        } catch (error) {
            // Token validation failed - silently ignore
        }
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/dashboard', {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error(`Erreur lors du chargement des données: ${response.status}`);
            const result = await response.json();
            setDashboardData(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box>
                <Skeleton variant="text" width={220} height={40} sx={{ mb: 1 }} />
                <Skeleton variant="text" width={300} height={20} sx={{ mb: 3 }} />
                <Grid container spacing={{ xs: 1.5, sm: 2.5 }}>
                    {[0, 1, 2, 3].map(i => (
                        <Grid item xs={6} sm={6} md={3} key={i}>
                            <Skeleton variant="rounded" height={{ xs: 110, sm: 140 }} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 3.5 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.4rem', sm: '1.75rem' } }}>
                    Tableau de bord
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Vue d'ensemble de l'activité de votre gîte
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Summary Cards */}
            <Grid container spacing={{ xs: 1.5, sm: 2.5 }} sx={{ mb: { xs: 2.5, sm: 3.5 } }}>
                <Grid item xs={6} sm={6} md={3}>
                    <StatCard
                        title="En attente"
                        value={dashboardData.summary.reservations.pending}
                        icon={<BookOnlineOutlined sx={{ fontSize: { xs: 18, sm: 22 } }} />}
                        bgTint={`${theme.palette.warning.main}14`}
                        iconColor={theme.palette.warning.dark}
                        trend={dashboardData.summary.reservations.growth}
                    />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <StatCard
                        title="Annulations"
                        value={dashboardData.summary.reservations.cancelled}
                        icon={<CancelOutlined sx={{ fontSize: { xs: 18, sm: 22 } }} />}
                        bgTint={`${theme.palette.error.main}14`}
                        iconColor={theme.palette.error.main}
                        trend={dashboardData.quick_stats.cancellation_rate}
                    />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <StatCard
                        title="Séjours à venir"
                        value={dashboardData.summary.reservations.upcoming}
                        icon={<EventOutlined sx={{ fontSize: { xs: 18, sm: 22 } }} />}
                        bgTint={`${theme.palette.success.main}14`}
                        iconColor={theme.palette.success.main}
                        trend={dashboardData.summary.reservations.upcoming_growth}
                    />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <StatCard
                        title="Nv. utilisateurs"
                        value={dashboardData.summary.users.new_this_month}
                        icon={<PeopleOutlined sx={{ fontSize: { xs: 18, sm: 22 } }} />}
                        bgTint={`${theme.palette.primary.main}14`}
                        iconColor={theme.palette.primary.dark}
                        trend={dashboardData.summary.users.growth}
                    />
                </Grid>
            </Grid>

            {/* Bottom panels */}
            <Grid container spacing={2.5}>
                {/* Occupancy rate */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{
                        bgcolor: '#fff', borderRadius: 3, p: { xs: 2.5, sm: 3 },
                        border: `1px solid ${theme.palette.divider}`,
                        height: '100%',
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                            <Box sx={{
                                p: 0.75, borderRadius: 1.5,
                                bgcolor: `${theme.palette.success.main}14`,
                                color: theme.palette.success.main,
                                display: 'flex',
                            }}>
                                <CalendarTodayOutlined sx={{ fontSize: 18 }} />
                            </Box>
                            <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.95rem' }}>
                                Taux d'occupation
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 2 }}>
                            <Typography sx={{ fontWeight: 700, color: theme.palette.success.main, fontSize: '2.5rem', lineHeight: 1 }}>
                                {dashboardData.summary.occupancy.rate}%
                            </Typography>
                            <Chip
                                label={`${dashboardData.summary.occupancy.growth >= 0 ? '+' : ''}${dashboardData.summary.occupancy.growth}%`}
                                size="small"
                                sx={{
                                    bgcolor: `${theme.palette.success.main}14`,
                                    color: theme.palette.success.main,
                                    fontWeight: 600, fontSize: '0.72rem', height: 22,
                                }}
                            />
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={dashboardData.summary.occupancy.rate}
                            sx={{
                                height: 8, borderRadius: 4,
                                bgcolor: `${theme.palette.success.main}12`,
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: theme.palette.success.main, borderRadius: 4,
                                }
                            }}
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5, fontSize: '0.75rem' }}>
                            Moyenne sur les 30 derniers jours
                        </Typography>
                    </Paper>
                </Grid>

                {/* Quick stats */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{
                        bgcolor: '#fff', borderRadius: 3, p: { xs: 2.5, sm: 3 },
                        border: `1px solid ${theme.palette.divider}`,
                        height: '100%',
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                            <Box sx={{
                                p: 0.75, borderRadius: 1.5,
                                bgcolor: `${theme.palette.primary.main}14`,
                                color: theme.palette.primary.dark,
                                display: 'flex',
                            }}>
                                <AccessTimeOutlined sx={{ fontSize: 18 }} />
                            </Box>
                            <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.95rem' }}>
                                Statistiques rapides
                            </Typography>
                        </Box>
                        <Stack>
                            <QuickStatRow
                                label="Total réservations"
                                value={dashboardData.summary.reservations.total}
                                chipBg={`${theme.palette.primary.main}14`}
                                chipColor={theme.palette.primary.dark}
                            />
                            <QuickStatRow
                                label="Croissance mensuelle"
                                value={`${dashboardData.summary.reservations.growth >= 0 ? '+' : ''}${dashboardData.summary.reservations.growth}%`}
                                chipBg={`${theme.palette.success.main}14`}
                                chipColor={theme.palette.success.main}
                            />
                            <QuickStatRow
                                label="Taux d'annulation"
                                value={`${dashboardData.quick_stats.cancellation_rate}%`}
                                chipBg={`${theme.palette.error.main}14`}
                                chipColor={theme.palette.error.main}
                            />
                            <QuickStatRow
                                label="Durée moyenne"
                                value={`${dashboardData.quick_stats.avg_booking_duration} jours`}
                                chipBg={`${theme.palette.info.main}14`}
                                chipColor={theme.palette.info.dark}
                            />
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
