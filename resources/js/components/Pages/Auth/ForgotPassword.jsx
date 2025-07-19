// React
import * as React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// MUI
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Alert } from "@mui/material";
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
// Components
import Copyright from '../../Layouts/Copyright';

export default function ForgotPassword() {
    const navigate = useNavigate();
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
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
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
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockResetOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Mot de passe oublié
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                    Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField 
                        margin="normal" 
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
                        disabled={loading}
                    >
                        {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                    </Button>

                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Link component={RouterLink} to="/login" variant="body2">
                                Retour à la connexion
                            </Link>
                        </Grid>
                        <Grid item xs={12}>
                            <Link component={RouterLink} to="/signup" variant="body2">
                                Vous n'avez pas de compte ? S'inscrire
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
} 