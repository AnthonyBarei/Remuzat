import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, TextField, FormControl, InputLabel, Select, MenuItem,
    Button, Chip, IconButton, Stack, Grid, Card, CardContent, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TablePagination, Menu,
    ListItemIcon, ListItemText, Alert, CircularProgress, Dialog, DialogTitle,
    DialogContent, DialogActions, useTheme, useMediaQuery, Skeleton, Avatar,
    Collapse, Fab, Pagination
} from '@mui/material';
import {
    CheckCircleOutlined, CancelOutlined, EditOutlined, EmailOutlined,
    RefreshOutlined, MoreVert, DeleteOutlined, SearchOutlined,
    FilterListOutlined, BookOnlineOutlined, ExpandMore, ExpandLess,
    EventOutlined
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import { useAuth } from '../../context/hooks/useAuth';

interface User {
    id: number; firstname: string; lastname: string; email: string;
}

interface Reservation {
    id: number; start: string; end: string; duration: number; type: string;
    status: string; created_at: string; user: User | null; validated_by?: User | null;
    has_overlap?: boolean;
}

interface Statistics { pending: number; approved: number; cancelled: number; total: number; }

interface EditFormData { start_date: string; end_date: string; type: string; status: string; }

const getStatusConfig = (status: string, theme: any) => {
    switch (status) {
        case 'pending': return { label: 'En attente', bg: `${theme.palette.warning.main}14`, color: theme.palette.warning.dark, border: `${theme.palette.warning.main}40` };
        case 'approved': return { label: 'Approuvée', bg: `${theme.palette.success.main}14`, color: theme.palette.success.main, border: `${theme.palette.success.main}40` };
        case 'cancelled': return { label: 'Annulée', bg: `${theme.palette.error.main}14`, color: theme.palette.error.main, border: `${theme.palette.error.main}40` };
        default: return { label: status, bg: `${theme.palette.grey[500]}14`, color: theme.palette.text.secondary, border: `${theme.palette.grey[400]}` };
    }
};

const MiniStatCard = ({ value, label, color, bgTint }: any) => {
    const theme = useTheme();
    return (
        <Card elevation={0} sx={{
            bgcolor: '#fff', borderRadius: 2.5,
            border: `1px solid ${theme.palette.divider}`,
            transition: 'transform 0.15s ease',
            '&:hover': { transform: 'translateY(-1px)' },
        }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 700, color, fontSize: '1.5rem', lineHeight: 1.2, mb: 0.25 }}>
                    {value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.72rem', fontWeight: 500 }}>
                    {label}
                </Typography>
            </CardContent>
        </Card>
    );
};

const Reservations: React.FC = () => {
    const { user, authed, loading: authLoading } = useAuth();
    const token = (user as any)?.token || localStorage.getItem('token') || sessionStorage.getItem('token');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [statistics, setStatistics] = useState<Statistics>({ pending: 0, approved: 0, cancelled: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [filters, setFilters] = useState({ status: '', search: '', startDate: null, endDate: null, showOverlaps: false });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [menuReservation, setMenuReservation] = useState<Reservation | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<EditFormData>({ start_date: '', end_date: '', type: 'booking', status: '' });

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.search) params.append('search', filters.search);
            if (filters.startDate) params.append('start_date', moment(filters.startDate).format('YYYY-MM-DD'));
            if (filters.endDate) params.append('end_date', moment(filters.endDate).format('YYYY-MM-DD'));
            if (filters.showOverlaps) params.append('show_overlaps', 'true');
            params.append('per_page', rowsPerPage.toString());
            params.append('page', (page + 1).toString());

            const response = await fetch(`/api/admin/reservations?${params}`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Erreur lors du chargement des réservations');
            const result = await response.json();
            setReservations(result.data.data);
            setTotalCount(result.data.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await fetch('/api/admin/reservations/statistics', {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                const result = await response.json();
                setStatistics(result.data);
            }
        } catch (err) { /* Failed to fetch statistics */ }
    };

    useEffect(() => {
        if (authed && !authLoading && token) validateTokenAndFetchData();
    }, [page, rowsPerPage, filters, authed, authLoading, token]);

    const validateTokenAndFetchData = async () => {
        try {
            const response = await fetch('/api/me', {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Token validation failed');
            fetchReservations();
            fetchStatistics();
        } catch (error) { /* Token validation failed */ }
    };

    const handleValidate = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/reservations/${id}/approve`, {
                method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Erreur lors de la validation');
            const result = await response.json();
            setSuccess(result.message || 'Réservation validée avec succès');
            fetchReservations(); fetchStatistics();
        } catch (err) { setError(err instanceof Error ? err.message : 'Une erreur est survenue'); }
    };

    const handleCancel = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/reservations/${id}/reject`, {
                method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error("Erreur lors de l'annulation");
            const result = await response.json();
            setSuccess(result.message || 'Réservation annulée avec succès');
            fetchReservations(); fetchStatistics();
        } catch (err) { setError(err instanceof Error ? err.message : 'Une erreur est survenue'); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cette réservation ? Cette action est irréversible.')) return;
        try {
            const response = await fetch(`/api/admin/reservations/${id}`, {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Erreur lors de la suppression');
            const result = await response.json();
            setSuccess(result.message || 'Réservation supprimée avec succès');
            fetchReservations(); fetchStatistics();
        } catch (err) { setError(err instanceof Error ? err.message : 'Une erreur est survenue'); }
    };

    const handleResendEmail = (id: number) => {
        setSuccess('Email renvoyé avec succès');
    };

    const handleEdit = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setEditFormData({
            start_date: moment(reservation.start).format('YYYY-MM-DD'),
            end_date: moment(reservation.end).format('YYYY-MM-DD'),
            type: reservation.type, status: reservation.status
        });
        setEditDialogOpen(true);
    };

    const handleEditSubmit = async () => {
        if (!menuReservation) return;
        try {
            const response = await fetch(`/api/admin/reservations/${menuReservation.id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(editFormData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la modification');
            }
            const result = await response.json();
            setSuccess(result.data?.overlap_warning ? `⚠️ ${result.data.message}` : (result.message || 'Réservation modifiée avec succès'));
            setEditDialogOpen(false); fetchReservations(); fetchStatistics();
        } catch (err) { setError(err instanceof Error ? err.message : 'Une erreur est survenue'); }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, reservation: Reservation) => {
        setAnchorEl(event.currentTarget);
        setSelectedReservation(reservation);
        setMenuReservation(reservation);
    };

    const handleMenuClose = () => { setAnchorEl(null); setSelectedReservation(null); };

    const [filtersOpen, setFiltersOpen] = useState(!isMobile);

    const handleResetFilters = () => {
        setFilters({ status: '', search: '', startDate: null, endDate: null, showOverlaps: false });
        setPage(0);
    };

    // Keep filters collapsed on mobile by default
    useEffect(() => {
        setFiltersOpen(!isMobile);
    }, [isMobile]);

    if (authLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress sx={{ color: theme.palette.primary.main }} />
            </Box>
        );
    }

    if (!authed || !token) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>Erreur d'authentification</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.4rem', sm: '1.75rem' } }}>
                    Réservations
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Gérez toutes les réservations du gîte
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setError(null)}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2.5 }} onClose={() => setSuccess(null)}>{success}</Alert>}

            {/* Filters */}
            <Paper elevation={0} sx={{
                bgcolor: '#fff', borderRadius: 3, mb: 2.5,
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden',
            }}>
                <Box
                    onClick={() => isMobile && setFiltersOpen(!filtersOpen)}
                    sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: 1, px: { xs: 2, sm: 2.5 }, pt: { xs: 1.5, sm: 2.5 }, pb: filtersOpen ? 0 : { xs: 1.5, sm: 2.5 },
                        cursor: isMobile ? 'pointer' : 'default',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FilterListOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.9rem' }}>
                            Filtres
                        </Typography>
                        {isMobile && !filtersOpen && (filters.status || filters.search || filters.startDate || filters.endDate || filters.showOverlaps) && (
                            <Chip label="Actifs" size="small" sx={{
                                height: 20, fontSize: '0.65rem', fontWeight: 600,
                                bgcolor: `${theme.palette.primary.main}14`, color: theme.palette.primary.dark,
                            }} />
                        )}
                    </Box>
                    {isMobile && (
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                            {filtersOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                        </IconButton>
                    )}
                </Box>
                <Collapse in={filtersOpen}>
                    <Box sx={{ px: { xs: 2, sm: 2.5 }, pb: { xs: 2, sm: 2.5 }, pt: { xs: 1.5, sm: 2 } }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField fullWidth size="small" label="Rechercher" placeholder="Nom ou email..."
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                    InputProps={{ startAdornment: <SearchOutlined sx={{ color: 'text.secondary', mr: 0.5, fontSize: 18 }} /> }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={6} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Statut</InputLabel>
                                    <Select value={filters.status} label="Statut"
                                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}>
                                        <MenuItem value="">Tous</MenuItem>
                                        <MenuItem value="pending">En attente</MenuItem>
                                        <MenuItem value="approved">Approuvées</MenuItem>
                                        <MenuItem value="cancelled">Annulées</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={6} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Spécial</InputLabel>
                                    <Select value={filters.showOverlaps ? 'overlaps' : ''} label="Spécial"
                                        onChange={(e) => setFilters(prev => ({ ...prev, showOverlaps: e.target.value === 'overlaps' }))}>
                                        <MenuItem value="">Tous</MenuItem>
                                        <MenuItem value="overlaps">Chevauchements</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={6} md={2}>
                                <DatePicker label="Date début" value={filters.startDate}
                                    onChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
                                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={6} md={2}>
                                <DatePicker label="Date fin" value={filters.endDate}
                                    onChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
                                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={1}>
                                <Button fullWidth variant="outlined" size="small" startIcon={<RefreshOutlined sx={{ fontSize: 16 }} />}
                                    onClick={handleResetFilters}
                                    sx={{
                                        borderColor: theme.palette.divider, color: 'text.secondary',
                                        textTransform: 'none', fontWeight: 500, py: 0.9,
                                        '&:hover': { borderColor: theme.palette.primary.main, color: theme.palette.primary.dark, bgcolor: `${theme.palette.primary.main}08` }
                                    }}>
                                    Réinitialiser
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Collapse>
            </Paper>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 2.5 }}>
                <Grid item xs={6} sm={3}>
                    <MiniStatCard value={statistics.pending} label="En attente" color={theme.palette.warning.dark} />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <MiniStatCard value={statistics.approved} label="Approuvées" color={theme.palette.success.main} />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <MiniStatCard value={statistics.cancelled} label="Annulées" color={theme.palette.error.main} />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <MiniStatCard value={statistics.total} label="Total" color={theme.palette.text.primary} />
                </Grid>
            </Grid>

            {/* Table (desktop) / Cards (mobile) */}
            {loading && (
                <Box sx={{ px: 1 }}>
                    {isMobile ? (
                        <Stack spacing={1.5}>
                            {[0, 1, 2].map(i => <Skeleton key={i} variant="rounded" height={120} sx={{ borderRadius: 3 }} />)}
                        </Stack>
                    ) : (
                        <Paper elevation={0} sx={{ bgcolor: '#fff', borderRadius: 3, border: `1px solid ${theme.palette.divider}`, p: 3 }}>
                            <Skeleton variant="rounded" height={300} />
                        </Paper>
                    )}
                </Box>
            )}

            {!loading && isMobile && (
                /* ===== MOBILE CARD VIEW ===== */
                <Box>
                    {reservations.length === 0 ? (
                        <Paper elevation={0} sx={{
                            bgcolor: '#fff', borderRadius: 3, p: 4, textAlign: 'center',
                            border: `1px solid ${theme.palette.divider}`,
                        }}>
                            <BookOnlineOutlined sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                            <Typography sx={{ color: 'text.secondary' }}>Aucune réservation trouvée</Typography>
                        </Paper>
                    ) : (
                        <Stack spacing={1.5}>
                            {reservations.map((reservation) => {
                                const statusConf = getStatusConfig(reservation.status, theme);
                                const userName = reservation.user
                                    ? `${reservation.user.firstname || ''} ${reservation.user.lastname || ''}`.trim()
                                    : 'Inconnu';
                                const initial = userName.charAt(0).toUpperCase();
                                return (
                                    <Card key={reservation.id} elevation={0} sx={{
                                        bgcolor: '#fff', borderRadius: 3,
                                        border: `1px solid ${theme.palette.divider}`,
                                        '&:active': { bgcolor: `${theme.palette.primary.main}04` },
                                    }}>
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                            {/* Top row: user + actions */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flex: 1, minWidth: 0 }}>
                                                    <Avatar sx={{
                                                        width: 36, height: 36, fontSize: '0.82rem', fontWeight: 600,
                                                        bgcolor: `${theme.palette.primary.main}14`,
                                                        color: theme.palette.primary.dark, flexShrink: 0,
                                                    }}>{initial}</Avatar>
                                                    <Box sx={{ minWidth: 0 }}>
                                                        <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.88rem', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {userName}
                                                        </Typography>
                                                        <Typography sx={{ color: 'text.secondary', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {reservation.user?.email || ''}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <IconButton size="small" onClick={(e) => handleMenuOpen(e, reservation)}
                                                    sx={{
                                                        color: 'text.secondary', width: 36, height: 36, flexShrink: 0,
                                                        '&:hover': { bgcolor: `${theme.palette.primary.main}08` },
                                                    }}>
                                                    <MoreVert sx={{ fontSize: 20 }} />
                                                </IconButton>
                                            </Box>

                                            {/* Date + duration row */}
                                            <Box sx={{
                                                display: 'flex', alignItems: 'center', gap: 1, mb: 1.5,
                                                p: 1.25, borderRadius: 2, bgcolor: `${theme.palette.primary.main}04`,
                                            }}>
                                                <EventOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.82rem', flex: 1 }}>
                                                    {moment(reservation.start).format('DD MMM')} → {moment(reservation.end).format('DD MMM YYYY')}
                                                </Typography>
                                                <Chip label={`${reservation.duration} nuit${reservation.duration > 1 ? 's' : ''}`}
                                                    size="small" sx={{
                                                        height: 22, fontSize: '0.68rem', fontWeight: 600,
                                                        bgcolor: `${theme.palette.primary.main}14`, color: theme.palette.primary.dark,
                                                    }}
                                                />
                                            </Box>

                                            {/* Bottom row: status + date */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center', flexWrap: 'wrap' }}>
                                                    <Chip label={statusConf.label} size="small" sx={{
                                                        bgcolor: statusConf.bg, color: statusConf.color,
                                                        border: `1px solid ${statusConf.border}`,
                                                        fontWeight: 600, fontSize: '0.7rem', height: 24,
                                                    }} />
                                                    {reservation.has_overlap && (
                                                        <Chip label="Chevauchement" size="small" sx={{
                                                            bgcolor: `${theme.palette.warning.main}14`,
                                                            color: theme.palette.warning.dark,
                                                            border: `1px solid ${theme.palette.warning.main}40`,
                                                            fontWeight: 600, fontSize: '0.65rem', height: 20,
                                                        }} />
                                                    )}
                                                </Box>
                                                <Typography sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                                                    {moment(reservation.created_at).format('DD/MM/YY')}
                                                </Typography>
                                            </Box>

                                            {/* Quick action buttons for pending reservations */}
                                            {reservation.status === 'pending' && (
                                                <Box sx={{ display: 'flex', gap: 1, mt: 1.5, pt: 1.5, borderTop: `1px solid ${theme.palette.divider}` }}>
                                                    <Button
                                                        size="small" fullWidth variant="contained"
                                                        startIcon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
                                                        onClick={() => handleValidate(reservation.id)}
                                                        sx={{
                                                            textTransform: 'none', fontWeight: 600, fontSize: '0.78rem',
                                                            borderRadius: 2, py: 0.75,
                                                            bgcolor: theme.palette.success.main,
                                                            '&:hover': { bgcolor: theme.palette.success.dark },
                                                        }}
                                                    >
                                                        Valider
                                                    </Button>
                                                    <Button
                                                        size="small" fullWidth variant="outlined"
                                                        startIcon={<CancelOutlined sx={{ fontSize: 16 }} />}
                                                        onClick={() => handleCancel(reservation.id)}
                                                        sx={{
                                                            textTransform: 'none', fontWeight: 600, fontSize: '0.78rem',
                                                            borderRadius: 2, py: 0.75,
                                                            borderColor: theme.palette.error.main, color: theme.palette.error.main,
                                                            '&:hover': { bgcolor: `${theme.palette.error.main}08`, borderColor: theme.palette.error.dark },
                                                        }}
                                                    >
                                                        Refuser
                                                    </Button>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Stack>
                    )}

                    {/* Mobile pagination */}
                    {totalCount > rowsPerPage && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.5, mb: 1 }}>
                            <Pagination
                                count={Math.ceil(totalCount / rowsPerPage)}
                                page={page + 1}
                                onChange={(e, newPage) => setPage(newPage - 1)}
                                size="medium"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        fontWeight: 600, fontSize: '0.82rem',
                                        minWidth: 36, height: 36,
                                    },
                                }}
                            />
                        </Box>
                    )}
                </Box>
            )}

            {!loading && !isMobile && (
                /* ===== DESKTOP TABLE VIEW ===== */
                <Paper elevation={0} sx={{
                    bgcolor: '#fff', borderRadius: 3, overflow: 'hidden',
                    border: `1px solid ${theme.palette.divider}`,
                }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: `${theme.palette.primary.main}06` }}>
                                    {['Client', 'Dates', 'Statut', 'Créée le', 'Actions'].map((h) => (
                                        <TableCell key={h} sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.78rem', py: 1.5,
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                        }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reservations.map((reservation) => {
                                    const statusConf = getStatusConfig(reservation.status, theme);
                                    const userName = reservation.user
                                        ? `${reservation.user.firstname || ''} ${reservation.user.lastname || ''}`.trim()
                                        : 'Inconnu';
                                    const initial = userName.charAt(0).toUpperCase();
                                    return (
                                        <TableRow key={reservation.id} sx={{
                                            '&:hover': { bgcolor: `${theme.palette.primary.main}04` },
                                            '& td': { borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 },
                                        }}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{
                                                        width: 32, height: 32, fontSize: '0.78rem', fontWeight: 600,
                                                        bgcolor: `${theme.palette.primary.main}14`,
                                                        color: theme.palette.primary.dark,
                                                    }}>{initial}</Avatar>
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.82rem', lineHeight: 1.3 }}>
                                                            {userName}
                                                        </Typography>
                                                        <Typography sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                                                            {reservation.user?.email || ''}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.82rem' }}>
                                                    {moment(reservation.start).format('DD MMM')} → {moment(reservation.end).format('DD MMM YYYY')}
                                                </Typography>
                                                <Typography sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                                                    {reservation.duration} nuit{reservation.duration > 1 ? 's' : ''}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack spacing={0.5}>
                                                    <Chip label={statusConf.label} size="small" sx={{
                                                        bgcolor: statusConf.bg, color: statusConf.color,
                                                        border: `1px solid ${statusConf.border}`,
                                                        fontWeight: 600, fontSize: '0.7rem', height: 24,
                                                    }} />
                                                    {reservation.has_overlap && (
                                                        <Chip label="Chevauchement" size="small" sx={{
                                                            bgcolor: `${theme.palette.warning.main}14`,
                                                            color: theme.palette.warning.dark,
                                                            border: `1px solid ${theme.palette.warning.main}40`,
                                                            fontWeight: 600, fontSize: '0.65rem', height: 20,
                                                        }} />
                                                    )}
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                                                    {moment(reservation.created_at).format('DD/MM/YYYY')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small" onClick={(e) => handleMenuOpen(e, reservation)}
                                                    sx={{
                                                        color: 'text.secondary', width: 32, height: 32,
                                                        '&:hover': { bgcolor: `${theme.palette.primary.main}08` },
                                                    }}>
                                                    <MoreVert sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {reservations.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
                                            <BookOnlineOutlined sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                            <Typography sx={{ color: 'text.secondary' }}>Aucune réservation trouvée</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div" count={totalCount} page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage="Lignes par page :"
                        labelDisplayedRows={({ from, to, count }) => `${from}–${to} sur ${count}`}
                        sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
                    />
                </Paper>
            )}

            {/* Action Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
                PaperProps={{ sx: {
                    bgcolor: '#fff', border: `1px solid ${theme.palette.divider}`, borderRadius: 2.5,
                    boxShadow: '0 8px 24px rgba(84,73,65,0.12)', minWidth: 180,
                } }}>
                <MenuItem onClick={() => { if (menuReservation) { handleEdit(menuReservation); handleMenuClose(); } }}
                    sx={{ py: 1, fontSize: '0.85rem' }}>
                    <ListItemIcon><EditOutlined fontSize="small" sx={{ color: theme.palette.info.main }} /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Modifier</ListItemText>
                </MenuItem>
                {menuReservation?.status === 'pending' && (
                    <MenuItem onClick={() => { handleValidate(menuReservation!.id); handleMenuClose(); }} sx={{ py: 1 }}>
                        <ListItemIcon><CheckCircleOutlined fontSize="small" sx={{ color: theme.palette.success.main }} /></ListItemIcon>
                        <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Valider</ListItemText>
                    </MenuItem>
                )}
                {menuReservation && ['pending', 'approved'].includes(menuReservation.status) && (
                    <MenuItem onClick={() => { handleCancel(menuReservation!.id); handleMenuClose(); }} sx={{ py: 1 }}>
                        <ListItemIcon><CancelOutlined fontSize="small" sx={{ color: theme.palette.error.main }} /></ListItemIcon>
                        <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Annuler</ListItemText>
                    </MenuItem>
                )}
                <MenuItem onClick={() => { handleResendEmail(menuReservation!.id); handleMenuClose(); }} sx={{ py: 1 }}>
                    <ListItemIcon><EmailOutlined fontSize="small" sx={{ color: theme.palette.primary.main }} /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Renvoyer email</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { handleDelete(menuReservation!.id); handleMenuClose(); }}
                    sx={{ py: 1, color: theme.palette.error.main, '&:hover': { bgcolor: `${theme.palette.error.main}08` } }}>
                    <ListItemIcon><DeleteOutlined fontSize="small" sx={{ color: theme.palette.error.main }} /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Supprimer</ListItemText>
                </MenuItem>
            </Menu>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth
                fullScreen={isMobile}
                PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3 } }}>
                <DialogTitle sx={{ fontWeight: 600, fontSize: '1.1rem', pb: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    Modifier la réservation
                </DialogTitle>
                <DialogContent sx={{ pt: '16px !important' }}>
                    <Stack spacing={2.5} sx={{ mt: 0.5 }}>
                        <TextField label="Date de début" type="date" value={editFormData.start_date}
                            onChange={(e) => setEditFormData({ ...editFormData, start_date: e.target.value })}
                            fullWidth required InputLabelProps={{ shrink: true }} />
                        <TextField label="Date de fin" type="date" value={editFormData.end_date}
                            onChange={(e) => setEditFormData({ ...editFormData, end_date: e.target.value })}
                            fullWidth required InputLabelProps={{ shrink: true }} />
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select value={editFormData.type} label="Type"
                                onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}>
                                <MenuItem value="booking">Réservation</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Statut</InputLabel>
                            <Select value={editFormData.status} label="Statut"
                                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}>
                                <MenuItem value="pending">En attente</MenuItem>
                                <MenuItem value="approved">Approuvée</MenuItem>
                                <MenuItem value="cancelled">Annulée</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Button onClick={() => setEditDialogOpen(false)} sx={{ color: 'text.secondary', textTransform: 'none' }}>
                        Annuler
                    </Button>
                    <Button onClick={handleEditSubmit} variant="contained" sx={{ textTransform: 'none', fontWeight: 600 }}>
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Reservations;
