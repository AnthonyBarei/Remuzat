// Ract
import * as React from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom";
// MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
//Components
import LogoutButton from './LogoutButton';
// Auth
import { useAuth } from '../../../context/hooks/useAuth';
// Theme
import { ColorModeContext } from '../../../context/theme';

const pagesUser = {'Players': '/players'};
const pagesAdmin = {'Players': '/players', 'Users': '/users'};
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const ResponsiveAppBar = (props) => {
    // Theme
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    const lightAppBar = { backgroundColor: "white", color: "#666666", zIndex: (theme) => theme.zIndex.drawer + 1, };
    const darkAppBar = { zIndex: (theme) => theme.zIndex.drawer + 1, }
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
        <AppBar position="fixed" sx={theme.palette.mode === 'light' ? lightAppBar : darkAppBar}>
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

            {theme.palette.mode === 'light' ? (
                <Box component="img" sx={{ height: 50, mr: 10, cursor: 'pointer'}} alt="Logo" src="/images/M-Broadcast-Dark-HD.png" onClick={handleLogoClick}/>
            ) : (
                <Box component="img" sx={{ height: 50, mr: 10, cursor: 'pointer'}} alt="Logo" src="/images/M-Broadcast-White-HD.png" onClick={handleLogoClick}/>
            )}

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {Object.entries(pages).map(([name, link]) => (
                <Button
                    component={Link}
                    to={link}
                    key={name}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'text.secondary', display: 'block' }}
                >
                    {name}
                </Button>
                ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                    {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>

                <LogoutButton/>
            </Box>

        </Toolbar>
      </AppBar>
    );
};
export default ResponsiveAppBar;
