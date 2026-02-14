import React from 'react';
import { Box, Paper, Typography, useTheme, useMediaQuery, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Copyright from './Copyright';
import LavenderLogo from '../common/LavenderLogo';

interface AuthLayoutProps {
    children: React.ReactNode;
    maxWidth?: number;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, maxWidth = 420 }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(145deg, ${theme.palette.background.default} 0%, #E8E0D8 40%, ${theme.palette.primary.light}30 100%)`,
            position: 'relative',
            overflow: 'hidden',
            px: { xs: 2, sm: 3 },
            py: { xs: 3, sm: 4 },
        }}>
            <CssBaseline />

            {/* Decorative background circles */}
            <Box sx={{
                position: 'absolute',
                top: '-15%',
                right: '-10%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.primary.main}12 0%, transparent 70%)`,
                pointerEvents: 'none',
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: '-10%',
                left: '-8%',
                width: '350px',
                height: '350px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.secondary.main}10 0%, transparent 70%)`,
                pointerEvents: 'none',
            }} />

            {/* Branding */}
            <Box
                onClick={() => navigate('/')}
                sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    mb: 3, cursor: 'pointer',
                    transition: 'opacity 0.2s',
                    '&:hover': { opacity: 0.7 },
                }}
            >
                <LavenderLogo sx={{ fontSize: 32 }} />
                <Typography variant="h5" sx={{
                    fontWeight: 700, color: theme.palette.primary.dark,
                    letterSpacing: 0.5,
                }}>
                    Remuzat
                </Typography>
            </Box>

            {/* Card */}
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: isMobile ? '100%' : maxWidth,
                    p: { xs: 3, sm: 4 },
                    borderRadius: { xs: 3, sm: 4 },
                    bgcolor: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: `0 8px 40px rgba(84,73,65,0.08)`,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {children}
            </Paper>

            {/* Footer */}
            <Box sx={{ mt: 3, position: 'relative', zIndex: 1 }}>
                <Copyright />
            </Box>
        </Box>
    );
};

export default AuthLayout;
