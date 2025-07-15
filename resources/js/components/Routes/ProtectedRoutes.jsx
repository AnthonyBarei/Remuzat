import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/hooks/useAuth";

export const PrivateRoutes = ({children}) => {
    const { authed, user } = useAuth();
    const location = useLocation();

    return (
        authed ? <Outlet/> : <Navigate to="/login" state={{ from: location }}/>
    )
}
