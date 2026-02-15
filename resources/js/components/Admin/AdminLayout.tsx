import React, { useState, useRef, useEffect } from 'react';
import {
    Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton,
    ListItem, ListItemButton, ListItemIcon, ListItemText, Container,
    useTheme, useMediaQuery, Avatar, BottomNavigation, BottomNavigationAction,
    Paper, SwipeableDrawer
} from '@mui/material';
import {
    Menu as MenuIcon, DashboardOutlined, BookOnlineOutlined,
    PeopleOutlined, ChevronLeft, ArrowBack
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutButton from '../Layouts/Appbar/LogoutButton.jsx';
import LavenderLogo from '../common/LavenderLogo';
import { useAuth } from '../../context/hooks/useAuth';

const drawerWidth = 260;

const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardOutlined />, path: '/admin' },
    { text: 'Réservations', icon: <BookOnlineOutlined />, path: '/admin/reservations' },
    { text: 'Utilisateurs', icon: <PeopleOutlined />, path: '/admin/users' },
];

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [open, setOpen] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const drawerRef = useRef<HTMLDivElement>(null);
    const { authed, isAdmin, loading, user } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!authed) { navigate('/login', { state: { from: location } }); return; }
            if (!isAdmin) { navigate('/reservation'); return; }
        }
    }, [authed, isAdmin, loading, navigate, location]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: theme.palette.background.default }}>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>Chargement...</Typography>
            </Box>
        );
    }

    if (!authed || !isAdmin) return null;

    useEffect(() => {
        setOpen(!isMobile);
    }, [isMobile]);

    const handleDrawerToggle = () => setOpen(!open);

    const initials = (user as any)?.name?.charAt(0)?.toUpperCase() || 'A';

    const drawer = (
        <Box ref={drawerRef} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Logo header */}
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                px: 2.5, py: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer' }}
                    onClick={() => navigate('/admin')}
                >
                    <LavenderLogo sx={{ fontSize: 24 }} />
                    <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.95rem' }}>
                        Remuzat
                    </Typography>
                    <Typography sx={{
                        fontSize: '0.6rem', fontWeight: 600, color: theme.palette.primary.dark,
                        bgcolor: `${theme.palette.primary.main}14`, px: 0.8, py: 0.2,
                        borderRadius: 1, ml: 0.25,
                    }}>
                        Admin
                    </Typography>
                </Box>
                {isMobile && (
                    <IconButton onClick={handleDrawerToggle} size="small" sx={{ color: 'text.secondary' }}>
                        <ChevronLeft fontSize="small" />
                    </IconButton>
                )}
            </Box>

            {/* Navigation */}
            <Box sx={{ flex: 1, pt: 1.5, px: 1 }}>
                <Typography variant="overline" sx={{
                    px: 1.5, color: 'text.secondary', fontSize: '0.6rem', letterSpacing: 1.5,
                }}>
                    Menu
                </Typography>
                <List disablePadding sx={{ mt: 0.5 }}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <ListItem key={item.text} disablePadding sx={{ mb: 0.25 }}>
                                <ListItemButton
                                    onClick={() => { navigate(item.path); if (isMobile) setOpen(false); }}
                                    sx={{
                                        borderRadius: 2, py: 1, px: 1.5,
                                        bgcolor: isActive ? `${theme.palette.primary.main}14` : 'transparent',
                                        color: isActive ? theme.palette.primary.dark : 'text.primary',
                                        '&:hover': {
                                            bgcolor: isActive ? `${theme.palette.primary.main}18` : `${theme.palette.primary.main}08`,
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{
                                        minWidth: 36, color: isActive ? theme.palette.primary.dark : 'text.secondary',
                                    }}>
                                        {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontSize: '0.85rem',
                                            fontWeight: isActive ? 600 : 500,
                                        }}
                                    />
                                    {isActive && (
                                        <Box sx={{
                                            width: 4, height: 20, borderRadius: 2,
                                            bgcolor: theme.palette.primary.main,
                                        }} />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            {/* Footer: back to app */}
            <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 1.5 }}>
                <ListItemButton
                    onClick={() => navigate('/reservation')}
                    sx={{
                        borderRadius: 2, py: 1, px: 1.5,
                        '&:hover': { bgcolor: `${theme.palette.primary.main}08` },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                        <ArrowBack sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Retour à l'app"
                        primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 500, color: 'text.secondary' }}
                    />
                </ListItemButton>
            </Box>
        </Box>
    );

    // Get current bottom nav value from path
    const currentNavValue = menuItems.findIndex(item => item.path === location.pathname);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            {/* AppBar */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { md: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
                    ml: { md: open ? `${drawerWidth}px` : 0 },
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    bgcolor: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: 'text.primary',
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 52, md: 60 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Hide hamburger on mobile since we have bottom nav */}
                        {!isMobile && (
                            <IconButton onClick={handleDrawerToggle} sx={{ color: 'text.secondary' }}>
                                <MenuIcon sx={{ fontSize: 22 }} />
                            </IconButton>
                        )}
                        {isMobile && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, pl: 0.5 }}>
                                <LavenderLogo sx={{ fontSize: 20 }} />
                                <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.88rem' }}>
                                    Remuzat
                                </Typography>
                                <Typography sx={{
                                    fontSize: '0.55rem', fontWeight: 600, color: theme.palette.primary.dark,
                                    bgcolor: `${theme.palette.primary.main}14`, px: 0.7, py: 0.15,
                                    borderRadius: 0.75,
                                }}>
                                    Admin
                                </Typography>
                            </Box>
                        )}
                        {!isMobile && (
                            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                {menuItems.find(item => item.path === location.pathname)?.text || 'Administration'}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {isMobile && (
                            <IconButton
                                onClick={() => navigate('/reservation')}
                                size="small"
                                sx={{ color: 'text.secondary', mr: 0.5 }}
                            >
                                <ArrowBack sx={{ fontSize: 20 }} />
                            </IconButton>
                        )}
                        <LogoutButton />
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Sidebar - Desktop: persistent drawer, Mobile: swipeable drawer (kept for extra access) */}
            <Box component="nav" sx={{
                width: { md: open ? drawerWidth : 0 }, flexShrink: { md: 0 },
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
            }}>
                {isMobile ? (
                    <SwipeableDrawer
                        open={open}
                        onClose={handleDrawerToggle}
                        onOpen={() => setOpen(true)}
                        disableBackdropTransition
                        disableDiscovery={false}
                        swipeAreaWidth={20}
                        ModalProps={{ keepMounted: true }}
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: drawerWidth, bgcolor: '#fff',
                                borderRight: `1px solid ${theme.palette.divider}`,
                                boxShadow: '4px 0 24px rgba(84,73,65,0.1)',
                            },
                        }}
                    >
                        {drawer}
                    </SwipeableDrawer>
                ) : (
                    <Drawer
                        variant="persistent"
                        open={open}
                        onClose={handleDrawerToggle}
                        ModalProps={{ keepMounted: true, disableAutoFocus: true, disableEnforceFocus: true, disableRestoreFocus: true }}
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: drawerWidth, bgcolor: '#fff',
                                borderRight: `1px solid ${theme.palette.divider}`,
                            },
                        }}
                    >
                        {drawer}
                    </Drawer>
                )}
            </Box>

            {/* Main content */}
            <Box component="main" tabIndex={-1} sx={{
                flexGrow: 1,
                width: { md: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
                mt: { xs: '52px', md: '60px' },
                // Add padding at bottom on mobile for bottom nav
                pb: { xs: '72px', md: 0 },
                outline: 'none',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
            }}>
                <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1.5, sm: 3 } }}>
                    {children}
                </Container>
            </Box>

            {/* Mobile Bottom Navigation */}
            {isMobile && (
                <Paper
                    elevation={0}
                    sx={{
                        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200,
                        borderTop: `1px solid ${theme.palette.divider}`,
                        bgcolor: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(12px)',
                        // Safe area for phones with gesture bars
                        pb: 'env(safe-area-inset-bottom, 0px)',
                    }}
                >
                    <BottomNavigation
                        value={currentNavValue >= 0 ? currentNavValue : 0}
                        onChange={(_, newValue) => {
                            navigate(menuItems[newValue].path);
                        }}
                        showLabels
                        sx={{
                            bgcolor: 'transparent', height: 64,
                            '& .MuiBottomNavigationAction-root': {
                                color: 'text.secondary',
                                minWidth: 0, py: 1,
                                '&.Mui-selected': {
                                    color: theme.palette.primary.dark,
                                },
                            },
                            '& .MuiBottomNavigationAction-label': {
                                fontSize: '0.68rem', fontWeight: 500,
                                mt: 0.25,
                                '&.Mui-selected': {
                                    fontSize: '0.68rem', fontWeight: 700,
                                },
                            },
                        }}
                    >
                        {menuItems.map((item) => (
                            <BottomNavigationAction
                                key={item.text}
                                label={item.text.replace('Tableau de bord', 'Accueil')}
                                icon={React.cloneElement(item.icon, { sx: { fontSize: 24 } })}
                            />
                        ))}
                    </BottomNavigation>
                </Paper>
            )}
        </Box>
    );
};

export default AdminLayout;
