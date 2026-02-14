import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, TextField, Link, Box, Typography, Alert, Stack } from "@mui/material";
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import AuthLayout from '../../Layouts/AuthLayout.tsx';

export default function ForgotPassword() {
    const [email, setEmail] = React.useState('');
    const [alert, setAlert] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setAlert(null);

        try {
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (response.ok) {
                setAlert({ type: 'success', message: data.message });
                setEmail('');
            } else {
                setAlert({ type: 'error', message: data.message || 'Une erreur est survenue.' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Erreur de connexion. Veuillez réessayer.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box sx={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: (theme) => `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <LockResetOutlinedIcon sx={{ color: '#fff', fontSize: 24 }} />
                </Box>
            </Box>

            <Typography component="h1" variant="h5" align="center" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                Mot de passe oublié
            </Typography>
            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 3 }}>
                Entrez votre email pour recevoir un lien de réinitialisation
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2.5}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Adresse email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />

                    {alert && (<Alert severity={alert.type}>{alert.message}</Alert>)}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{
                            py: 1.4,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            fontSize: '0.95rem',
                            '&:hover': { bgcolor: 'primary.dark' }
                        }}
                    >
                        {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                    </Button>
                </Stack>

                <Stack spacing={1} sx={{ mt: 3, alignItems: 'center' }}>
                    <Link component={RouterLink} to="/login" variant="body2" sx={{ color: 'primary.dark', fontWeight: 600 }}>
                        Retour à la connexion
                    </Link>
                    <Link component={RouterLink} to="/signup" variant="body2" sx={{ color: 'text.secondary' }}>
                        Pas encore de compte ? S'inscrire
                    </Link>
                </Stack>
            </Box>
        </AuthLayout>
    );
}
