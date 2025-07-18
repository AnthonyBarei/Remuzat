// React
import * as React from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom";
// MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import { useTheme as useMuiTheme } from '@mui/material/styles';
// Components
import LogoutButton from './LogoutButton';
// Auth
import { useAuth } from '../../../context/hooks/useAuth';

const pagesUser = {'Réservations': '/reservation'};
const pagesAdmin = {'Réservations': '/reservation', 'Utilisateurs': '/users'};

const ResponsiveAppBar = (props) => {
    // Theme
    const muiTheme = useMuiTheme();
    
    // Nav
    const location = useLocation();
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    // Auth
    const { user } = useAuth();
    const pages = user.is_admin ? pagesAdmin : pagesUser;

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogoClick = () => {
        let {from} = location.state || {from: {pathname: '/'}}
        navigate(from, { replace: true });
    };

    return (
        <AppBar position="fixed" sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'white',
            color: 'text.primary',
            boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
        }}>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={props.handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                <Box sx={{ 
                    fontWeight: 700, 
                    fontSize: 24, 
                    color: 'text.primary', 
                    letterSpacing: 1, 
                    cursor: 'pointer', 
                    mr: 6 
                }} onClick={handleLogoClick}>
                    Remuzat
                </Box>

                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {Object.entries(pages).map(([name, link]) => (
                        <Button
                            component={Link}
                            to={link}
                            key={name}
                            onClick={handleCloseNavMenu}
                            sx={{
                                my: 2,
                                color: 'text.secondary',
                                fontWeight: 600,
                                display: 'block',
                                borderRadius: 2,
                                mx: 1,
                                '&:hover': {
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText'
                                }
                            }}
                        >
                            {name}
                        </Button>
                    ))}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LogoutButton label="Déconnexion" />
                </Box>
            </Toolbar>
        </AppBar>
    );
};
export default ResponsiveAppBar;
