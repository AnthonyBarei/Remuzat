import React from "react";

import {
    Container,
    Box,
    CssBaseline,
    Toolbar,
} from "@mui/material";


import Copyright from "./Copyright";
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

            <Container component="main" maxWidth="false">
                <Toolbar />
                <Box sx={{ 
                    display: 'flex', 
                    width: '100%', 
                    flexDirection: 'column',
                    py: 2
                }}>
                    {children}
                </Box>

                <Copyright sx={{ my: 2 }}/>
            </Container>
        </Box>
    )
}

export default MainLayout
