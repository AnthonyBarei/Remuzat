import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Box } from "@mui/material";
import { useAuth } from '../../../context/hooks/useAuth';

function LogoutButton() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = (e) => {
        e.preventDefault()

        const logoutConfig = {
            headers: { 'Authorization': 'Bearer ' + user.token },
        };

        const logoutCallback = () => {
            let {from} = location.state || {from: {pathname: '/login'}}
            navigate(from, { replace: true });
        }

        logout(logoutConfig).then(logoutCallback).catch(logoutCallback);
    };

    return (
        <React.Fragment>
            <Box component={"form"} onSubmit={handleLogout}>
                <Button color={'inherit'} type={"submit"}>
                    Logout
                </Button>
            </Box>
        </React.Fragment>
    )
}

export default LogoutButton
