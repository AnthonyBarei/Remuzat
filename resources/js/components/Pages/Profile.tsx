import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Divider,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Avatar,
    Grid
} from '@mui/material';
import {
    Person,
    Email,
    Lock,
    Delete,
    Save,
    Cancel,
    Warning
} from '@mui/icons-material';
import { useAuth } from '../../context/hooks/useAuth';
import MainLayout from '../Layouts/Main';

const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    // Password change form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    
    // Delete account dialog
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('Les nouveaux mots de passe ne correspondent pas.');
            setLoading(false);
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
            setLoading(false);
            return;
        }

        try {
            const response = await window.axios.put('/api/user/profile', {
                current_password: passwordForm.currentPassword,
                new_password: passwordForm.newPassword,
                new_password_confirmation: passwordForm.confirmPassword
            });

            if (response.data.success) {
                setSuccess('Mot de passe mis à jour avec succès.');
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setShowPasswordForm(false);
            } else {
                setError(response.data.message || 'Erreur lors de la mise à jour du mot de passe.');
            }
        } catch (error: any) {
            console.error('Erreur lors de la mise à jour du mot de passe:', error);
            setError(error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== 'SUPPRIMER') {
            setError('Veuillez taper "SUPPRIMER" pour confirmer la suppression.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await window.axios.delete('/api/user/profile');
            
            if (response.data.success) {
                // Logout and redirect to home
                const logoutConfig = {
                    headers: { 'Authorization': 'Bearer ' + user.token },
                };
                await logout(logoutConfig);
                window.location.href = '/';
            } else {
                setError(response.data.message || 'Erreur lors de la suppression du compte.');
            }
        } catch (error: any) {
            console.error('Erreur lors de la suppression du compte:', error);
            setError(error.response?.data?.message || 'Erreur lors de la suppression du compte.');
        } finally {
            setLoading(false);
            setShowDeleteDialog(false);
            setDeleteConfirmation('');
        }
    };

    return (
        <MainLayout>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ 
                    fontWeight: 700, 
                    color: 'primary.main',
                    mb: 4 
                }}>
                    Mon Profil
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {success}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {/* User Information */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ 
                            p: 3, 
                            bgcolor: 'rgba(255,255,255,0.95)', 
                            backdropFilter: 'blur(10px)',
                            borderRadius: 3,
                            boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{ 
                                    mr: 2, 
                                    bgcolor: 'primary.main',
                                    width: 64,
                                    height: 64,
                                    fontSize: '1.5rem'
                                }}>
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {user?.name || 'Utilisateur'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {user?.email || 'user@example.com'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Person sx={{ mr: 2, color: 'primary.main' }} />
                                    <Typography variant="body1">
                                        <strong>Nom:</strong> {user?.name || 'Non défini'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Email sx={{ mr: 2, color: 'primary.main' }} />
                                    <Typography variant="body1">
                                        <strong>Email:</strong> {user?.email || 'Non défini'}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Actions */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ 
                            p: 3, 
                            bgcolor: 'rgba(255,255,255,0.95)', 
                            backdropFilter: 'blur(10px)',
                            borderRadius: 3,
                            boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
                        }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                Actions
                            </Typography>

                            <Stack spacing={2}>
                                <Button
                                    variant="outlined"
                                    startIcon={<Lock />}
                                    onClick={() => setShowPasswordForm(true)}
                                    sx={{
                                        borderColor: 'primary.main',
                                        color: 'primary.main',
                                        '&:hover': {
                                            bgcolor: 'primary.main',
                                            color: 'white'
                                        }
                                    }}
                                >
                                    Changer le mot de passe
                                </Button>

                                <Divider />

                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Delete />}
                                    onClick={() => setShowDeleteDialog(true)}
                                    sx={{
                                        borderColor: 'error.main',
                                        color: 'error.main',
                                        '&:hover': {
                                            bgcolor: 'error.main',
                                            color: 'white'
                                        }
                                    }}
                                >
                                    Supprimer mon compte
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Password Change Dialog */}
                <Dialog 
                    open={showPasswordForm} 
                    onClose={() => setShowPasswordForm(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ fontWeight: 600 }}>
                        Changer le mot de passe
                    </DialogTitle>
                    <form onSubmit={handlePasswordChange}>
                        <DialogContent>
                            <Stack spacing={3}>
                                <TextField
                                    label="Mot de passe actuel"
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({
                                        ...passwordForm,
                                        currentPassword: e.target.value
                                    })}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Nouveau mot de passe"
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({
                                        ...passwordForm,
                                        newPassword: e.target.value
                                    })}
                                    required
                                    fullWidth
                                    helperText="Minimum 8 caractères"
                                />
                                <TextField
                                    label="Confirmer le nouveau mot de passe"
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({
                                        ...passwordForm,
                                        confirmPassword: e.target.value
                                    })}
                                    required
                                    fullWidth
                                />
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button 
                                onClick={() => setShowPasswordForm(false)}
                                disabled={loading}
                            >
                                Annuler
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    bgcolor: 'primary.main',
                                    '&:hover': { bgcolor: 'primary.dark' }
                                }}
                            >
                                {loading ? 'Mise à jour...' : 'Mettre à jour'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>

                {/* Delete Account Dialog */}
                <Dialog 
                    open={showDeleteDialog} 
                    onClose={() => setShowDeleteDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ fontWeight: 600, color: 'error.main' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Warning sx={{ mr: 1 }} />
                            Supprimer mon compte
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Pour confirmer, tapez "SUPPRIMER" dans le champ ci-dessous :
                        </Typography>
                        <TextField
                            label="Confirmation"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            fullWidth
                            placeholder="SUPPRIMER"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={loading}
                        >
                            Annuler
                        </Button>
                        <Button 
                            onClick={handleDeleteAccount}
                            variant="contained"
                            color="error"
                            disabled={loading || deleteConfirmation !== 'SUPPRIMER'}
                        >
                            {loading ? 'Suppression...' : 'Supprimer définitivement'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </MainLayout>
    );
};

export default Profile; 