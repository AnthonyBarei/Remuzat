import React from 'react';
import { Box, Container, Typography, Button, useTheme } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../../Layouts/LandingNavbar';
import Footer from '../../common/Footer';
import LavenderLogo from '../../common/LavenderLogo';

interface LegalLayoutProps {
    title: string;
    lastUpdated: string;
    children: React.ReactNode;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ title, lastUpdated, children }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: theme.palette.background.default }}>
            <LandingNavbar />

            {/* Header */}
            <Box sx={{
                pt: { xs: 10, sm: 12 }, pb: { xs: 4, sm: 5 },
                background: `linear-gradient(160deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.info.main} 100%)`,
            }}>
                <Container maxWidth="md">
                    <Button startIcon={<ArrowBack sx={{ fontSize: 16 }} />} onClick={() => navigate('/')}
                        sx={{
                            color: 'rgba(255,255,255,0.75)', textTransform: 'none', fontWeight: 500,
                            fontSize: '0.82rem', mb: 2, px: 0,
                            '&:hover': { color: '#fff', bgcolor: 'transparent' },
                        }}>
                        Retour à l'accueil
                    </Button>
                    <Typography variant="h3" sx={{
                        fontWeight: 700, color: '#fff',
                        fontSize: { xs: '1.6rem', sm: '2rem' },
                    }}>
                        {title}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', mt: 0.75 }}>
                        Dernière mise à jour : {lastUpdated}
                    </Typography>
                </Container>
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, py: { xs: 4, sm: 5 } }}>
                <Container maxWidth="md">
                    <Box sx={{
                        bgcolor: '#fff', borderRadius: 3, p: { xs: 3, sm: 4 },
                        border: `1px solid ${theme.palette.divider}`,
                        '& h2': {
                            fontWeight: 700, color: theme.palette.text.primary,
                            fontSize: '1.15rem', mt: 3.5, mb: 1.5,
                            '&:first-of-type': { mt: 0 },
                        },
                        '& h3': {
                            fontWeight: 600, color: theme.palette.text.primary,
                            fontSize: '0.95rem', mt: 2.5, mb: 1,
                        },
                        '& p': {
                            color: theme.palette.text.secondary, fontSize: '0.88rem',
                            lineHeight: 1.7, mb: 1.5,
                        },
                        '& ul': {
                            color: theme.palette.text.secondary, fontSize: '0.88rem',
                            lineHeight: 1.8, pl: 2.5, mb: 1.5,
                        },
                        '& li': { mb: 0.5 },
                        '& a': {
                            color: theme.palette.primary.dark, fontWeight: 500,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                        },
                    }}>
                        {children}
                    </Box>
                </Container>
            </Box>

            <Footer />
        </Box>
    );
};

export default LegalLayout;
