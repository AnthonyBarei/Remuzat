import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/hooks/useAuth";

export const PrivateRoutes = ({children}) => {
    const { authed, user, loading } = useAuth();
    const location = useLocation();

    // If still loading, show loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // If not authenticated, redirect to login
    if (!authed) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if trying to access admin routes
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    if (isAdminRoute && !user.is_admin) {
        // Redirect non-admin users away from admin routes
        return <Navigate to="/reservation" replace />;
    }

    return <Outlet />;
}
