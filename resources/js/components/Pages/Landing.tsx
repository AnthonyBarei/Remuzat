import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Stack,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Hiking,
    Pool,
    Store,
    Church,
    Login,
    CalendarMonth
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../Layouts/LandingNavbar';

const Landing: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const activities = [
        {
            icon: <Hiking sx={{ fontSize: 32, color: 'success.main' }} />,
            title: 'Randonnées & balades',
            description: 'Explorez les sentiers du Rocher du Caire, un site emblématique où l\'on peut observer les vautours fauves en plein vol.'
        },
        {
            icon: <Pool sx={{ fontSize: 32, color: 'primary.main' }} />,
            title: 'Baignade & détente',
            description: 'Profitez des eaux fraîches de l\'Oule ou des petites rivières des environs.'
        },
        {
            icon: <Store sx={{ fontSize: 32, color: 'secondary.main' }} />,
            title: 'Marchés & terroir',
            description: 'Dégustez les spécialités locales : miel, fromage de chèvre, huile d\'olive, et bien sûr, les vins de la région.'
        },
        {
            icon: <Church sx={{ fontSize: 32, color: 'info.main' }} />,
            title: 'Patrimoine & culture',
            description: 'Visitez l\'église, les ruelles pittoresques, ou partez à la découverte des villages voisins comme Nyons, Buis-les-Baronnies ou Roussas.'
        }
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <LandingNavbar />
            
            {/* Hero Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.primary.main} 100%)`,
                    color: 'white',
                    py: { xs: 6, md: 10 },
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Container maxWidth="md">
                    <Box textAlign="center">
                        <Typography
                            variant="h2"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                fontSize: { xs: '2.5rem', md: '3.5rem' }
                            }}
                        >
                            🌿 Bienvenue à Remuzat
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                mb: 4,
                                opacity: 0.9,
                                fontWeight: 300,
                                fontSize: { xs: '1.2rem', md: '1.5rem' }
                            }}
                        >
                            Au cœur de la Drôme Provençale
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 6,
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                lineHeight: 1.8,
                                maxWidth: '800px',
                                mx: 'auto'
                            }}
                        >
                            Niché entre les montagnes et les champs de lavande, Remuzat est un petit village typique du sud-est de la France. 
                            Entouré de paysages sauvages et ensoleillés, ce havre de paix est l'endroit idéal pour se ressourcer loin du tumulte des grandes villes.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Activities Section */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
                <Typography
                    variant="h3"
                    component="h2"
                    align="center"
                    sx={{ 
                        mb: 6, 
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: { xs: '1.8rem', md: '2.2rem' }
                    }}
                >
                    🏞️ À découvrir à Remuzat et ses alentours
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                    {activities.map((activity, index) => (
                        <Box
                            key={index}
                            sx={{
                                p: 3,
                                bgcolor: 'paper.main',
                                borderRadius: 2,
                                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                                border: `1px solid ${theme.palette.divider}`,
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                <Box sx={{ mr: 2, mt: 0.5 }}>
                                    {activity.icon}
                                </Box>
                                <Typography 
                                    variant="h6" 
                                    component="h3" 
                                    sx={{ 
                                        fontWeight: 600,
                                        color: 'text.primary'
                                    }}
                                >
                                    {activity.title}
                                </Typography>
                            </Box>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: 'text.secondary',
                                    lineHeight: 1.6
                                }}
                            >
                                {activity.description}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>

            {/* CTA Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.info.main} 100%)`,
                    color: 'white',
                    py: { xs: 6, md: 8 }
                }}
            >
                <Container maxWidth="md">
                    <Box textAlign="center">
                        <Typography 
                            variant="h3" 
                            component="h2" 
                            sx={{ 
                                mb: 3, 
                                fontWeight: 600,
                                fontSize: { xs: '1.8rem', md: '2.2rem' }
                            }}
                        >
                            👋 Espace privé
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                mb: 4, 
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                lineHeight: 1.8,
                                maxWidth: '600px',
                                mx: 'auto'
                            }}
                        >
                            Accédez à votre espace de réservation pour planifier votre séjour à Remuzat. 
                            Réservez vos dates et découvrez toutes les disponibilités en temps réel.
                        </Typography>
                        
                        <Stack 
                            direction={{ xs: 'column', sm: 'row' }} 
                            spacing={2} 
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<Login />}
                                onClick={() => navigate('/login')}
                                sx={{
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    '&:hover': {
                                        bgcolor: 'grey.100'
                                    }
                                }}
                            >
                                Se connecter
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                startIcon={<CalendarMonth />}
                                onClick={() => navigate('/signup')}
                                sx={{
                                    borderColor: 'white',
                                    color: 'white',
                                    '&:hover': {
                                        borderColor: 'grey.100',
                                        bgcolor: 'rgba(255,255,255,0.1)'
                                    }
                                }}
                            >
                                S'inscrire
                            </Button>
                        </Stack>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Landing; 