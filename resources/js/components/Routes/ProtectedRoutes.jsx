import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/hooks/useAuth";
import { Box, CircularProgress } from "@mui/material";

export const PrivateRoutes = ({children}) => {
    const { authed, user, isAdmin, loading } = useAuth();
    const location = useLocation();

    // If still loading, show loading state
    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                bgcolor: '#F5F0EB'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    // If not authenticated, redirect to login
    if (!authed) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if trying to access admin routes
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    if (isAdminRoute && !isAdmin) {
        // Redirect non-admin users away from admin routes
        return <Navigate to="/reservation" replace />;
    }

    // If user is admin but trying to access non-admin routes, allow it
    // (admins can access both admin and regular user routes)
    
    return <Outlet />;
}
