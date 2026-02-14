import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    IconButton, 
    Box, 
    Menu, 
    MenuItem, 
    ListItemIcon, 
    ListItemText,
    Avatar,
    Typography,
    Divider
} from "@mui/material";
import {
    Logout,
    PersonOutline,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../../context/hooks/useAuth';

function UserMenu() {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const { logout, user } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        handleMenuClose();

        const logoutConfig = {
            headers: { 'Authorization': 'Bearer ' + user.token },
        };

        const logoutCallback = () => {
            let {from} = location.state || {from: {pathname: '/login'}}
            navigate(from, { replace: true });
        }

        logout(logoutConfig).then(logoutCallback).catch(logoutCallback);
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate('/profile');
    };

    const open = Boolean(anchorEl);
    const initials = user?.name?.charAt(0)?.toUpperCase() || 'U';

    return (
        <React.Fragment>
            <Box>
                <IconButton
                    onClick={handleMenuOpen}
                    sx={{
                        p: 0.5,
                        '&:hover': { bgcolor: 'transparent' },
                    }}
                    disableRipple
                >
                    <Avatar sx={{
                        width: 36,
                        height: 36,
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                        color: '#fff',
                        transition: 'box-shadow 0.2s ease',
                        boxShadow: open 
                            ? `0 0 0 2.5px ${theme.palette.primary.main}40`
                            : '0 1px 4px rgba(84,73,65,0.12)',
                        '&:hover': {
                            boxShadow: `0 0 0 2.5px ${theme.palette.primary.main}40`,
                        },
                    }}>
                        {initials}
                    </Avatar>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{
                        sx: {
                            mt: 1,
                            minWidth: 220,
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: '0 8px 30px rgba(84,73,65,0.12)',
                        }
                    }}
                >
                    {/* User info header */}
                    <Box sx={{ px: 2, py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{
                                width: 40, height: 40,
                                background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                                color: '#fff',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                            }}>
                                {initials}
                            </Avatar>
                            <Box sx={{ overflow: 'hidden' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.3 }} noWrap>
                                    {user?.name || 'Utilisateur'}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.2 }} noWrap>
                                    {user?.email || ''}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 0.5 }} />

                    <MenuItem onClick={handleProfile} sx={{ py: 1.2, px: 2, mx: 0.5, borderRadius: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                            <PersonOutline fontSize="small" sx={{ color: 'text.secondary' }} />
                        </ListItemIcon>
                        <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}>
                            Mon Profil
                        </ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ 
                        py: 1.2, px: 2, mx: 0.5, borderRadius: 1.5,
                        '&:hover': { bgcolor: `${theme.palette.error.main}08`, color: 'error.main' }
                    }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                            <Logout fontSize="small" sx={{ color: 'inherit' }} />
                        </ListItemIcon>
                        <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}>
                            Déconnexion
                        </ListItemText>
                    </MenuItem>
                </Menu>
            </Box>
        </React.Fragment>
    )
}

export default UserMenu
