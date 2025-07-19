// React
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// MUI
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Alert } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// Components
import Copyright from '../../Layouts/Copyright';
// Auth
import { useAuth } from '../../../context/hooks/useAuth';

export default function ForgotPassword() {
    const [email, setEmail] = React.useState('');
    const [alert, setAlert] = React.useState(null);
    const [severity, setSeverity] = React.useState('error');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setAlert(null);

        try {
            // For now, we'll just show a success message
            // In a real implementation, this would call an API endpoint
            setSeverity('success');
            setAlert('Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation.');
        } catch (error) {
            setSeverity('error');
            setAlert('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Mot de passe oublié
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                    Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
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
                    />

                    {alert && (
                        <Alert severity={severity} sx={{ mb: 2, mt: 2 }}>{alert}</Alert>
                    )}

                    <Button 
                        type="submit" 
                        fullWidth 
                        variant="contained" 
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                    </Button>

                    <Grid container justifyContent="center">
                        <Grid item>
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