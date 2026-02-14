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

// Warm shadow palette (beige-tinted instead of grey)
const warmShadow = (opacity) => `rgba(84, 73, 65, ${opacity})`;

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
        shape: {
            borderRadius: 12,
        },
        typography: {
            fontFamily: ['Inter', 'sans-serif'].join(','),
            h1: { fontWeight: 700 },
            h2: { fontWeight: 600 },
            h3: { fontWeight: 600 },
            h4: { fontWeight: 700 },
            h5: { fontWeight: 600 },
            h6: { fontWeight: 600 },
            body1: { fontWeight: 400 },
            body2: { fontWeight: 400 },
            button: {
                textTransform: 'none',
                fontWeight: 600,
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 10,
                        textTransform: 'none',
                        fontWeight: 600,
                        padding: '8px 20px',
                    },
                    contained: {
                        boxShadow: `0 2px 8px ${warmShadow(0.1)}`,
                        '&:hover': {
                            boxShadow: `0 4px 16px ${warmShadow(0.18)}`,
                        },
                    },
                    outlined: {
                        borderWidth: '1.5px',
                        '&:hover': {
                            borderWidth: '1.5px',
                        },
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 10,
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.9)',
                            },
                            '&.Mui-focused': {
                                backgroundColor: '#fff',
                                boxShadow: `0 0 0 3px ${colors.pastelLavender}30`,
                            },
                            '& fieldset': {
                                borderColor: colors.divider,
                                borderWidth: '1.5px',
                            },
                            '&:hover fieldset': {
                                borderColor: colors.pastelLavender,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: colors.pastelLavender,
                                borderWidth: '2px',
                            },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: colors.pastelLavender,
                        },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        boxShadow: `0 2px 12px ${warmShadow(0.06)}`,
                        border: `1px solid ${colors.divider}`,
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
                    root: {
                        backgroundImage: 'none', // Remove MUI's default gradient overlay
                    },
                    elevation1: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        boxShadow: `0 2px 12px ${warmShadow(0.06)}`,
                    },
                    elevation2: {
                        boxShadow: `0 4px 20px ${warmShadow(0.08)}`,
                    },
                    elevation3: {
                        boxShadow: `0 6px 24px ${warmShadow(0.1)}`,
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: 16,
                        boxShadow: `0 8px 40px ${warmShadow(0.15)}`,
                    },
                },
            },
            MuiAlert: {
                styleOverrides: {
                    root: {
                        borderRadius: 10,
                        fontWeight: 500,
                    },
                    standardError: {
                        backgroundColor: `${colors.softPoppyRed}15`,
                        color: '#8B3A34',
                        border: `1px solid ${colors.softPoppyRed}30`,
                    },
                    standardSuccess: {
                        backgroundColor: `${colors.pastelOliveGreen}15`,
                        color: '#4A6340',
                        border: `1px solid ${colors.pastelOliveGreen}30`,
                    },
                    standardWarning: {
                        backgroundColor: `${colors.softYellow}15`,
                        color: '#7A6220',
                        border: `1px solid ${colors.softYellow}30`,
                    },
                    standardInfo: {
                        backgroundColor: `${colors.pastelLavender}15`,
                        color: '#5A4D6B',
                        border: `1px solid ${colors.pastelLavender}30`,
                    },
                },
            },
            MuiAvatar: {
                styleOverrides: {
                    root: {
                        fontWeight: 700,
                    },
                },
            },
            MuiDivider: {
                styleOverrides: {
                    root: {
                        borderColor: colors.divider,
                    },
                },
            },
        },
    };
};
