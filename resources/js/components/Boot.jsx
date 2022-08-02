// React
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
// MUI
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, createTheme } from "@mui/material/styles";
// Components
import App from './App';
// Theme
import { getDesignTokens, ColorModeContext } from '../context/theme';
// Auth
import { AuthProvider } from '../context/hooks/useAuth';

const Boot = () => {
    // Theme
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    const choosedDarkMode = localStorage.getItem('darkmode');
    const [mode, setMode] = React.useState(choosedDarkMode || prefersDarkMode );
    const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
    const colorMode = React.useMemo(() => ({ toggleColorMode: () => {
        setMode((prevMode) => {
            localStorage.setItem('darkmode', prevMode === 'light' ? 'dark' : 'light');
            return (prevMode === 'light' ? 'dark' : 'light')
        });
    }}), []);

    return (
        <div className='app'>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <BrowserRouter>
                        <AuthProvider>
                            <App/>
                        </AuthProvider>
                    </BrowserRouter>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </div>
    );
}

export default Boot;

if (document.getElementById('app')) {
    const container = document.getElementById('app');
    const root = createRoot(container);
    root.render(<Boot/>);
}
