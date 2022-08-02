import React from "react";
import { CircularProgress } from '@mui/material';
import { Box, CssBaseline, } from "@mui/material";

export default function LoadingLayout({children}) {
    return (
        // short synthax for React.Fragment is <></>
        <React.Fragment>
            <CssBaseline/>
            <Box sx={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {children}
            </Box>
        </React.Fragment>
    )
}

export function Loading() {
    return (
        <LoadingLayout>
            <CircularProgress/>
        </LoadingLayout>
    );
}

