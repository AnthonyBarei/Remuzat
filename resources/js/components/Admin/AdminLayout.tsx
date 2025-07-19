import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Container,
    useTheme,
    useMediaQuery,
    Fab
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    BookOnline,
    People,
    Email,
    Settings,
    ChevronLeft,
    Brightness4,
    Brightness7
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutButton from '../Layouts/Appbar/LogoutButton.jsx';

const drawerWidth = 280;

const colors = {
    beigeStone: '#F5F0EB',
    softLavender: '#B9A5C4',
    provencalBlueGrey: '#6D7885',
    lightOliveGreen: '#A6B29F',
    paleTerracotta: '#D8A47F',
    softSunYellow: '#F4C95D',
    discreetPoppyRed: '#D96C57',
    chestnutBrown: '#4A3F35',
};

const menuItems = [
    { text: 'Tableau de bord', icon: <Dashboard />, path: '/admin' },
    { text: 'Réservations', icon: <BookOnline />, path: '/admin/reservations' },
    { text: 'Utilisateurs', icon: <People />, path: '/admin/users' },
    { text: 'Emails', icon: <Email />, path: '/admin/emails' },
    { text: 'Paramètres', icon: <Settings />, path: '/admin/settings' },
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

    // Auto-close drawer on mobile when screen size changes
    useEffect(() => {
        if (isMobile) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, [isMobile]);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    // Handle focus management for accessibility
    useEffect(() => {
        if (!open && isMobile && drawerRef.current) {
            // Remove focus from drawer elements when closed on mobile
            const focusableElements = drawerRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            focusableElements.forEach((element) => {
                (element as HTMLElement).blur();
                (element as HTMLElement).setAttribute('tabindex', '-1');
            });
            
            // Move focus to the main content area
            const mainContent = document.querySelector('main');
            if (mainContent) {
                (mainContent as HTMLElement).focus();
            }
        } else if (open && drawerRef.current) {
            // Restore focusability when drawer is open
            const focusableElements = drawerRef.current.querySelectorAll(
                'button, [href], input, select, textarea'
            );
            focusableElements.forEach((element) => {
                if (element.tagName === 'BUTTON') {
                    (element as HTMLElement).setAttribute('tabindex', '0');
                }
            });
        }
    }, [open, isMobile]);



    const drawer = (
        <Box 
            ref={drawerRef}
            aria-hidden={!open && isMobile}
            sx={{
                ...((!open && isMobile) && {
                    '& *': {
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }
                })
            }}
        >
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                borderBottom: `1px solid ${colors.softLavender}30`
            }}>
                <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    color: colors.chestnutBrown,
                    fontSize: '1.2rem'
                }}>
                    Remuzat Admin
                </Typography>
                <IconButton 
                    onClick={handleDrawerToggle} 
                    sx={{ 
                        color: colors.provencalBlueGrey,
                        transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
                        transition: theme.transitions.create('transform', {
                            duration: theme.transitions.duration.shortest,
                        }),
                    }}
                    tabIndex={open ? 0 : -1}
                >
                    <ChevronLeft />
                </IconButton>
            </Box>
            <Divider sx={{ borderColor: colors.softLavender + '30' }} />
            <List sx={{ pt: 1 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            selected={location.pathname === item.path}
                            tabIndex={open ? 0 : -1}
                            sx={{
                                mx: 1,
                                borderRadius: 2,
                                mb: 0.5,
                                '&.Mui-selected': {
                                    bgcolor: colors.softLavender + '30',
                                    color: colors.chestnutBrown,
                                    '&:hover': {
                                        bgcolor: colors.softLavender + '40',
                                    },
                                },
                                '&:hover': {
                                    bgcolor: colors.beigeStone,
                                },
                            }}
                        >
                            <ListItemIcon sx={{ 
                                color: location.pathname === item.path ? colors.chestnutBrown : colors.provencalBlueGrey,
                                minWidth: 40
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.text} 
                                sx={{ 
                                    '& .MuiListItemText-primary': {
                                        fontWeight: location.pathname === item.path ? 600 : 400,
                                    }
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: colors.beigeStone }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
                    ml: { md: open ? `${drawerWidth}px` : 0 },
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    bgcolor: 'white',
                    color: colors.chestnutBrown,
                    boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
                    borderBottom: `1px solid ${colors.softLavender}20`,
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {menuItems.find(item => item.path === location.pathname)?.text || 'Administration'}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LogoutButton />
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ 
                    width: { md: open ? drawerWidth : 0 }, 
                    flexShrink: { md: 0 },
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Drawer
                    variant={isMobile ? 'temporary' : 'persistent'}
                    open={open}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                        disableAutoFocus: true,
                        disableEnforceFocus: true,
                        disableRestoreFocus: true,
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            bgcolor: 'white',
                            borderRight: `1px solid ${colors.softLavender}20`,
                            boxShadow: '2px 0 20px rgba(0,0,0,0.08)',
                            overflowX: 'hidden',
                        },
                        '& .MuiBackdrop-root': {
                            zIndex: theme.zIndex.drawer - 1,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                tabIndex={-1}
                sx={{
                    flexGrow: 1,
                    width: { md: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
                    mt: '64px',
                    outline: 'none',
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Container maxWidth="xl" sx={{ py: 3 }}>
                    {children}
                </Container>
            </Box>

            {/* Floating Action Button for mobile when drawer is closed */}
            {isMobile && !open && (
                <Fab
                    color="primary"
                    aria-label="open menu"
                    onClick={handleDrawerToggle}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        left: 16,
                        zIndex: theme.zIndex.fab,
                        bgcolor: colors.softLavender,
                        color: colors.chestnutBrown,
                        '&:hover': {
                            bgcolor: colors.softLavender + 'DD',
                        },
                    }}
                >
                    <MenuIcon />
                </Fab>
            )}


        </Box>
    );
};

export default AdminLayout; 