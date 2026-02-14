import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Button, TextField, Link, Box, Typography, Alert, Stack
} from "@mui/material";
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { useAuth } from '../../../context/hooks/useAuth';
import AuthLayout from '../../Layouts/AuthLayout.tsx';

export default function SignUp() {
    const [severity, setSeverity] = React.useState("error");
    const [alert, setAlert] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const { register } = useAuth();

    const handleSubmit = (event) => {
        event.preventDefault();
        setAlert(null);
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

        const loginCredentials = {
            firstname: formData.get('firstName'),
            lastname: formData.get('lastName'),
            email: formData.get('email'),
            password: formData.get('password'),
            password_confirmation: formData.get('confirmPassword'),
        };

        const registeredCallback = () => {
            setSeverity('success');
            setAlert('Compte créé avec succès. Veuillez attendre qu\'un administrateur valide votre inscription.');
            setIsLoading(false);
        }

        register(loginCredentials).then(registeredCallback).catch((error) => {
            setSeverity('error');
            setAlert(error.message);
            setIsLoading(false);
        });
    };

    return (
        <AuthLayout maxWidth={440}>
            {/* Icon */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box sx={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: (theme) => `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <PersonAddOutlinedIcon sx={{ color: '#fff', fontSize: 24 }} />
                </Box>
            </Box>

            <Typography component="h1" variant="h5" align="center" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                Inscription
            </Typography>
            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 3 }}>
                Créez votre compte pour réserver
            </Typography>

            <Box component="form" noValidate onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            autoComplete="given-name"
                            name="firstName"
                            required
                            fullWidth
                            id="firstName"
                            label="Prénom"
                            autoFocus
                        />
                        <TextField
                            required
                            fullWidth
                            id="lastName"
                            label="Nom"
                            name="lastName"
                            autoComplete="family-name"
                        />
                    </Stack>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Adresse email"
                        name="email"
                        autoComplete="email"
                    />
                    <TextField
                        required
                        fullWidth
                        name="password"
                        label="Mot de passe"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                    />
                    <TextField
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirmer le mot de passe"
                        type="password"
                        id="confirm-password"
                        autoComplete="new-password"
                    />

                    {alert && (<Alert severity={severity}>{alert}</Alert>)}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isLoading}
                        sx={{
                            py: 1.4,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            fontSize: '0.95rem',
                            '&:hover': { bgcolor: 'primary.dark' }
                        }}
                    >
                        {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                    </Button>
                </Stack>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Link component={RouterLink} to="/login" variant="body2" sx={{ color: 'primary.dark', fontWeight: 600 }}>
                        Déjà un compte ? Se connecter
                    </Link>
                </Box>
            </Box>
        </AuthLayout>
    );
}
