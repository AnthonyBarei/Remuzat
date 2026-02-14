import * as React from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Button, TextField, Link, Box, Typography, Alert, Stack } from "@mui/material";
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import AuthLayout from '../../Layouts/AuthLayout.tsx';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [password, setPassword] = React.useState('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
    const [alert, setAlert] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [tokenValid, setTokenValid] = React.useState(false);
    const [email, setEmail] = React.useState('');

    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');

    React.useEffect(() => {
        if (emailParam) setEmail(emailParam);
    }, [emailParam]);

    React.useEffect(() => {
        if (token && email) verifyToken();
    }, [token, email]);

    const verifyToken = async () => {
        try {
            const response = await fetch('/api/verify-reset-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email, token }),
            });
            const data = await response.json();
            if (response.ok) {
                setTokenValid(true);
            } else {
                setAlert({ type: 'error', message: data.message || 'Lien de réinitialisation invalide ou expiré.' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Erreur de connexion. Veuillez réessayer.' });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setAlert(null);

        if (password !== passwordConfirmation) {
            setAlert({ type: 'error', message: 'Les mots de passe ne correspondent pas.' });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email, token, password, password_confirmation: passwordConfirmation }),
            });
            const data = await response.json();

            if (response.ok) {
                setAlert({ type: 'success', message: data.message });
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setAlert({ type: 'error', message: data.message || 'Une erreur est survenue.' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Erreur de connexion. Veuillez réessayer.' });
        } finally {
            setLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <AuthLayout>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Lien de réinitialisation invalide. Veuillez demander un nouveau lien.
                </Alert>
                <Box sx={{ textAlign: 'center' }}>
                    <Link component={RouterLink} to="/forgot-password" variant="body2" sx={{ color: 'primary.dark', fontWeight: 600 }}>
                        Demander un nouveau lien
                    </Link>
                </Box>
            </AuthLayout>
        );
    }

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
                Nouveau mot de passe
            </Typography>
            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 3 }}>
                Choisissez un nouveau mot de passe pour votre compte
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2.5}>
                    <TextField
                        required fullWidth
                        name="password" label="Nouveau mot de passe" type="password" id="password"
                        autoComplete="new-password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        disabled={loading || !tokenValid}
                    />
                    <TextField
                        required fullWidth
                        name="password_confirmation" label="Confirmer le mot de passe" type="password"
                        id="password_confirmation" autoComplete="new-password"
                        value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}
                        disabled={loading || !tokenValid}
                    />

                    {alert && (<Alert severity={alert.type}>{alert.message}</Alert>)}

                    <Button
                        type="submit" fullWidth variant="contained" size="large"
                        disabled={loading || !tokenValid}
                        sx={{
                            py: 1.4, bgcolor: 'primary.main', color: 'primary.contrastText',
                            fontSize: '0.95rem', '&:hover': { bgcolor: 'primary.dark' }
                        }}
                    >
                        {loading ? 'Réinitialisation...' : 'Réinitialiser'}
                    </Button>
                </Stack>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Link component={RouterLink} to="/login" variant="body2" sx={{ color: 'primary.dark', fontWeight: 600 }}>
                        Retour à la connexion
                    </Link>
                </Box>
            </Box>
        </AuthLayout>
    );
}
