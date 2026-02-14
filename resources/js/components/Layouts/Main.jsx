import React from "react";

import {
    Container,
    Box,
    CssBaseline,
    Toolbar,
} from "@mui/material";


import ResponsiveAppBar from "./Appbar/Navbar";

const MainLayout = ({children}) => {
    return (
        <Box sx={{ 
            display: 'flex', 
            minHeight: '100vh',
            bgcolor: 'background.default'
        }}>
            <CssBaseline/>
            <ResponsiveAppBar/>

            <Container 
                component="main" 
                maxWidth="false"
                sx={{
                    px: { xs: 2, sm: 2, md: 3 },
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Toolbar />
                <Box sx={{ 
                    display: 'flex', 
                    width: '100%', 
                    flexDirection: 'column',
                    flex: 1,
                    py: { xs: 1, sm: 2 }
                }}>
                    {children}
                </Box>
            </Container>
        </Box>
    )
}

export default MainLayout
