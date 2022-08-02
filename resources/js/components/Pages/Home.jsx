// React
import React from "react";
// MUI
import { Typography, } from "@mui/material";
import { Box } from "@mui/system";
// Components
import MainLayout from "../Layouts/Main";

export default function Home() {
    return (
        <MainLayout>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', }}>
                <Typography variant={"h5"} sx={{ mb: 3, textAlign: 'center' }}>My Home</Typography>
            </Box>
        </MainLayout>
    )
}
