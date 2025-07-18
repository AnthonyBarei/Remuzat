import { createContext } from "react";
import { grey } from '@mui/material/colors';

// Provençal pastel-inspired color palette (light mode only)
const colors = {
    // Base pastel colors
    beige: '#F5F0EB',           // Light background
    pastelLavender: '#C8B7D6',  // Accents and info
    pastelOliveGreen: '#B5C7AA', // Active elements and success
    lightTerracotta: '#E7B8A4',  // Secondary buttons/warnings
    softYellow: '#F6D88F',       // Warnings
    softPoppyRed: '#E49D96',     // Errors
    chestnutBrown: '#544941',    // Primary text in light mode
    
    // Light mode backgrounds
    background: {
        default: '#F5F0EB',
        alt1: '#EFE9E2',
        alt2: '#E7DFD7',
    },
    paper: {
        main: '#FFFFFF',
        alt: '#F9F6F2',
    },
    divider: '#DDD5CE',
};

export const getDesignTokens = () => {
    return {
        palette: {
            mode: 'light',
            primary: {
                main: colors.pastelLavender,
                light: '#D8C8E2',
                dark: '#A89BC4',
                contrastText: colors.chestnutBrown,
            },
            secondary: {
                main: colors.lightTerracotta,
                light: '#F0C8B8',
                dark: '#D4A08C',
                contrastText: colors.chestnutBrown,
            },
            error: {
                main: colors.softPoppyRed,
                light: '#F0B8B2',
                dark: '#D48A82',
            },
            warning: {
                main: colors.softYellow,
                light: '#F8E2A8',
                dark: '#E8C870',
            },
            success: {
                main: colors.pastelOliveGreen,
                light: '#C8D4BC',
                dark: '#A3B592',
            },
            info: {
                main: colors.pastelLavender,
                light: '#D8C8E2',
                dark: '#A89BC4',
            },
            background: {
                default: colors.background.default,
                alt1: colors.background.alt1,
                alt2: colors.background.alt2,
            },
            paper: {
                main: colors.paper.main,
                alt: colors.paper.alt,
            },
            text: {
                primary: colors.chestnutBrown,
                secondary: '#8B7D6B',
            },
            divider: colors.divider,
        },
        typography: {
            fontFamily: ['Inter', 'sans-serif'].join(','),
            h1: { fontWeight: 700 },
            h2: { fontWeight: 600 },
            body1: { fontWeight: 400 },
            button: {
                textTransform: 'none',
                fontWeight: 600,
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        textTransform: 'none',
                        fontWeight: 600,
                    },
                    contained: {
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        border: `1px solid ${colors.pastelLavender + '20'}`,
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderBottom: `1px solid ${colors.divider}`,
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        fontWeight: 500,
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    elevation1: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    },
                },
            },
        },
    };
};
