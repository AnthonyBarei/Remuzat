import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Stack,
    useTheme,
    useMediaQuery,
    Card,
    CardMedia,
    Grid,
    Chip
} from '@mui/material';
import {
    Hiking,
    Pool,
    Store,
    Church,
    Login,
    CalendarMonth,
    ArrowDownward,
    Landscape,
    WbSunny
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../Layouts/LandingNavbar';
import LavenderLogo from '../common/LavenderLogo';
import Footer from '../common/Footer';
import { useAuth } from '../../context/hooks/useAuth';

const Landing: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const { authed } = useAuth();

    const activities = [
        {
            icon: <Hiking sx={{ fontSize: 28 }} />,
            color: theme.palette.success.main,
            title: 'Randonnées & balades',
            description: 'Explorez les sentiers du Rocher du Caire, un site emblématique où l\'on peut observer les vautours fauves en plein vol. Des sentiers balisés pour tous les niveaux vous attendent.'
        },
        {
            icon: <Pool sx={{ fontSize: 28 }} />,
            color: theme.palette.primary.main,
            title: 'Baignade & détente',
            description: 'Profitez des eaux fraîches et cristallines de l\'Ouvèze ou des petites rivières secrètes des environs. L\'été, les berges ombragées deviennent un havre de fraîcheur.'
        },
        {
            icon: <Store sx={{ fontSize: 28 }} />,
            color: theme.palette.secondary.main,
            title: 'Marchés & terroir',
            description: 'Dégustez les spécialités locales sur les marchés provençaux : miel de lavande, fromage de chèvre, huile d\'olive, et les vins des Baronnies.'
        },
        {
            icon: <Church sx={{ fontSize: 28 }} />,
            color: theme.palette.info.main,
            title: 'Patrimoine & culture',
            description: 'Flânez dans les ruelles pittoresques, visitez l\'église romane, ou partez à la découverte des villages voisins comme Nyons, Buis-les-Baronnies ou Roussas.'
        }
    ];

    const galleryImages = [
        { src: '/images/remuzat1.webp', alt: 'La maison', title: 'La maison familiale' },
        { src: '/images/remuzat2.webp', alt: 'Place du village de Remuzat au soir', title: 'Place du village au crépuscule' },
        { src: '/images/remuzat3.webp', alt: 'Paysage de Remuzat', title: 'Panorama sur les Baronnies' }
    ];

    const scrollToGallery = () => {
        const el = document.getElementById('gallery');
        if (el) {
            const offset = 80;
            window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <LandingNavbar />
            
            {/* ═══════════════════ HERO ═══════════════════ */}
            <Box sx={{
                background: `linear-gradient(160deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 40%, ${theme.palette.info.main} 100%)`,
                color: 'white',
                py: { xs: 8, sm: 10, md: 14 },
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative elements */}
                <Box sx={{
                    position: 'absolute', top: '-20%', right: '-10%',
                    width: '50%', height: '120%', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <Box sx={{
                    position: 'absolute', bottom: '-30%', left: '-15%',
                    width: '60%', height: '80%', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box textAlign="center">
                        <Box sx={{ display: 'inline-flex', mb: 2 }}>
                            <Chip
                                icon={<WbSunny sx={{ fontSize: 16, color: '#fff !important' }} />}
                                label="Drôme Provençale"
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.15)', color: '#fff',
                                    backdropFilter: 'blur(4px)',
                                    fontWeight: 500, fontSize: '0.8rem',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                }}
                            />
                        </Box>
                        <Typography
                            variant="h2" component="h1"
                            sx={{
                                fontWeight: 700, mb: 2,
                                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' },
                                lineHeight: 1.1,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Bienvenue à Rémuzat
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                mb: 3, opacity: 0.9, fontWeight: 300,
                                fontSize: { xs: '1.05rem', sm: '1.25rem', md: '1.5rem' },
                                letterSpacing: '0.02em',
                            }}
                        >
                            Un havre de paix entre montagnes et lavande
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 5, fontSize: { xs: '0.95rem', md: '1.05rem' },
                                lineHeight: 1.8, maxWidth: '650px', mx: 'auto',
                                opacity: 0.85,
                            }}
                        >
                            Niché au creux des Baronnies provençales, Rémuzat est un village typique du sud de la Drôme.
                            Ici, le temps ralentit — entre sentiers sauvages, chants de cigales et ciels étoilés.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={scrollToGallery}
                            endIcon={<ArrowDownward sx={{ fontSize: 18 }} />}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.18)', color: '#fff',
                                backdropFilter: 'blur(4px)',
                                fontWeight: 600, fontSize: '0.9rem',
                                px: 3.5, py: 1.2, borderRadius: 3,
                                border: '1px solid rgba(255,255,255,0.25)',
                                boxShadow: 'none',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.28)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                },
                            }}
                        >
                            Découvrir
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* ═══════════════════ GALLERY ═══════════════════ */}
            <Box
                id="gallery"
                sx={{
                    py: { xs: 5, sm: 7, md: 10 },
                    bgcolor: '#fff',
                }}
            >
                <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                    <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 5, md: 6 } }}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: 'primary.main', fontWeight: 700,
                                letterSpacing: 2, fontSize: '0.75rem',
                            }}
                        >
                            En images
                        </Typography>
                        <Typography
                            variant="h3" component="h2"
                            sx={{
                                fontWeight: 700, color: 'text.primary',
                                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.4rem' },
                                mt: 0.5,
                            }}
                        >
                            Découvrez notre coin de paradis
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.secondary', mt: 1.5,
                                maxWidth: 520, mx: 'auto',
                                fontSize: { xs: '0.88rem', sm: '0.95rem' },
                                lineHeight: 1.7,
                            }}
                        >
                            Des paysages à couper le souffle, un village authentique et une nature préservée.
                        </Typography>
                    </Box>

                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        {galleryImages.map((image, index) => (
                            <Grid item xs={12} sm={4} key={index}>
                                <Card sx={{
                                    height: { xs: 220, sm: 260, md: 340 },
                                    overflow: 'hidden', borderRadius: 3,
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    boxShadow: '0 4px 20px rgba(84,73,65,0.08)',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 30px rgba(84,73,65,0.14)',
                                    }
                                }}>
                                    <CardMedia
                                        component="img" image={image.src} alt={image.alt}
                                        sx={{ height: '100%', objectFit: 'cover' }}
                                    />
                                </Card>
                                <Typography
                                    variant="body2" align="center"
                                    sx={{ mt: 1.5, color: 'text.secondary', fontWeight: 500, fontSize: '0.82rem' }}
                                >
                                    {image.title}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ═══════════════════ ACTIVITIES ═══════════════════ */}
            <Box
                id="activities"
                sx={{
                    py: { xs: 5, sm: 7, md: 10 },
                    bgcolor: theme.palette.background.default,
                }}
            >
                <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                    <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 5, md: 6 } }}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: 'success.main', fontWeight: 700,
                                letterSpacing: 2, fontSize: '0.75rem',
                            }}
                        >
                            Activités
                        </Typography>
                        <Typography
                            variant="h3" component="h2"
                            sx={{
                                fontWeight: 700, color: 'text.primary',
                                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.4rem' },
                                mt: 0.5,
                            }}
                        >
                            Tant de choses à explorer
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.secondary', mt: 1.5,
                                maxWidth: 520, mx: 'auto',
                                fontSize: { xs: '0.88rem', sm: '0.95rem' },
                                lineHeight: 1.7,
                            }}
                        >
                            Que vous aimiez la randonnée, les marchés provençaux ou simplement la douceur de vivre, Rémuzat a tout pour vous séduire.
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: { xs: 2, sm: 2.5, md: 3 },
                    }}>
                        {activities.map((activity, index) => (
                            <Box
                                key={index}
                                sx={{
                                    p: { xs: 2.5, sm: 3 },
                                    bgcolor: '#fff', borderRadius: 3,
                                    border: `1px solid ${theme.palette.divider}`,
                                    boxShadow: '0 2px 12px rgba(84,73,65,0.05)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 6px 24px rgba(84,73,65,0.1)',
                                    }
                                }}
                            >
                                <Box sx={{
                                    width: 44, height: 44, borderRadius: 2.5,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    bgcolor: `${activity.color}14`,
                                    color: activity.color,
                                    mb: 2,
                                }}>
                                    {activity.icon}
                                </Box>
                                <Typography
                                    variant="h6" component="h3"
                                    sx={{
                                        fontWeight: 600, color: 'text.primary', mb: 1,
                                        fontSize: { xs: '1rem', sm: '1.05rem', md: '1.15rem' },
                                    }}
                                >
                                    {activity.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary', lineHeight: 1.7,
                                        fontSize: { xs: '0.82rem', sm: '0.875rem' },
                                    }}
                                >
                                    {activity.description}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* ═══════════════════ ABOUT / QUOTE ═══════════════════ */}
            <Box sx={{
                py: { xs: 5, sm: 7, md: 9 },
                bgcolor: '#fff',
            }}>
                <Container maxWidth="sm">
                    <Box sx={{ textAlign: 'center' }}>
                        <LavenderLogo sx={{ fontSize: 48, mb: 2, opacity: 0.7 }} />
                        <Typography
                            variant="h4" component="blockquote"
                            sx={{
                                fontWeight: 300, fontStyle: 'italic',
                                color: 'text.primary', lineHeight: 1.6,
                                fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                                mb: 2,
                            }}
                        >
                            &laquo; Ici, le bonheur a le parfum de la lavande et le chant des cigales &raquo;
                        </Typography>
                        <Box sx={{
                            width: 40, height: 2, bgcolor: 'primary.main', mx: 'auto', mb: 2,
                            borderRadius: 1, opacity: 0.5,
                        }} />
                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', fontSize: '0.85rem' }}
                        >
                            La maison familiale vous accueille depuis trois générations.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* ═══════════════════ CTA ═══════════════════ */}
            <Box
                id="reservation"
                sx={{
                    background: `linear-gradient(160deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%, ${theme.palette.info.main} 100%)`,
                    color: 'white',
                    py: { xs: 6, sm: 8, md: 10 },
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box sx={{
                    position: 'absolute', top: '-40%', right: '-20%',
                    width: '60%', height: '160%', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <Container maxWidth="sm" sx={{ px: { xs: 3, sm: 3 }, position: 'relative', zIndex: 1 }}>
                    <Box textAlign="center">
                        <Chip
                            icon={<Landscape sx={{ fontSize: 16, color: '#fff !important' }} />}
                            label={authed ? 'Votre espace' : 'Espace privé'}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.15)', color: '#fff',
                                fontWeight: 500, fontSize: '0.75rem', mb: 2,
                                border: '1px solid rgba(255,255,255,0.2)',
                            }}
                        />
                        <Typography
                            variant="h3" component="h2"
                            sx={{
                                mb: 2, fontWeight: 700,
                                fontSize: { xs: '1.6rem', sm: '2rem', md: '2.4rem' },
                                lineHeight: 1.2,
                            }}
                        >
                            {authed ? 'Planifiez votre séjour' : 'Réservez votre séjour'}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 4, fontSize: { xs: '0.92rem', md: '1rem' },
                                lineHeight: 1.8, opacity: 0.9,
                                maxWidth: '480px', mx: 'auto',
                            }}
                        >
                            {authed
                                ? 'Consultez les disponibilités en temps réel et réservez vos prochaines vacances au soleil.'
                                : 'Connectez-vous pour accéder au calendrier de réservation et planifier votre prochain séjour en Drôme Provençale.'
                            }
                        </Typography>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1.5}
                            justifyContent="center"
                            alignItems="center"
                        >
                            {!authed ? (
                                <>
                                    <Button
                                        variant="contained" size="large"
                                        startIcon={<Login />}
                                        onClick={() => navigate('/login')}
                                        sx={{
                                            bgcolor: 'white', color: theme.palette.text.primary,
                                            fontWeight: 600, fontSize: '0.9rem',
                                            px: 3.5, py: 1.2, borderRadius: 2.5,
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                                            '&:hover': {
                                                bgcolor: 'rgba(255,255,255,0.95)',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
                                            }
                                        }}
                                    >
                                        Se connecter
                                    </Button>
                                    <Button
                                        variant="outlined" size="large"
                                        onClick={() => navigate('/signup')}
                                        sx={{
                                            borderColor: 'rgba(255,255,255,0.5)', color: 'white',
                                            fontWeight: 600, fontSize: '0.9rem',
                                            px: 3.5, py: 1.2, borderRadius: 2.5,
                                            '&:hover': {
                                                borderColor: 'white',
                                                bgcolor: 'rgba(255,255,255,0.1)',
                                            }
                                        }}
                                    >
                                        Créer un compte
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="contained" size="large"
                                    startIcon={<CalendarMonth />}
                                    onClick={() => navigate('/reservation')}
                                    sx={{
                                        bgcolor: 'white', color: theme.palette.text.primary,
                                        fontWeight: 600, fontSize: '0.9rem',
                                        px: 4, py: 1.3, borderRadius: 2.5,
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.95)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
                                        }
                                    }}
                                >
                                    Réserver maintenant
                                </Button>
                            )}
                        </Stack>
                    </Box>
                </Container>
            </Box>

            {/* ═══════════════════ FOOTER ═══════════════════ */}
            <Footer />
        </Box>
    );
};

export default Landing;
