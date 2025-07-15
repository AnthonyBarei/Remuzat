import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Stack,
    Chip,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    CalendarMonth,
    Nature,
    Restaurant,
    Hotel,
    DirectionsCar,
    Hiking,
    Pool,
    Wifi
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../Layouts/LandingNavbar';

const Landing: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const features = [
        {
            icon: <Nature sx={{ fontSize: 40, color: '#4CAF50' }} />,
            title: 'Nature & Hiking',
            description: 'Explore the stunning landscapes and hiking trails around Remuzat'
        },
        {
            icon: <Restaurant sx={{ fontSize: 40, color: '#FF9800' }} />,
            title: 'Local Cuisine',
            description: 'Discover authentic Provençal cuisine and local restaurants'
        },
        {
            icon: <Hotel sx={{ fontSize: 40, color: '#2196F3' }} />,
            title: 'Comfortable Accommodation',
            description: 'Stay in our beautiful village with modern amenities'
        },
        {
            icon: <DirectionsCar sx={{ fontSize: 40, color: '#9C27B0' }} />,
            title: 'Easy Access',
            description: 'Conveniently located with easy access to major attractions'
        }
    ];

    const amenities = [
        { icon: <Pool />, label: 'Swimming Pool' },
        { icon: <Wifi />, label: 'Free WiFi' },
        { icon: <Hiking />, label: 'Hiking Trails' },
        { icon: <Restaurant />, label: 'Restaurant' }
    ];

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <LandingNavbar />
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    py: 8,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h2"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    fontSize: isMobile ? '2.5rem' : '3.5rem'
                                }}
                            >
                                Welcome to Remuzat
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 4,
                                    opacity: 0.9,
                                    fontWeight: 300
                                }}
                            >
                                Discover the hidden gem of Provence, where nature meets tranquility
                            </Typography>
                            <Stack direction="row" spacing={2} flexWrap="wrap">
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        bgcolor: 'white',
                                        color: '#667eea',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.9)'
                                        }
                                    }}
                                >
                                    Book Your Stay
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        borderColor: 'white',
                                        color: 'white',
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: 'rgba(255,255,255,0.1)'
                                        }
                                    }}
                                >
                                    Learn More
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    height: 400,
                                    backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: 3,
                                    boxShadow: 3
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* About Section */}
            <Container id="about" maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h3" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                            About Remuzat
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8 }}>
                            Nestled in the heart of Provence, Remuzat is a charming village that offers the perfect blend of natural beauty, 
                            cultural heritage, and modern comfort. Surrounded by rolling hills, olive groves, and lavender fields, 
                            our village provides an idyllic setting for your perfect getaway.
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
                            Whether you're seeking adventure in the great outdoors, relaxation in our peaceful surroundings, 
                            or a taste of authentic Provençal life, Remuzat has something special for every traveler.
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {amenities.map((amenity, index) => (
                                <Chip
                                    key={index}
                                    icon={amenity.icon}
                                    label={amenity.label}
                                    variant="outlined"
                                    sx={{ mb: 1 }}
                                />
                            ))}
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                height: 500,
                                backgroundImage: 'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: 3,
                                boxShadow: 3
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>

            {/* Features Section */}
            <Box id="features" sx={{ bgcolor: '#f8f9fa', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        component="h2"
                        align="center"
                        sx={{ mb: 6, fontWeight: 600 }}
                    >
                        Why Choose Remuzat?
                    </Typography>
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        textAlign: 'center',
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: 4
                                        }
                                    }}
                                >
                                    <CardContent sx={{ py: 4 }}>
                                        <Box sx={{ mb: 2 }}>
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Booking CTA Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    py: 8
                }}
            >
                <Container maxWidth="md">
                    <Box textAlign="center">
                        <CalendarMonth sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h3" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                            Ready to Experience Remuzat?
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                            Book your perfect stay in our beautiful village and create unforgettable memories
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/login')}
                            sx={{
                                bgcolor: 'white',
                                color: '#667eea',
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.9)'
                                }
                            }}
                        >
                            Start Booking Now
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Footer */}
            <Box id="contact" sx={{ bgcolor: '#2c3e50', color: 'white', py: 4 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Remuzat Village
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Your perfect destination in the heart of Provence
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Contact
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Email: info@remuzat-village.com<br />
                                Phone: +33 4 90 XX XX XX
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Follow Us
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Stay connected for the latest updates and special offers
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{ borderTop: 1, borderColor: 'rgba(255,255,255,0.1)', mt: 4, pt: 2, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ opacity: 0.6 }}>
                            © 2024 Remuzat Village. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Landing; 