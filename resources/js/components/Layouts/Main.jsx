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
        <Box sx={{ display: 'flex', }}>
            <CssBaseline/>

            <ResponsiveAppBar/>

            <Container component="main" maxWidth="false">
                <Toolbar />
                <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', }}>
                    {children}
                </Box>

                <Copyright sx={{ my: 2 }}/>
            </Container>
        </Box>
    )
}

export default MainLayout
