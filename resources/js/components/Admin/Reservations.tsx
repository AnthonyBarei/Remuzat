import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Chip,
    IconButton,
    Tooltip,
    Stack,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Menu,
    ListItemIcon,
    ListItemText,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    CheckCircle,
    Cancel,
    Edit,
    Email,
    Visibility,
    Refresh,
    MoreVert,
    Delete
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
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

interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
}

interface Reservation {
    id: number;
    start: string;
    end: string;
    duration: number;
    type: string;
    status: string;
    created_at: string;
    user: User | null;
    validated_by?: User | null;
    has_overlap?: boolean;
}

interface Statistics {
    pending: number;
    approved: number;
    cancelled: number;
    total: number;
}

interface EditFormData {
    start_date: string;
    end_date: string;
    type: string;
    status: string;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return { bg: colors.softSunYellow + '20', color: colors.chestnutBrown, border: colors.softSunYellow };
        case 'approved':
            return { bg: colors.lightOliveGreen + '20', color: colors.lightOliveGreen, border: colors.lightOliveGreen };
        case 'cancelled':
            return { bg: colors.discreetPoppyRed + '20', color: colors.discreetPoppyRed, border: colors.discreetPoppyRed };
        default:
            return { bg: colors.provencalBlueGrey + '20', color: colors.provencalBlueGrey, border: colors.provencalBlueGrey };
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'pending':
            return 'En attente';
        case 'approved':
            return 'Approuvée';
        case 'cancelled':
            return 'Annulée';
        default:
            return status;
    }
};

const Reservations: React.FC = () => {
    const { user, authed, loading: authLoading } = useAuth();
    const token = (user as any)?.token || localStorage.getItem('token') || sessionStorage.getItem('token');
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [statistics, setStatistics] = useState<Statistics>({ pending: 0, approved: 0, cancelled: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        status: '',
        search: '',
        startDate: null,
        endDate: null,
        showOverlaps: false
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [menuReservation, setMenuReservation] = useState<Reservation | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<EditFormData>({
        start_date: '',
        end_date: '',
        type: 'booking',
        status: ''
    });

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
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors du chargement des réservations');
            }

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
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const result = await response.json();
                setStatistics(result.data);
            }
        } catch (err) {
            console.error('Failed to fetch statistics:', err);
        }
    };

    useEffect(() => {
        console.log('Reservations - useEffect triggered:', { authed, authLoading, token: !!token });
        // Only fetch data if user is authenticated and not loading
        if (authed && !authLoading && token) {
            console.log('Reservations - Fetching data...');
            // Validate token immediately before making API calls
            validateTokenAndFetchData();
        }
    }, [page, rowsPerPage, filters, authed, authLoading, token]);

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
            fetchReservations();
            fetchStatistics();
        } catch (error) {
            console.log('Token validation failed:', error);
            // The auth interceptor will handle the logout
        }
    };


    const handleValidate = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/reservations/${id}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la validation');
            }

            const result = await response.json();
            setSuccess(result.message || 'Réservation validée avec succès');
            fetchReservations();
            fetchStatistics();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    const handleCancel = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/reservations/${id}/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'annulation');
            }

            const result = await response.json();
            setSuccess(result.message || 'Réservation annulée avec succès');
            fetchReservations();
            fetchStatistics();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cette réservation ? Cette action est irréversible.')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/reservations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression');
            }

            const result = await response.json();
            setSuccess(result.message || 'Réservation supprimée avec succès');
            fetchReservations();
            fetchStatistics();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    const handleResendEmail = (id: number) => {
        console.log('Resend email for reservation:', id);
        setSuccess('Email renvoyé avec succès');
    };

    const handleEdit = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setEditFormData({
            start_date: moment(reservation.start).format('YYYY-MM-DD'),
            end_date: moment(reservation.end).format('YYYY-MM-DD'),
            type: reservation.type,
            status: reservation.status
        });
        setEditDialogOpen(true);
    };

    const handleEditSubmit = async () => {
        if (!menuReservation) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/reservations/${menuReservation.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la modification');
            }

            const result = await response.json();
            
            // Check if there's an overlap warning
            if (result.data && result.data.overlap_warning) {
                setSuccess(`⚠️ ${result.data.message}`);
            } else {
                setSuccess(result.message || 'Réservation modifiée avec succès');
            }
            
            setEditDialogOpen(false);
            fetchReservations();
            fetchStatistics();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    const handleView = (id: number) => {
        console.log('View reservation:', id);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, reservation: Reservation) => {
        setAnchorEl(event.currentTarget);
        setSelectedReservation(reservation);
        setMenuReservation(reservation);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedReservation(null);
        // Don't clear menuReservation here, keep it for the menu actions
    };

    const handleResetFilters = () => {
        setFilters({ status: '', search: '', startDate: null, endDate: null, showOverlaps: false });
        setPage(0);
    };

    // Show loading state while authentication is being checked
    if (authLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Show error if not authenticated
    if (!authed || !token) {
        console.log('Reservations - Auth debug:', { authed, token: !!token, user, authLoading });
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Typography variant="h6" sx={{ color: colors.chestnutBrown }}>
                    Erreur d'authentification
                </Typography>
            </Box>
        );
    }

    // Show loading state while fetching data
    if (loading && reservations.length === 0) {
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
                Réservations
            </Typography>
            


            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            {/* Filters */}
            <Paper sx={{
                bgcolor: 'white',
                borderRadius: 3,
                p: 3,
                mb: 3,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                border: `1px solid ${colors.softLavender}20`,
            }}>
                <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    color: colors.chestnutBrown,
                    mb: 2
                }}>
                    Filtres
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Rechercher"
                            placeholder="Nom ou email..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Statut</InputLabel>
                            <Select
                                value={filters.status}
                                label="Statut"
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                sx={{ borderRadius: 2 }}
                            >
                                <MenuItem value="">Tous</MenuItem>
                                <MenuItem value="pending">En attente</MenuItem>
                                <MenuItem value="approved">Approuvées</MenuItem>
                                <MenuItem value="cancelled">Annulées</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <DatePicker
                            label="Date début"
                            value={filters.startDate}
                            onChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    sx: { borderRadius: 2 }
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <DatePicker
                            label="Date fin"
                            value={filters.endDate}
                            onChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    sx: { borderRadius: 2 }
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Filtres spéciaux</InputLabel>
                            <Select
                                value={filters.showOverlaps ? 'overlaps' : ''}
                                label="Filtres spéciaux"
                                onChange={(e) => setFilters(prev => ({ ...prev, showOverlaps: e.target.value === 'overlaps' }))}
                                sx={{ borderRadius: 2 }}
                            >
                                <MenuItem value="">Tous</MenuItem>
                                <MenuItem value="overlaps">Avec chevauchements</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={1}>
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="outlined"
                                startIcon={<Refresh />}
                                onClick={handleResetFilters}
                                sx={{
                                    borderColor: colors.softLavender,
                                    color: colors.provencalBlueGrey,
                                    borderRadius: 2,
                                    '&:hover': {
                                        borderColor: colors.softLavender,
                                        bgcolor: colors.softLavender + '10'
                                    }
                                }}
                            >
                                Réinitialiser
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        border: `1px solid ${colors.softLavender}20`,
                    }}>
                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ 
                                fontWeight: 700, 
                                color: colors.softSunYellow,
                                mb: 0.5
                            }}>
                                {statistics.pending}
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.provencalBlueGrey }}>
                                En attente
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        border: `1px solid ${colors.softLavender}20`,
                    }}>
                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ 
                                fontWeight: 700, 
                                color: colors.lightOliveGreen,
                                mb: 0.5
                            }}>
                                {statistics.approved}
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.provencalBlueGrey }}>
                                Approuvées
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        border: `1px solid ${colors.softLavender}20`,
                    }}>
                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ 
                                fontWeight: 700, 
                                color: colors.discreetPoppyRed,
                                mb: 0.5
                            }}>
                                {statistics.cancelled}
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.provencalBlueGrey }}>
                                Annulées
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        border: `1px solid ${colors.softLavender}20`,
                    }}>
                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ 
                                fontWeight: 700, 
                                color: colors.chestnutBrown,
                                mb: 0.5
                            }}>
                                {statistics.total}
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.provencalBlueGrey }}>
                                Total
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Table */}
            <Paper sx={{
                bgcolor: 'white',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                border: `1px solid ${colors.softLavender}20`,
            }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: colors.beigeStone }}>
                                <TableCell sx={{ fontWeight: 600, color: colors.chestnutBrown }}>Client</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: colors.chestnutBrown }}>Dates</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: colors.chestnutBrown }}>Statut</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: colors.chestnutBrown }}>Créée le</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: colors.chestnutBrown }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reservations.map((reservation) => (
                                <TableRow key={reservation.id} sx={{ '&:hover': { bgcolor: colors.beigeStone } }}>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.chestnutBrown }}>
                                                {reservation.user ? `${reservation.user.firstname || ''} ${reservation.user.lastname || ''}`.trim() : 'Utilisateur inconnu'}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: colors.provencalBlueGrey }}>
                                                {reservation.user?.email || 'Email non disponible'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.chestnutBrown }}>
                                                {moment(reservation.start).format('DD/MM/YYYY')}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: colors.provencalBlueGrey }}>
                                                {reservation.duration} jours
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            <Chip
                                                label={getStatusLabel(reservation.status)}
                                                size="small"
                                                sx={{
                                                    bgcolor: getStatusColor(reservation.status).bg,
                                                    color: getStatusColor(reservation.status).color,
                                                    border: `1px solid ${getStatusColor(reservation.status).border}`,
                                                    fontWeight: 600,
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                            {reservation.has_overlap && (
                                                <Chip
                                                    label="⚠️ Chevauchement"
                                                    size="small"
                                                    sx={{
                                                        bgcolor: colors.softSunYellow + '20',
                                                        color: colors.chestnutBrown,
                                                        border: `1px solid ${colors.softSunYellow}`,
                                                        fontWeight: 600,
                                                        fontSize: '0.7rem'
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {moment(reservation.created_at).format('DD/MM/YYYY')}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, reservation)}
                                            sx={{ color: colors.provencalBlueGrey }}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Lignes par page:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
                />
            </Paper>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        bgcolor: 'white',
                        border: `1px solid ${colors.softLavender}20`,
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    }
                }}
            >
                                <MenuItem onClick={() => { 
                    if (menuReservation) {
                        handleEdit(menuReservation); 
                        handleMenuClose(); 
                    }
                }}>
                    <ListItemIcon sx={{ color: colors.paleTerracotta }}>
                        <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Modifier</ListItemText>
                </MenuItem>
                {menuReservation && menuReservation.status === 'pending' && (
                    <MenuItem onClick={() => { handleValidate(menuReservation.id); handleMenuClose(); }}>
                        <ListItemIcon sx={{ color: colors.lightOliveGreen }}>
                            <CheckCircle fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Valider</ListItemText>
                    </MenuItem>
                )}
                {menuReservation && ['pending', 'approved'].includes(menuReservation.status) && (
                    <MenuItem onClick={() => { handleCancel(menuReservation.id); handleMenuClose(); }}>
                        <ListItemIcon sx={{ color: colors.discreetPoppyRed }}>
                            <Cancel fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Annuler</ListItemText>
                    </MenuItem>
                )}
                <MenuItem onClick={() => { handleResendEmail(menuReservation!.id); handleMenuClose(); }}>
                    <ListItemIcon sx={{ color: colors.softLavender }}>
                        <Email fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Renvoyer email</ListItemText>
                </MenuItem>
                <MenuItem 
                    onClick={() => { handleDelete(menuReservation!.id); handleMenuClose(); }}
                    sx={{ 
                        color: colors.discreetPoppyRed,
                        '&:hover': { 
                            bgcolor: colors.discreetPoppyRed + '10' 
                        }
                    }}
                >
                    <ListItemIcon sx={{ color: colors.discreetPoppyRed }}>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Supprimer définitivement</ListItemText>
                </MenuItem>
            </Menu>

            {/* Edit Reservation Dialog */}
            <Dialog 
                open={editDialogOpen} 
                onClose={() => setEditDialogOpen(false)} 
                maxWidth="sm" 
                fullWidth
                sx={{ zIndex: 9999 }}
            >
                <DialogTitle sx={{ color: colors.chestnutBrown, fontWeight: 600 }}>
                    Modifier la réservation
                </DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            label="Date de début"
                            type="date"
                            value={editFormData.start_date}
                            onChange={(e) => setEditFormData({ ...editFormData, start_date: e.target.value })}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Date de fin"
                            type="date"
                            value={editFormData.end_date}
                            onChange={(e) => setEditFormData({ ...editFormData, end_date: e.target.value })}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={editFormData.type}
                                label="Type"
                                onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                            >
                                <MenuItem value="booking">Réservation</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Statut</InputLabel>
                            <Select
                                value={editFormData.status}
                                label="Statut"
                                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                            >
                                <MenuItem value="pending">En attente</MenuItem>
                                <MenuItem value="approved">Approuvée</MenuItem>
                                <MenuItem value="cancelled">Annulée</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} sx={{ color: colors.provencalBlueGrey }}>
                        Annuler
                    </Button>
                    <Button
                        onClick={handleEditSubmit}
                        variant="contained"
                        sx={{
                            bgcolor: colors.lightOliveGreen,
                            '&:hover': { bgcolor: colors.lightOliveGreen + 'DD' }
                        }}
                    >
                        Modifier
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Reservations; 