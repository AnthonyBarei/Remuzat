import React, { useState, useRef, useEffect } from 'react';
import {
    Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton,
    ListItem, ListItemButton, ListItemIcon, ListItemText, Container,
    useTheme, useMediaQuery, Avatar
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
                <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 56, md: 60 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <IconButton onClick={handleDrawerToggle} sx={{ color: 'text.secondary' }}>
                            <MenuIcon sx={{ fontSize: 22 }} />
                        </IconButton>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                            {menuItems.find(item => item.path === location.pathname)?.text || 'Administration'}
                        </Typography>
                    </Box>
                    <LogoutButton />
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Box component="nav" sx={{
                width: { md: open ? drawerWidth : 0 }, flexShrink: { md: 0 },
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
            }}>
                <Drawer
                    variant={isMobile ? 'temporary' : 'persistent'}
                    open={open}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true, disableAutoFocus: true, disableEnforceFocus: true, disableRestoreFocus: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: drawerWidth, bgcolor: '#fff',
                            borderRight: `1px solid ${theme.palette.divider}`,
                            boxShadow: isMobile ? '-4px 0 24px rgba(84,73,65,0.1)' : 'none',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main content */}
            <Box component="main" tabIndex={-1} sx={{
                flexGrow: 1,
                width: { md: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
                mt: { xs: '56px', md: '60px' },
                outline: 'none',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
            }}>
                <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
                    {children}
                </Container>
            </Box>
        </Box>
    );
};

export default AdminLayout;
