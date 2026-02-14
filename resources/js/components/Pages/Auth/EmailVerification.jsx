import * as React from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Button, Link, Box, Typography, Alert, CircularProgress, Stack } from "@mui/material";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AuthLayout from '../../Layouts/AuthLayout.tsx';

export default function EmailVerification() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [alert, setAlert] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [verifying, setVerifying] = React.useState(true);
    const [verified, setVerified] = React.useState(false);

    const id = searchParams.get('id');
    const hash = searchParams.get('hash');

    React.useEffect(() => {
        if (id && hash) {
            verifyEmail();
        } else {
            setVerifying(false);
            setAlert({ type: 'error', message: 'Lien de vérification invalide.' });
        }
    }, [id, hash]);

    const verifyEmail = async () => {
        try {
            const response = await fetch('/api/email/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ id, hash }),
            });
            const data = await response.json();

            if (response.ok) {
                setVerified(true);
                setAlert({ type: 'success', message: data.message || 'Email vérifié avec succès !' });
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setAlert({ type: 'error', message: data.message || 'Erreur lors de la vérification.' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Erreur de connexion. Veuillez réessayer.' });
        } finally {
            setVerifying(false);
        }
    };

    const resendVerification = async () => {
        setLoading(true);
        setAlert(null);

        try {
            const response = await fetch('/api/email/resend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email: searchParams.get('email') }),
            });
            const data = await response.json();

            if (response.ok) {
                setAlert({ type: 'success', message: data.message || 'Email de vérification renvoyé.' });
            } else {
                setAlert({ type: 'error', message: data.message || 'Erreur lors de l\'envoi.' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Erreur de connexion. Veuillez réessayer.' });
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <AuthLayout>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                    <CircularProgress sx={{ mb: 3, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Vérification en cours...
                    </Typography>
                </Box>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box sx={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: (theme) => verified
                        ? `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`
                        : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    {verified
                        ? <CheckCircleOutlineIcon sx={{ color: '#fff', fontSize: 24 }} />
                        : <EmailOutlinedIcon sx={{ color: '#fff', fontSize: 24 }} />
                    }
                </Box>
            </Box>

            <Typography component="h1" variant="h5" align="center" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                {verified ? 'Email vérifié !' : 'Vérification de l\'email'}
            </Typography>

            {alert && (
                <Alert severity={alert.type} sx={{ mt: 2 }}>
                    {alert.message}
                </Alert>
            )}

            {!verified && (
                <Typography variant="body2" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
                    Si vous n'avez pas reçu l'email, vous pouvez le renvoyer.
                </Typography>
            )}

            {!verified && searchParams.get('email') && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        onClick={resendVerification}
                        disabled={loading}
                        sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                    >
                        {loading ? 'Envoi...' : 'Renvoyer l\'email'}
                    </Button>
                </Box>
            )}

            <Stack spacing={1} sx={{ mt: 3, alignItems: 'center' }}>
                <Link component={RouterLink} to="/login" variant="body2" sx={{ color: 'primary.dark', fontWeight: 600 }}>
                    Retour à la connexion
                </Link>
                {!verified && (
                    <Link component={RouterLink} to="/signup" variant="body2" sx={{ color: 'text.secondary' }}>
                        Créer un nouveau compte
                    </Link>
                )}
            </Stack>
        </AuthLayout>
    );
}
