import React from 'react';
import { Box, Container, Typography, Stack, Link as MuiLink, Divider, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { GitHub, Language, EmailOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import LavenderLogo from './LavenderLogo';

const Footer: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const currentYear = new Date().getFullYear();

    return (
        <Box component="footer" sx={{
            bgcolor: '#fff',
            borderTop: `1px solid ${theme.palette.divider}`,
        }}>
            <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 5 } }}>
                {/* Top section */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'center', md: 'flex-start' },
                    gap: { xs: 3, md: 0 },
                    mb: 3.5,
                }}>
                    {/* Brand */}
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, justifyContent: { xs: 'center', md: 'flex-start' }, mb: 1 }}>
                            <LavenderLogo sx={{ fontSize: 22 }} />
                            <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}>
                                Rémuzat
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', maxWidth: 260 }}>
                            Votre gîte au cœur de la Drôme Provençale.
                            Calme, nature et authenticité.
                        </Typography>
                    </Box>

                    {/* Legal links */}
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.82rem', mb: 1.25 }}>
                            Informations
                        </Typography>
                        <Stack spacing={0.75}>
                            {[
                                { label: 'Mentions légales', to: '/mentions-legales' },
                                { label: 'Politique de confidentialité', to: '/politique-de-confidentialite' },
                                { label: "Conditions générales d'utilisation", to: '/conditions-generales' },
                            ].map(item => (
                                <MuiLink key={item.to} component={Link} to={item.to} underline="none" sx={{
                                    color: 'text.secondary', fontSize: '0.8rem', fontWeight: 500,
                                    transition: 'color 0.15s ease',
                                    '&:hover': { color: theme.palette.primary.dark },
                                }}>
                                    {item.label}
                                </MuiLink>
                            ))}
                        </Stack>
                    </Box>

                    {/* Contact */}
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.82rem', mb: 1.25 }}>
                            Contact
                        </Typography>
                        <Stack spacing={0.75}>
                            <MuiLink href="mailto:contact@anthonybarei.fr" underline="none"
                                sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary', fontSize: '0.8rem', fontWeight: 500, justifyContent: { xs: 'center', md: 'flex-start' }, '&:hover': { color: theme.palette.primary.dark } }}>
                                <EmailOutlined sx={{ fontSize: 16 }} />
                                contact@anthonybarei.fr
                            </MuiLink>
                            <MuiLink href="https://anthonybarei.fr" target="_blank" rel="noopener noreferrer" underline="none"
                                sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary', fontSize: '0.8rem', fontWeight: 500, justifyContent: { xs: 'center', md: 'flex-start' }, '&:hover': { color: theme.palette.primary.dark } }}>
                                <Language sx={{ fontSize: 16 }} />
                                anthonybarei.fr
                            </MuiLink>
                        </Stack>
                        {/* Social icons */}
                        <Stack direction="row" spacing={0.5} sx={{ mt: 1.5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            <IconButton size="small" component="a" href="https://github.com/AnthonyBarei" target="_blank" rel="noopener noreferrer"
                                sx={{
                                    color: 'text.secondary', width: 34, height: 34,
                                    border: `1px solid ${theme.palette.divider}`,
                                    '&:hover': { color: theme.palette.text.primary, borderColor: theme.palette.text.secondary, bgcolor: `${theme.palette.primary.main}06` },
                                }}>
                                <GitHub sx={{ fontSize: 17 }} />
                            </IconButton>
                            <IconButton size="small" component="a" href="https://anthonybarei.fr" target="_blank" rel="noopener noreferrer"
                                sx={{
                                    color: 'text.secondary', width: 34, height: 34,
                                    border: `1px solid ${theme.palette.divider}`,
                                    '&:hover': { color: theme.palette.text.primary, borderColor: theme.palette.text.secondary, bgcolor: `${theme.palette.primary.main}06` },
                                }}>
                                <Language sx={{ fontSize: 17 }} />
                            </IconButton>
                            <IconButton size="small" component="a" href="mailto:contact@anthonybarei.fr"
                                sx={{
                                    color: 'text.secondary', width: 34, height: 34,
                                    border: `1px solid ${theme.palette.divider}`,
                                    '&:hover': { color: theme.palette.text.primary, borderColor: theme.palette.text.secondary, bgcolor: `${theme.palette.primary.main}06` },
                                }}>
                                <EmailOutlined sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Stack>
                    </Box>
                </Box>

                {/* Divider + bottom bar */}
                <Divider sx={{ mb: 2.5 }} />
                <Box sx={{
                    display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between', alignItems: 'center', gap: 1,
                }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                        &copy; {currentYear} Rémuzat. Tous droits réservés.
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                        Fait sous le soleil de la Drôme Provençale
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
