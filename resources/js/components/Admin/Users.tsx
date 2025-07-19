import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    Alert,
    CircularProgress,
    Tooltip,
    Switch,
    FormControlLabel,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    CheckCircle as AuthorizeIcon,
    Email as EmailIcon,
    MoreVert
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

// Helper function to get role colors
const getRoleColors = (role?: string, isAdmin?: boolean) => {
    if (role === 'super_admin') {
        return {
            bgcolor: colors.discreetPoppyRed + '20',
            color: colors.discreetPoppyRed,
            border: colors.discreetPoppyRed + '40'
        };
    } else if (role === 'admin' || isAdmin) {
        return {
            bgcolor: colors.softSunYellow + '20',
            color: colors.chestnutBrown,
            border: colors.softSunYellow + '40'
        };
    } else {
        return {
            bgcolor: colors.softLavender + '20',
            color: colors.provencalBlueGrey,
            border: colors.softLavender + '40'
        };
    }
};

interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    color_preference?: string;
    is_admin: boolean;
    role?: string;
    role_display_name?: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

interface UserFormData {
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    is_admin: boolean;
    role?: string;
}

const Users: React.FC = () => {
    const { user } = useAuth();
    const token = (user as any).token;
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: '',
        is_admin: false,
        role: 'user'
    });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
            fetchUsers();
        } catch (error) {
            console.log('Token validation failed:', error);
            // The auth interceptor will handle the logout
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors du chargement des utilisateurs');
            }

            const result = await response.json();
            setUsers(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                is_admin: user.is_admin,
                role: user.role || (user.is_admin ? 'admin' : 'user')
            });
        } else {
            setEditingUser(null);
            setFormData({
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                password_confirmation: '',
                is_admin: false,
                role: 'user'
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingUser(null);
        setFormData({
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            password_confirmation: '',
            is_admin: false,
            role: 'user'
        });
    };

    const handleSubmit = async () => {
        try {
            const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
            const method = editingUser ? 'PUT' : 'POST';
            
            const payload = { ...formData };
            
            // For updates, remove password fields if they're empty
            if (editingUser) {
                if (!payload.password) {
                    delete payload.password;
                    delete payload.password_confirmation;
                }
            }

            console.log('Submitting user data:', { url, method, payload });

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
                console.error('API Error:', errorData);
                throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Success response:', result);
            setSuccess(result.message || 'Opération réussie');
            handleCloseDialog();
            fetchUsers();
        } catch (err) {
            console.error('Submit error:', err);
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    const handleDelete = async (userId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            return;
        }

        try {
            const response = await fetch(`/api/users/${userId}`, {
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
            setSuccess(result.message || 'Utilisateur supprimé avec succès');
            fetchUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    const handleAuthorize = async (userId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir autoriser cet utilisateur ?')) {
            return;
        }

        try {
            const response = await fetch(`/api/users/${userId}/authorize`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'autorisation');
            }

            const result = await response.json();
            setSuccess(result.message || 'Utilisateur autorisé avec succès');
            fetchUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    const handleResendValidation = async (userId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir renvoyer l\'email de validation ?')) {
            return;
        }

        try {
            const response = await fetch(`/api/users/${userId}/resend-validation`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi de l\'email');
            }

            const result = await response.json();
            setSuccess(result.message || 'Email de validation renvoyé avec succès');
            fetchUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    color: colors.chestnutBrown
                }}>
                    Gestion des utilisateurs
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        bgcolor: colors.lightOliveGreen,
                        '&:hover': { bgcolor: colors.lightOliveGreen + 'DD' }
                    }}
                >
                    Ajouter un utilisateur
                </Button>
            </Box>

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

            <Paper sx={{
                bgcolor: 'white',
                borderRadius: 3,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                border: `1px solid ${colors.softLavender}20`,
            }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: colors.beigeStone }}>
                                <TableCell sx={{ fontWeight: 600, color: colors.chestnutBrown }}>
                                    Nom complet
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: colors.chestnutBrown }}>
                                    Email
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: colors.chestnutBrown }}>
                                    Rôle
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: colors.chestnutBrown }}>
                                    Statut
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: colors.chestnutBrown }}>
                                    Date d'inscription
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: colors.chestnutBrown }}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 500, color: colors.chestnutBrown }}>
                                            {user.firstname} {user.lastname}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.role_display_name || (user.is_admin ? 'Administrateur' : 'Utilisateur')}
                                            size="small"
                                            sx={{
                                                ...getRoleColors(user.role, user.is_admin),
                                                fontWeight: 600,
                                                border: getRoleColors(user.role, user.is_admin).border,
                                                '& .MuiChip-label': {
                                                    fontWeight: 600
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.email_verified_at ? 'Autorisé' : 'En attente'}
                                            size="small"
                                            sx={{
                                                bgcolor: user.email_verified_at ? colors.lightOliveGreen + '20' : colors.paleTerracotta + '20',
                                                color: user.email_verified_at ? colors.lightOliveGreen : colors.paleTerracotta,
                                                fontWeight: 600
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, user)}
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
                <MenuItem onClick={() => { handleOpenDialog(selectedUser!); handleMenuClose(); }}>
                    <ListItemIcon sx={{ color: colors.lightOliveGreen }}>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Modifier</ListItemText>
                </MenuItem>
                {selectedUser && !selectedUser.email_verified_at && (
                    <MenuItem onClick={() => { handleAuthorize(selectedUser.id); handleMenuClose(); }}>
                        <ListItemIcon sx={{ color: colors.lightOliveGreen }}>
                            <AuthorizeIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Autoriser</ListItemText>
                    </MenuItem>
                )}
                <MenuItem onClick={() => { handleResendValidation(selectedUser!.id); handleMenuClose(); }}>
                    <ListItemIcon sx={{ color: colors.softLavender }}>
                        <EmailIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Renvoyer email de validation</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { handleDelete(selectedUser!.id); handleMenuClose(); }}>
                    <ListItemIcon sx={{ color: colors.discreetPoppyRed }}>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Supprimer</ListItemText>
                </MenuItem>
            </Menu>

            {/* Add/Edit User Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ color: colors.chestnutBrown, fontWeight: 600 }}>
                    {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            label="Prénom"
                            value={formData.firstname}
                            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Nom"
                            value={formData.lastname}
                            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            fullWidth
                            required
                        />
                        {!editingUser && (
                            <>
                                <TextField
                                    label="Mot de passe"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Confirmer le mot de passe"
                                    type="password"
                                    value={formData.password_confirmation}
                                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                    fullWidth
                                    required
                                />
                            </>
                        )}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.is_admin}
                                    onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: colors.lightOliveGreen,
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            bgcolor: colors.lightOliveGreen + '50',
                                        },
                                    }}
                                />
                            }
                            label="Administrateur"
                        />
                        <TextField
                            select
                            label="Rôle"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            fullWidth
                            disabled={!formData.is_admin}
                        >
                            <MenuItem value="user">Utilisateur</MenuItem>
                            <MenuItem value="admin">Administrateur</MenuItem>
                            <MenuItem value="super_admin">Super Administrateur</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} sx={{ color: colors.provencalBlueGrey }}>
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            bgcolor: colors.lightOliveGreen,
                            '&:hover': { bgcolor: colors.lightOliveGreen + 'DD' }
                        }}
                    >
                        {editingUser ? 'Modifier' : 'Ajouter'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Users; 