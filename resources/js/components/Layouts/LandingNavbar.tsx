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
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Avatar,
    Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/hooks/useAuth';
import LavenderLogo from '../common/LavenderLogo';
import UserMenu from './Appbar/LogoutButton.jsx';

const LandingNavbar: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { authed, isAdmin, logout, user } = useAuth();

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const scrollToSection = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    const navItems = [
        { label: 'Accueil', icon: <HomeOutlinedIcon sx={{ fontSize: 20 }} />, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { label: 'Activités', icon: <ExploreOutlinedIcon sx={{ fontSize: 20 }} />, action: () => scrollToSection('activities') },
    ];

    const handleMobileLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        setMobileOpen(false);
        const logoutConfig = { headers: { 'Authorization': 'Bearer ' + (user as any)?.token } };
        const cb = () => navigate('/login', { replace: true });
        logout(logoutConfig).then(cb).catch(cb);
    };

    const menuItemSx = {
        px: 2, py: 1.2, mx: 1.5, my: 0.3, borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': { bgcolor: `${theme.palette.primary.main}12` },
    };

    const initials = (user as any)?.name?.charAt(0)?.toUpperCase() || 'U';

    // ====== LOGO ======
    const Logo = ({ white = false }: { white?: boolean }) => (
        <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <LavenderLogo sx={{ fontSize: 28 }} />
            <Typography variant="h6" sx={{
                fontWeight: 700, letterSpacing: 0.3,
                color: white ? '#fff' : theme.palette.primary.dark,
                fontSize: '1.1rem',
            }}>
                Rémuzat
            </Typography>
        </Box>
    );

    // ====== DRAWER ======
    const drawer = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <Box sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                px: 2.5, pt: 2, pb: authed ? 2.5 : 2,
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: authed ? 2 : 0 }}>
                    <Logo white />
                    <IconButton
                        onClick={handleDrawerToggle}
                        sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                {authed && (
                    <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 1.5,
                        bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 2,
                        px: 1.5, py: 1.2, backdropFilter: 'blur(8px)',
                    }}>
                        <Avatar sx={{
                            bgcolor: 'rgba(255,255,255,0.9)', color: theme.palette.primary.dark,
                            width: 36, height: 36, fontSize: '0.9rem', fontWeight: 700,
                        }}>
                            {initials}
                        </Avatar>
                        <Box sx={{ overflow: 'hidden' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3, color: '#fff' }} noWrap>
                                {(user as any)?.name || 'Utilisateur'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.2 }} noWrap>
                                {(user as any)?.email || ''}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, pt: 1.5, pb: 1, overflowY: 'auto' }}>
                <Typography variant="overline" sx={{ px: 3, color: 'text.secondary', fontSize: '0.6rem', letterSpacing: 1.5 }}>
                    Navigation
                </Typography>
                <List disablePadding sx={{ mb: 0.5 }}>
                    {navItems.map((item) => (
                        <ListItem key={item.label} disablePadding>
                            <ListItemButton onClick={() => { item.action(); handleDrawerToggle(); }} sx={menuItemSx}>
                                <ListItemIcon sx={{ minWidth: 34, color: 'text.secondary' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.88rem' }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ mx: 2.5, my: 1 }} />

                {!authed ? (
                    <Box sx={{ px: 2.5, pt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button
                            variant="contained" fullWidth
                            startIcon={<LoginOutlinedIcon />}
                            onClick={() => { navigate('/login'); handleDrawerToggle(); }}
                            sx={{
                                bgcolor: 'primary.main', color: '#fff', py: 1.2, fontWeight: 600,
                                '&:hover': { bgcolor: 'primary.dark' },
                            }}
                        >
                            Se connecter
                        </Button>
                        <Button
                            variant="outlined" fullWidth
                            startIcon={<PersonAddOutlinedIcon />}
                            onClick={() => { navigate('/signup'); handleDrawerToggle(); }}
                            sx={{
                                borderColor: theme.palette.divider, color: 'text.primary',
                                py: 1.2, fontWeight: 600,
                                '&:hover': { bgcolor: `${theme.palette.primary.main}08`, borderColor: 'primary.main' },
                            }}
                        >
                            S'inscrire
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Typography variant="overline" sx={{ px: 3, color: 'text.secondary', fontSize: '0.6rem', letterSpacing: 1.5 }}>
                            Mon espace
                        </Typography>
                        <List disablePadding>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => { navigate('/reservation'); handleDrawerToggle(); }} sx={menuItemSx}>
                                    <ListItemIcon sx={{ minWidth: 34, color: theme.palette.primary.dark }}>
                                        <CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Réserver" primaryTypographyProps={{ fontWeight: 500, fontSize: '0.88rem' }} />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => { navigate('/profile'); handleDrawerToggle(); }} sx={menuItemSx}>
                                    <ListItemIcon sx={{ minWidth: 34, color: 'text.secondary' }}>
                                        <PersonOutlineIcon sx={{ fontSize: 20 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Mon Profil" primaryTypographyProps={{ fontWeight: 500, fontSize: '0.88rem' }} />
                                </ListItemButton>
                            </ListItem>
                            {isAdmin && (
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => { window.open('/admin', '_blank'); handleDrawerToggle(); }} sx={menuItemSx}>
                                        <ListItemIcon sx={{ minWidth: 34, color: theme.palette.secondary.dark }}>
                                            <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 20 }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Administration" primaryTypographyProps={{ fontWeight: 500, fontSize: '0.88rem', color: theme.palette.secondary.dark }} />
                                    </ListItemButton>
                                </ListItem>
                            )}
                        </List>
                    </>
                )}
            </Box>

            {/* Footer logout */}
            {authed && (
                <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
                    <Button
                        fullWidth variant="text"
                        startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
                        onClick={handleMobileLogout}
                        sx={{
                            color: 'text.secondary', fontWeight: 500, fontSize: '0.85rem',
                            py: 1, borderRadius: 2, justifyContent: 'flex-start', px: 1.5,
                            '&:hover': { bgcolor: `${theme.palette.error.main}08`, color: 'error.main' },
                        }}
                    >
                        Déconnexion
                    </Button>
                </Box>
            )}
        </Box>
    );

    // ====== APPBAR ======
    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    bgcolor: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: 'text.primary',
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 56, md: 64 }, px: { xs: 0 } }}>
                        <Logo />

                        {isMobile ? (
                            <IconButton onClick={handleDrawerToggle} sx={{ color: theme.palette.primary.dark }}>
                                <MenuIcon />
                            </IconButton>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {/* Nav links */}
                                {navItems.map((item) => (
                                    <Button
                                        key={item.label}
                                        onClick={item.action}
                                        sx={{
                                            color: 'text.primary', fontWeight: 500, fontSize: '0.88rem',
                                            borderRadius: 2, px: 2,
                                            '&:hover': { bgcolor: `${theme.palette.primary.main}10`, color: 'primary.dark' },
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}

                                <Box sx={{ width: '1px', height: 24, bgcolor: theme.palette.divider, mx: 1 }} />

                                {/* Auth buttons */}
                                {!authed ? (
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="text"
                                            onClick={() => navigate('/login')}
                                            sx={{
                                                color: 'text.primary', fontWeight: 500, fontSize: '0.88rem',
                                                borderRadius: 2, px: 2,
                                                '&:hover': { bgcolor: `${theme.palette.primary.main}10` },
                                            }}
                                        >
                                            Se connecter
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() => navigate('/signup')}
                                            sx={{
                                                bgcolor: 'primary.main', color: '#fff', fontWeight: 600,
                                                fontSize: '0.88rem', borderRadius: 2, px: 2.5,
                                                boxShadow: 'none',
                                                '&:hover': { bgcolor: 'primary.dark', boxShadow: `0 2px 8px ${theme.palette.primary.main}40` },
                                            }}
                                        >
                                            S'inscrire
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} />}
                                            onClick={() => navigate('/reservation')}
                                            sx={{
                                                bgcolor: 'primary.main', color: '#fff', fontWeight: 600,
                                                fontSize: '0.88rem', borderRadius: 2, px: 2.5,
                                                boxShadow: 'none',
                                                '&:hover': { bgcolor: 'primary.dark', boxShadow: `0 2px 8px ${theme.palette.primary.main}40` },
                                            }}
                                        >
                                            Réserver
                                        </Button>
                                        {isAdmin && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => window.open('/admin', '_blank')}
                                                sx={{
                                                    borderColor: theme.palette.divider, color: 'text.secondary',
                                                    fontWeight: 500, fontSize: '0.82rem', borderRadius: 2,
                                                    '&:hover': { borderColor: 'secondary.main', color: 'secondary.dark', bgcolor: `${theme.palette.secondary.main}08` },
                                                }}
                                            >
                                                Admin
                                            </Button>
                                        )}

                                        {/* User avatar with dropdown menu */}
                                        <UserMenu />
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                variant="temporary"
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: 300, bgcolor: '#FAF8F5',
                        borderLeft: 'none',
                        boxShadow: '-4px 0 24px rgba(84,73,65,0.1)',
                    },
                }}
            >
                {drawer}
            </Drawer>

            <Toolbar />
        </>
    );
};

export default LandingNavbar;
