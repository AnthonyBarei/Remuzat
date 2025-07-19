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
import UserMenu from './LogoutButton';
// Auth
import { useAuth } from '../../../context/hooks/useAuth';

const pagesUser = {};
const pagesAdmin = {};

const ResponsiveAppBar = (props) => {
    // Theme
    const muiTheme = useMuiTheme();
    
    // Nav
    const location = useLocation();
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    // Auth
    const { user, isAdmin } = useAuth();
    const pages = isAdmin ? pagesAdmin : pagesUser;

    // Debug admin status
    console.log('Navbar - isAdmin:', isAdmin, 'user:', user);

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
            bgcolor: 'rgba(255,255,255,0.95)', 
            backdropFilter: 'blur(10px)',
            color: 'text.primary',
            boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
        }}>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={props.handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' }, color: 'primary.main' }}
                >
                    <MenuIcon />
                </IconButton>

                <Box sx={{ 
                    fontWeight: 700, 
                    fontSize: 24, 
                    color: 'primary.main', 
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
                                color: 'primary.main',
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

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {(isAdmin || user?.is_admin || user?.role === 'admin' || user?.role === 'super_admin') && (
                        <Button
                            variant="outlined"
                            onClick={() => window.open('/admin', '_blank')}
                            sx={{
                                borderColor: 'secondary.main',
                                color: 'secondary.main',
                                fontWeight: 600,
                                borderRadius: 2,
                                '&:hover': { 
                                    bgcolor: 'secondary.main',
                                    color: 'white'
                                }
                            }}
                        >
                            Admin
                        </Button>
                    )}
                    <UserMenu />
                </Box>
            </Toolbar>
        </AppBar>
    );
};
export default ResponsiveAppBar;
