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
    Typography
} from "@mui/material";
import {
    Logout,
    Person,
    Settings,
    AccountCircle
} from '@mui/icons-material';
import { useAuth } from '../../../context/hooks/useAuth';

function UserMenu() {
    const location = useLocation();
    const navigate = useNavigate();
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

    return (
        <React.Fragment>
            <Box>
                <IconButton
                    onClick={handleMenuOpen}
                    sx={{
                        color: 'colors.provencalBlueGrey',
                    }}
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    PaperProps={{
                        sx: {
                            mt: 1,
                            minWidth: 200,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            borderRadius: 2,
                        }
                    }}
                >
                    <MenuItem onClick={handleMenuClose} sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {user?.name || 'Utilisateur'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {user?.email || 'user@example.com'}
                                </Typography>
                            </Box>
                        </Box>
                    </MenuItem>
                    <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
                        <ListItemIcon>
                            <Person fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Mon Profil</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Déconnexion</ListItemText>
                    </MenuItem>
                </Menu>
            </Box>
        </React.Fragment>
    )
}

export default UserMenu
