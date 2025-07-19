// React
import * as React from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
// MUI
import { Avatar, Button, CssBaseline, Link, Grid, Box, Typography, Container, Alert, CircularProgress } from "@mui/material";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
// Components
import Copyright from '../../Layouts/Copyright';

export default function EmailVerification() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [alert, setAlert] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [verifying, setVerifying] = React.useState(true);
    const [verified, setVerified] = React.useState(false);

    // Get verification parameters from URL
    const id = searchParams.get('id');
    const hash = searchParams.get('hash');
    const expires = searchParams.get('expires');
    const signature = searchParams.get('signature');

    React.useEffect(() => {
        if (id && hash && expires && signature) {
            verifyEmail();
        } else {
            setVerifying(false);
            setAlert({ type: 'error', message: 'Lien de vérification invalide.' });
        }
    }, [id, hash, expires, signature]);

    const verifyEmail = async () => {
        try {
            const response = await fetch('/api/email/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ id, hash }),
            });

            const data = await response.json();

            if (response.ok) {
                setVerified(true);
                setAlert({ type: 'success', message: data.message || 'Email vérifié avec succès !' });
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
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
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email: searchParams.get('email') }),
            });

            const data = await response.json();

            if (response.ok) {
                setAlert({ type: 'success', message: data.message || 'Email de vérification renvoyé avec succès.' });
            } else {
                setAlert({ type: 'error', message: data.message || 'Erreur lors de l\'envoi de l\'email.' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Erreur de connexion. Veuillez réessayer.' });
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="h6">
                        Vérification de votre email...
                    </Typography>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Avatar sx={{ m: 1, bgcolor: verified ? 'success.main' : 'secondary.main' }}>
                    <EmailOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {verified ? 'Email vérifié !' : 'Vérification de l\'email'}
                </Typography>
                
                {alert && (
                    <Alert severity={alert.type} sx={{ mb: 2, mt: 2, width: '100%' }}>
                        {alert.message}
                    </Alert>
                )}

                {!verified && (
                    <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                        Si vous n'avez pas reçu l'email de vérification, vous pouvez le renvoyer.
                    </Typography>
                )}

                {!verified && searchParams.get('email') && (
                    <Button 
                        variant="outlined" 
                        onClick={resendVerification}
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? 'Envoi...' : 'Renvoyer l\'email de vérification'}
                    </Button>
                )}

                <Grid container spacing={1} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                        <Link component={RouterLink} to="/login" variant="body2">
                            Retour à la connexion
                        </Link>
                    </Grid>
                    {!verified && (
                        <Grid item xs={12}>
                            <Link component={RouterLink} to="/signup" variant="body2">
                                Créer un nouveau compte
                            </Link>
                        </Grid>
                    )}
                </Grid>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
} 