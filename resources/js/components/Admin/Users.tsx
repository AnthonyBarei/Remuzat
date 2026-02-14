import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Chip, Alert, CircularProgress, Switch, FormControlLabel, Menu, MenuItem,
    ListItemIcon, ListItemText, useTheme, useMediaQuery, Avatar, Stack
} from '@mui/material';
import {
    AddOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined,
    EmailOutlined, MoreVert, PeopleOutlined, PersonOffOutlined
} from '@mui/icons-material';
import { useAuth } from '../../context/hooks/useAuth';

interface User {
    id: number; firstname: string; lastname: string; email: string;
    color_preference?: string; is_admin: boolean; role?: string;
    role_display_name?: string; email_verified_at?: string;
    admin_validated?: boolean; created_at: string; updated_at: string;
}

interface UserFormData {
    firstname: string; lastname: string; email: string;
    password?: string; password_confirmation?: string;
    is_admin: boolean; role?: string;
}

const getRoleConfig = (role?: string, isAdmin?: boolean) => {
    if (role === 'super_admin') return { label: 'Super Admin', variant: 'error' as const };
    if (role === 'admin' || isAdmin) return { label: 'Administrateur', variant: 'warning' as const };
    return { label: 'Utilisateur', variant: 'default' as const };
};

const getStatusConfig = (user: User, theme: any) => {
    if (user.is_admin) return { label: 'Admin', bg: `${theme.palette.warning.main}14`, color: theme.palette.warning.dark };
    if (user.email_verified_at && user.admin_validated) return { label: 'Autorisé', bg: `${theme.palette.success.main}14`, color: theme.palette.success.main };
    if (user.email_verified_at && !user.admin_validated) return { label: 'Email vérifié', bg: `${theme.palette.primary.main}14`, color: theme.palette.primary.dark };
    return { label: 'En attente', bg: `${theme.palette.warning.main}14`, color: theme.palette.warning.dark };
};

const Users: React.FC = () => {
    const { user } = useAuth();
    const token = (user as any).token;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        firstname: '', lastname: '', email: '', password: '', password_confirmation: '',
        is_admin: false, role: 'user'
    });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [filterPending, setFilterPending] = useState(false);

    useEffect(() => {
        if (token) validateTokenAndFetchData();
    }, [token]);

    const validateTokenAndFetchData = async () => {
        try {
            const response = await fetch('/api/me', {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Token validation failed');
            fetchUsers();
        } catch (error) { /* Token validation failed */ }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const url = filterPending ? '/api/users/pending' : '/api/users';
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Erreur lors du chargement des utilisateurs');
            const result = await response.json();
            setUsers(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally { setLoading(false); }
    };

    const handleOpenDialog = (u?: User) => {
        if (u) {
            setEditingUser(u);
            setFormData({
                firstname: u.firstname, lastname: u.lastname, email: u.email,
                is_admin: u.is_admin, role: u.role || (u.is_admin ? 'admin' : 'user')
            });
        } else {
            setEditingUser(null);
            setFormData({ firstname: '', lastname: '', email: '', password: '', password_confirmation: '', is_admin: false, role: 'user' });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false); setEditingUser(null);
        setFormData({ firstname: '', lastname: '', email: '', password: '', password_confirmation: '', is_admin: false, role: 'user' });
    };

    const handleSubmit = async () => {
        try {
            const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
            const method = editingUser ? 'PUT' : 'POST';
            const payload = { ...formData };
            if (editingUser && !payload.password) { delete payload.password; delete payload.password_confirmation; }

            const response = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
                throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            setSuccess(result.message || 'Opération réussie');
            handleCloseDialog(); fetchUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    const handleDelete = async (userId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Erreur lors de la suppression');
            const result = await response.json();
            setSuccess(result.message || 'Utilisateur supprimé avec succès'); fetchUsers();
        } catch (err) { setError(err instanceof Error ? err.message : 'Une erreur est survenue'); }
    };

    const handleAuthorize = async (userId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir autoriser cet utilisateur ?')) return;
        try {
            const response = await fetch(`/api/users/${userId}/authorize`, {
                method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error("Erreur lors de l'autorisation");
            const result = await response.json();
            setSuccess(result.message || 'Utilisateur autorisé avec succès'); fetchUsers();
        } catch (err) { setError(err instanceof Error ? err.message : 'Une erreur est survenue'); }
    };

    const handleResendValidation = async (userId: number) => {
        if (!window.confirm("Êtes-vous sûr de vouloir renvoyer l'email de validation ?")) return;
        try {
            const response = await fetch(`/api/users/${userId}/resend-validation`, {
                method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error("Erreur lors de l'envoi de l'email");
            const result = await response.json();
            setSuccess(result.message || 'Email de validation renvoyé avec succès'); fetchUsers();
        } catch (err) { setError(err instanceof Error ? err.message : 'Une erreur est survenue'); }
    };

    const handleRejectUser = async (userId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir rejeter cet utilisateur ? Son compte sera supprimé.')) return;
        try {
            const response = await fetch(`/api/users/${userId}/reject`, {
                method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error("Erreur lors du rejet");
            const result = await response.json();
            setSuccess(result.message || 'Utilisateur rejeté avec succès'); fetchUsers();
        } catch (err) { setError(err instanceof Error ? err.message : 'Une erreur est survenue'); }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, u: User) => {
        setAnchorEl(event.currentTarget); setSelectedUser(u);
    };
    const handleMenuClose = () => { setAnchorEl(null); setSelectedUser(null); };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress sx={{ color: theme.palette.primary.main }} />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2,
            }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.4rem', sm: '1.75rem' } }}>
                        Utilisateurs
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                        {users.length} utilisateur{users.length !== 1 ? 's' : ''} au total
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
                    <Button
                        variant={filterPending ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => { setFilterPending(!filterPending); setTimeout(() => fetchUsers(), 0); }}
                        sx={{
                            textTransform: 'none', fontWeight: 600, fontSize: '0.82rem',
                            borderRadius: 2, px: 2, py: 0.8,
                            ...(filterPending ? {
                                bgcolor: theme.palette.warning.main, color: '#fff',
                                '&:hover': { bgcolor: theme.palette.warning.dark },
                            } : {
                                borderColor: theme.palette.divider, color: 'text.secondary',
                                '&:hover': { borderColor: theme.palette.warning.main, color: theme.palette.warning.dark, bgcolor: `${theme.palette.warning.main}08` },
                            }),
                        }}
                    >
                        {filterPending ? 'Tous' : 'En attente'}
                    </Button>
                    <Button
                        variant="contained" size="small" startIcon={<AddOutlined sx={{ fontSize: 18 }} />}
                        onClick={() => handleOpenDialog()}
                        sx={{
                            textTransform: 'none', fontWeight: 600, fontSize: '0.82rem',
                            borderRadius: 2, px: 2, py: 0.8,
                        }}
                    >
                        Ajouter
                    </Button>
                </Stack>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setError(null)}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2.5 }} onClose={() => setSuccess(null)}>{success}</Alert>}

            {/* Table */}
            <Paper elevation={0} sx={{
                bgcolor: '#fff', borderRadius: 3, overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: `${theme.palette.primary.main}06` }}>
                                {['Utilisateur', 'Email', 'Rôle', 'Statut', 'Inscription', 'Actions'].map((h) => (
                                    <TableCell key={h} sx={{
                                        fontWeight: 600, color: 'text.primary', fontSize: '0.78rem', py: 1.5,
                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                    }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((u) => {
                                const roleConf = getRoleConfig(u.role, u.is_admin);
                                const statusConf = getStatusConfig(u, theme);
                                const initials = `${u.firstname?.charAt(0) || ''}${u.lastname?.charAt(0) || ''}`.toUpperCase();
                                return (
                                    <TableRow key={u.id} sx={{
                                        '&:hover': { bgcolor: `${theme.palette.primary.main}04` },
                                        '& td': { borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 },
                                    }}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{
                                                    width: 34, height: 34, fontSize: '0.72rem', fontWeight: 600,
                                                    bgcolor: `${theme.palette.primary.main}14`,
                                                    color: theme.palette.primary.dark,
                                                }}>{initials}</Avatar>
                                                <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.85rem' }}>
                                                    {u.firstname} {u.lastname}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                                                {u.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={u.role_display_name || roleConf.label} size="small" sx={{
                                                fontWeight: 600, fontSize: '0.7rem', height: 24, borderRadius: 1.5,
                                                ...(roleConf.variant === 'error' ? {
                                                    bgcolor: `${theme.palette.error.main}14`, color: theme.palette.error.main,
                                                } : roleConf.variant === 'warning' ? {
                                                    bgcolor: `${theme.palette.warning.main}14`, color: theme.palette.warning.dark,
                                                } : {
                                                    bgcolor: `${theme.palette.primary.main}14`, color: theme.palette.primary.dark,
                                                }),
                                            }} />
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={statusConf.label} size="small" sx={{
                                                bgcolor: statusConf.bg, color: statusConf.color,
                                                fontWeight: 600, fontSize: '0.7rem', height: 24, borderRadius: 1.5,
                                            }} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                                                {new Date(u.created_at).toLocaleDateString('fr-FR')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, u)}
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
                            {users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}>
                                        <PeopleOutlined sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                        <Typography sx={{ color: 'text.secondary' }}>Aucun utilisateur trouvé</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Action Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
                PaperProps={{ sx: {
                    bgcolor: '#fff', border: `1px solid ${theme.palette.divider}`, borderRadius: 2.5,
                    boxShadow: '0 8px 24px rgba(84,73,65,0.12)', minWidth: 200,
                } }}>
                <MenuItem onClick={() => { handleOpenDialog(selectedUser!); handleMenuClose(); }} sx={{ py: 1 }}>
                    <ListItemIcon><EditOutlined fontSize="small" sx={{ color: theme.palette.info.main }} /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Modifier</ListItemText>
                </MenuItem>
                {selectedUser && !selectedUser.is_admin && !selectedUser.admin_validated && (
                    <MenuItem onClick={() => { handleAuthorize(selectedUser.id); handleMenuClose(); }} sx={{ py: 1 }}>
                        <ListItemIcon><CheckCircleOutlined fontSize="small" sx={{ color: theme.palette.success.main }} /></ListItemIcon>
                        <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Autoriser</ListItemText>
                    </MenuItem>
                )}
                {selectedUser && !selectedUser.is_admin && !selectedUser.admin_validated && (
                    <MenuItem onClick={() => { handleRejectUser(selectedUser.id); handleMenuClose(); }} sx={{ py: 1 }}>
                        <ListItemIcon><PersonOffOutlined fontSize="small" sx={{ color: theme.palette.error.main }} /></ListItemIcon>
                        <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Rejeter</ListItemText>
                    </MenuItem>
                )}
                <MenuItem onClick={() => { handleResendValidation(selectedUser!.id); handleMenuClose(); }} sx={{ py: 1 }}>
                    <ListItemIcon><EmailOutlined fontSize="small" sx={{ color: theme.palette.primary.main }} /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Renvoyer email</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { handleDelete(selectedUser!.id); handleMenuClose(); }}
                    sx={{ py: 1, color: theme.palette.error.main, '&:hover': { bgcolor: `${theme.palette.error.main}08` } }}>
                    <ListItemIcon><DeleteOutlined fontSize="small" sx={{ color: theme.palette.error.main }} /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Supprimer</ListItemText>
                </MenuItem>
            </Menu>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth
                fullScreen={isMobile}
                PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3 } }}>
                <DialogTitle sx={{ fontWeight: 600, fontSize: '1.1rem', pb: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {editingUser ? "Modifier l'utilisateur" : 'Nouvel utilisateur'}
                </DialogTitle>
                <DialogContent sx={{ pt: '16px !important' }}>
                    <Stack spacing={2.5} sx={{ mt: 0.5 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField label="Prénom" value={formData.firstname}
                                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                fullWidth required />
                            <TextField label="Nom" value={formData.lastname}
                                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                fullWidth required />
                        </Stack>
                        <TextField label="Email" type="email" value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            fullWidth required />
                        {!editingUser && (
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField label="Mot de passe" type="password" value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    fullWidth required />
                                <TextField label="Confirmer" type="password" value={formData.password_confirmation}
                                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                    fullWidth required />
                            </Stack>
                        )}
                        <Box sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            p: 2, borderRadius: 2, bgcolor: `${theme.palette.primary.main}06`,
                            border: `1px solid ${theme.palette.divider}`,
                        }}>
                            <Box>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Administrateur</Typography>
                                <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                                    Accès au tableau de bord admin
                                </Typography>
                            </Box>
                            <Switch checked={formData.is_admin}
                                onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': { color: theme.palette.primary.main },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: `${theme.palette.primary.main}80` },
                                }}
                            />
                        </Box>
                        {formData.is_admin && (
                            <TextField select label="Rôle" value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                fullWidth>
                                <MenuItem value="user">Utilisateur</MenuItem>
                                <MenuItem value="admin">Administrateur</MenuItem>
                                <MenuItem value="super_admin">Super Administrateur</MenuItem>
                            </TextField>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Button onClick={handleCloseDialog} sx={{ color: 'text.secondary', textTransform: 'none' }}>
                        Annuler
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" sx={{ textTransform: 'none', fontWeight: 600 }}>
                        {editingUser ? 'Enregistrer' : 'Créer'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Users;
