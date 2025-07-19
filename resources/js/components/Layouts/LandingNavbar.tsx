import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    Container,
    useTheme,
    useMediaQuery,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/hooks/useAuth';
import LogoutButton from './Appbar/LogoutButton.jsx';

const LandingNavbar: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { authed, isAdmin } = useAuth();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const scrollToSection = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (element) {
            const offset = 80; // Account for fixed navbar height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const navItems = [
        { label: 'Accueil', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { label: 'Activités', action: () => scrollToSection('activities') }
    ];

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2, color: 'text.primary' }}>
                Remuzat
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} onClick={item.action}>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
                {!authed ? (
                    <>
                        <ListItem>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => navigate('/login')}
                                sx={{
                                    bgcolor: 'primary.main',
                                    '&:hover': { bgcolor: 'primary.dark' }
                                }}
                            >
                                Se connecter
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => navigate('/signup')}
                                sx={{
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    '&:hover': { 
                                        bgcolor: 'primary.main',
                                        color: 'white'
                                    }
                                }}
                            >
                                S'inscrire
                            </Button>
                        </ListItem>
                    </>
                ) : (
                    <>
                        <ListItem>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => navigate('/reservation')}
                                sx={{
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    '&:hover': { 
                                        bgcolor: 'primary.main',
                                        color: 'white'
                                    }
                                }}
                            >
                                Réserver
                            </Button>
                        </ListItem>
                        {isAdmin && (
                            <ListItem>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => window.open('/admin', '_blank')}
                                    sx={{
                                        borderColor: 'secondary.main',
                                        color: 'secondary.main',
                                        '&:hover': { 
                                            bgcolor: 'secondary.main',
                                            color: 'white'
                                        }
                                    }}
                                >
                                    Admin
                                </Button>
                            </ListItem>
                        )}
                        <ListItem>
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <LogoutButton />
                            </Box>
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar 
                position="fixed" 
                sx={{ 
                    bgcolor: 'rgba(255,255,255,0.95)', 
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
                    color: 'text.primary'
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            Remuzat
                        </Typography>

                        {isMobile ? (
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ color: 'primary.main' }}
                            >
                                <MenuIcon />
                            </IconButton>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {navItems.map((item) => (
                                    <Button
                                        key={item.label}
                                        onClick={item.action}
                                        sx={{
                                            color: 'primary.main',
                                            '&:hover': {
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText'
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                                {!authed ? (
                                    <>
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate('/login')}
                                            sx={{
                                                borderColor: 'primary.main',
                                                color: 'primary.main',
                                                '&:hover': { 
                                                    bgcolor: 'primary.main',
                                                    color: 'white'
                                                }
                                            }}
                                        >
                                            Se connecter
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() => navigate('/signup')}
                                            sx={{
                                                bgcolor: 'primary.main',
                                                '&:hover': { bgcolor: 'primary.dark' }
                                            }}
                                        >
                                            S'inscrire
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="contained"
                                            onClick={() => navigate('/reservation')}
                                            sx={{
                                                bgcolor: 'primary.main',
                                                '&:hover': { bgcolor: 'primary.dark' }
                                            }}
                                        >
                                            Réserver
                                        </Button>
                                        {isAdmin && (
                                            <Button
                                                variant="outlined"
                                                onClick={() => window.open('/admin', '_blank')}
                                                sx={{
                                                    borderColor: 'secondary.main',
                                                    color: 'secondary.main',
                                                    '&:hover': { 
                                                        bgcolor: 'secondary.main',
                                                        color: 'white'
                                                    }
                                                }}
                                            >
                                                Admin
                                            </Button>
                                        )}
                                        <LogoutButton />
                                    </>
                                )}
                            </Box>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: 240,
                        bgcolor: 'background.paper'
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Spacer to prevent content from hiding behind fixed navbar */}
            <Toolbar />
        </>
    );
};

export default LandingNavbar; 