// React
import * as React from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom";
// MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// Components
import UserMenu from './LogoutButton';
import LavenderLogo from '../../common/LavenderLogo';
// Auth
import { useAuth } from '../../../context/hooks/useAuth';

const pagesUser = {};
const pagesAdmin = {};

const ResponsiveAppBar = (props) => {
    const theme = useMuiTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAdmin, logout } = useAuth();
    const pages = isAdmin ? pagesAdmin : pagesUser;
    const showAdminButton = isAdmin || user?.is_admin || user?.role === 'admin' || user?.role === 'super_admin';

    const handleLogoClick = () => {
        let {from} = location.state || {from: {pathname: '/'}}
        navigate(from, { replace: true });
    };

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    const handleMobileProfile = () => {
        toggleMobileMenu();
        navigate('/profile');
    };

    const handleMobileLogout = (e) => {
        e.preventDefault();
        toggleMobileMenu();
        const logoutConfig = { headers: { 'Authorization': 'Bearer ' + user?.token } };
        const cb = () => navigate('/login', { replace: true });
        logout(logoutConfig).then(cb).catch(cb);
    };

    const menuItemSx = {
        px: 2, py: 1.2, mx: 1.5, my: 0.3, borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': { bgcolor: `${theme.palette.primary.main}12` },
    };

    const initials = user?.name?.charAt(0)?.toUpperCase() || 'U';

    return (
        <>
            <AppBar position="fixed" elevation={0} sx={{ 
                zIndex: (t) => t.zIndex.drawer + 1,
                bgcolor: 'rgba(255,255,255,0.92)', 
                backdropFilter: 'blur(12px)',
                borderBottom: `1px solid ${theme.palette.divider}`,
                color: 'text.primary',
            }}>
                <Toolbar sx={{
                    display: 'flex', justifyContent: 'space-between',
                    minHeight: { xs: 56, sm: 64 },
                    px: { xs: 1.5, sm: 2 },
                }}>
                    {/* Logo */}
                    <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer' }}
                        onClick={handleLogoClick}
                    >
                        <LavenderLogo sx={{ fontSize: 28 }} />
                        <Typography variant="h6" sx={{
                            fontWeight: 700, letterSpacing: 0.3,
                            color: theme.palette.primary.dark,
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                        }}>
                            Rémuzat
                        </Typography>
                    </Box>

                    {/* Desktop navigation */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
                        {Object.entries(pages).map(([name, link]) => (
                            <Button
                                component={Link} to={link} key={name}
                                sx={{
                                    color: 'text.primary', fontWeight: 500, fontSize: '0.88rem',
                                    borderRadius: 2, mx: 0.5, px: 2,
                                    '&:hover': { bgcolor: `${theme.palette.primary.main}10`, color: 'primary.dark' },
                                }}
                            >
                                {name}
                            </Button>
                        ))}
                    </Box>

                    {/* Desktop actions */}
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                        {showAdminButton && (
                            <Button
                                variant="outlined" size="small"
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
                        <UserMenu />
                    </Box>

                    {/* Mobile: hamburger only */}
                    <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center' }}>
                        <IconButton onClick={toggleMobileMenu} sx={{ color: theme.palette.primary.dark }}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile drawer */}
            <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={toggleMobileMenu}
                PaperProps={{
                    sx: {
                        width: 300, bgcolor: '#FAF8F5',
                        borderLeft: 'none',
                        boxShadow: '-4px 0 24px rgba(84,73,65,0.1)',
                    }
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Header */}
                    <Box sx={{ 
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                        px: 2.5, pt: 2, pb: 2.5,
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <LavenderLogo sx={{ fontSize: 24, filter: 'brightness(1.3)' }} />
                                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 0.3, fontSize: '1rem' }}>
                                    Rémuzat
                                </Typography>
                            </Box>
                            <IconButton 
                                onClick={toggleMobileMenu} size="small"
                                sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        {/* User info card */}
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
                                    {user?.name || 'Utilisateur'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.2 }} noWrap>
                                    {user?.email || ''}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Menu content */}
                    <Box sx={{ flex: 1, pt: 1.5, pb: 1, overflowY: 'auto' }}>
                        {Object.keys(pages).length > 0 && (
                            <>
                                <Typography variant="overline" sx={{ px: 3, color: 'text.secondary', fontSize: '0.6rem', letterSpacing: 1.5 }}>
                                    Navigation
                                </Typography>
                                <List disablePadding sx={{ mb: 0.5 }}>
                                    {Object.entries(pages).map(([name, link]) => (
                                        <ListItem key={name} disablePadding>
                                            <ListItemButton component={Link} to={link} onClick={toggleMobileMenu} sx={menuItemSx}>
                                                <ListItemText primary={name} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.88rem' }} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                                <Divider sx={{ mx: 2.5, my: 1 }} />
                            </>
                        )}

                        <Typography variant="overline" sx={{ px: 3, color: 'text.secondary', fontSize: '0.6rem', letterSpacing: 1.5 }}>
                            Mon espace
                        </Typography>
                        <List disablePadding>
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleMobileProfile} sx={menuItemSx}>
                                    <ListItemIcon sx={{ minWidth: 34, color: 'text.secondary' }}>
                                        <PersonOutlineIcon sx={{ fontSize: 20 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Mon Profil" primaryTypographyProps={{ fontWeight: 500, fontSize: '0.88rem' }} />
                                </ListItemButton>
                            </ListItem>
                            {showAdminButton && (
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => { window.open('/admin', '_blank'); toggleMobileMenu(); }} sx={menuItemSx}>
                                        <ListItemIcon sx={{ minWidth: 34, color: theme.palette.secondary.dark }}>
                                            <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 20 }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Administration" primaryTypographyProps={{ fontWeight: 500, fontSize: '0.88rem', color: theme.palette.secondary.dark }} />
                                    </ListItemButton>
                                </ListItem>
                            )}
                        </List>
                    </Box>

                    {/* Footer logout */}
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
                </Box>
            </Drawer>
        </>
    );
};
export default ResponsiveAppBar;
