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
            setAlert('User created successfully. Please wait until an administrator validates your inscription.');
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
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                            autoComplete="given-name"
                            name="firstName"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirm-password"
                            autoComplete="new-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    >
                    Sign Up
                    </Button>

                    { alert && (
                    <Alert severity={severity} sx={{ mb: 2 }}>{alert}</Alert>
                    )}

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/login" variant="body2">Already have an account? Sign in</Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
        </Container>
    );
}
