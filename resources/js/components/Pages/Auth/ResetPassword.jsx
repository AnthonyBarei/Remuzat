// React
import * as React from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
// MUI
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Alert } from "@mui/material";
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
// Components
import Copyright from '../../Layouts/Copyright';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [password, setPassword] = React.useState('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
    const [alert, setAlert] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [tokenValid, setTokenValid] = React.useState(false);
    const [email, setEmail] = React.useState('');

    // Get token and email from URL parameters
    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');

    React.useEffect(() => {
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [emailParam]);

    React.useEffect(() => {
        // Verify token when component mounts
        if (token && email) {
            verifyToken();
        }
    }, [token, email]);

    const verifyToken = async () => {
        try {
            const response = await fetch('/api/verify-reset-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, token }),
            });

            const data = await response.json();

            if (response.ok) {
                setTokenValid(true);
            } else {
                setAlert({ type: 'error', message: data.message || 'Lien de réinitialisation invalide ou expiré.' });
            }
        } catch (error) {
            console.error('Token verification error:', error);
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
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ 
                    email, 
                    token, 
                    password, 
                    password_confirmation: passwordConfirmation 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setAlert({ type: 'success', message: data.message });
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
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
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Lien de réinitialisation invalide. Veuillez demander un nouveau lien.
                    </Alert>
                    <Link component={RouterLink} to="/forgot-password" variant="body2">
                        Demander un nouveau lien
                    </Link>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockResetOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Réinitialiser le mot de passe
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                    Entrez votre nouveau mot de passe pour votre compte.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField 
                        margin="normal" 
                        required 
                        fullWidth 
                        name="password" 
                        label="Nouveau mot de passe" 
                        type="password" 
                        id="password" 
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading || !tokenValid}
                    />
                    <TextField 
                        margin="normal" 
                        required 
                        fullWidth 
                        name="password_confirmation" 
                        label="Confirmer le mot de passe" 
                        type="password" 
                        id="password_confirmation" 
                        autoComplete="new-password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        disabled={loading || !tokenValid}
                    />

                    {alert && (
                        <Alert severity={alert.type} sx={{ mb: 2, mt: 2 }}>
                            {alert.message}
                        </Alert>
                    )}

                    <Button 
                        type="submit" 
                        fullWidth 
                        variant="contained" 
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading || !tokenValid}
                    >
                        {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                    </Button>

                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Link component={RouterLink} to="/login" variant="body2">
                                Retour à la connexion
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
} 