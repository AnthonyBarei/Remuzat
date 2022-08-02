import { createContext } from "react";
import { grey } from '@mui/material/colors';

export const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light' && {
            background: {
                default: '#f6f6f6',
            }
        }),
        ...(mode === 'dark' && {
            text: {
                // primary: grey[400],
                menuButton: grey[300],
            }
        }),
    },
});

export const ColorModeContext = createContext({ toggleColorMode: () => {} });
