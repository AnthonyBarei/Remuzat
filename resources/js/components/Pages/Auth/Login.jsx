import * as React from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Button, TextField, FormControlLabel, Checkbox, Link, Box, Typography, Alert, Stack
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../../../context/hooks/useAuth';
import AuthLayout from '../../Layouts/AuthLayout.tsx';

export default function Login() {
    const location = useLocation();
    const navigate = useNavigate();
    const { authed, login } = useAuth();
    const [alert, setAlert] = React.useState(false);
    const [rememberMe, setRememberMe] = React.useState(false);

    const authenticatedCallback = () => {
        let {from} = location.state || {from: {pathname: '/reservation'}}
        navigate(from, { replace: true });
    }

    React.useEffect(() => { if (authed) authenticatedCallback(); }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const loginCredentials = {
            email: formData.get('email'),
            password: formData.get('password'),
            remember: rememberMe,
        };

        login(loginCredentials).then(authenticatedCallback).catch((error) => {
            setAlert(error.message);
        });
    };

    return (
        <AuthLayout>
            {/* Icon */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box sx={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <LockOutlinedIcon sx={{ color: '#fff', fontSize: 24 }} />
                </Box>
            </Box>

            <Typography component="h1" variant="h5" align="center" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                Connexion
            </Typography>
            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 3 }}>
                Accédez à votre espace de réservation
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
                    />
                    <TextField
                        required
                        fullWidth
                        name="password"
                        label="Mot de passe"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }}
                            />
                        }
                        label={<Typography variant="body2">Se souvenir de moi</Typography>}
                    />

                    {alert && (<Alert severity="error">{alert}</Alert>)}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                            py: 1.4,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            fontSize: '0.95rem',
                            '&:hover': { bgcolor: 'primary.dark' }
                        }}
                    >
                        Se connecter
                    </Button>
                </Stack>

                <Stack spacing={1} sx={{ mt: 3, alignItems: 'center' }}>
                    <Link component={RouterLink} to="/forgot-password" variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.dark' } }}>
                        Mot de passe oublié ?
                    </Link>
                    <Link component={RouterLink} to="/signup" variant="body2" sx={{ color: 'primary.dark', fontWeight: 600 }}>
                        Pas encore de compte ? S'inscrire
                    </Link>
                </Stack>
            </Box>
        </AuthLayout>
    );
}
