// React
import * as React from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
// MUI
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container, Alert } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// Components
import Copyright from '../../Layouts/Copyright';
// Auth
import { useAuth } from '../../../context/hooks/useAuth';

export default function Login({authenticate}) {
    const location = useLocation();
    const navigate = useNavigate();
    const { authed, login } = useAuth();
    const [alert, setAlert] = React.useState(false);

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
        };

        login(loginCredentials).then(authenticatedCallback).catch((error) => {
            console.log(error.message);
            setAlert(error.message);
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Connexion
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
                    />
                    <TextField 
                        margin="normal" 
                        required 
                        fullWidth 
                        name="password" 
                        label="Mot de passe" 
                        type="password" 
                        id="password" 
                        autoComplete="current-password"
                    />

                    <FormControlLabel 
                        control={<Checkbox value="remember" color="primary" />} 
                        label="Se souvenir de moi"
                        sx={{ mt: 1 }}
                    />

                    {alert && (<Alert severity="error" sx={{ mb: 2, mt: 2 }}>{alert}</Alert>)}

                    <Button 
                        type="submit" 
                        fullWidth 
                        variant="contained" 
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Se connecter
                    </Button>

                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Link component={RouterLink} to="/forgot-password" variant="body2">
                                Mot de passe oublié ?
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
