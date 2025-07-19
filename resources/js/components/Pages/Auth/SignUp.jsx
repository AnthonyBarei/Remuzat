// React
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// MUI
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// Components
import Copyright from '../../Layouts/Copyright';
// Auth
import { useAuth } from '../../../context/hooks/useAuth';

export default function SignUp({authenticate}) {
    const [severity, setSeverity] = React.useState("error")
    const [alert, setAlert] = React.useState(null);
    const { register } = useAuth();

    const handleSubmit = (event) => {
        event.preventDefault();

        setAlert(null);

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
            setAlert('Utilisateur créé avec succès. Veuillez attendre qu\'un administrateur valide votre inscription.');
        }

        register(loginCredentials).then(registeredCallback).catch((error) => {
            setSeverity('error');
            setAlert(error.message);
        });
  };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Inscription
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        autoComplete="given-name"
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="Prénom"
                        autoFocus
                        margin="normal"
                    />
                    <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Nom"
                        name="lastName"
                        autoComplete="family-name"
                        margin="normal"
                    />
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Adresse email"
                        name="email"
                        autoComplete="email"
                        margin="normal"
                    />
                    <TextField
                        required
                        fullWidth
                        name="password"
                        label="Mot de passe"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        margin="normal"
                    />
                    <TextField
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirmer le mot de passe"
                        type="password"
                        id="confirm-password"
                        autoComplete="new-password"
                        margin="normal"
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        S'inscrire
                    </Button>

                    { alert && (
                        <Alert severity={severity} sx={{ mb: 2 }}>{alert}</Alert>
                    )}

                    <Grid container justifyContent="center">
                        <Grid item>
                            <Link component={RouterLink} to="/login" variant="body2">
                                Vous avez déjà un compte ? Se connecter
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
        </Container>
    );
}
