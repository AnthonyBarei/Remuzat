// React
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
// MUI
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from '@mui/material';
// Components
import App from './App';
// Theme
import { getDesignTokens } from '../context/theme';
// Auth
import { AuthProvider } from '../context/hooks/useAuth';

const Boot = () => {
    // Create theme (always light mode)
    const theme = React.useMemo(() => createTheme(getDesignTokens()), []);

    return (
        <div className='app'>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <AuthProvider>
                        <App/>
                    </AuthProvider>
                </BrowserRouter>
            </ThemeProvider>
        </div>
    );
}

export default Boot;

if (document.getElementById('app')) {
    const container = document.getElementById('app');
    const root = createRoot(container);
    root.render(<Boot/>);
}
