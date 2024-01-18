// React
import React from 'react';
import { Routes, Route } from "react-router-dom";
// Components
import Loading from './Main/Loading';
import Login from './Pages/Auth/Login';
import SignUp from './Pages/Auth/SignUp';
import Booking from './Booking/Booking';
// Routes
import { PrivateRoutes } from './Routes/ProtectedRoutes';
// Auth
import { useAuth } from '../context/hooks/useAuth';

const App = () => {
    const { loading } = useAuth();

    return (
        <>
            {!loading ? (
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route element={<PrivateRoutes/>}>
                        <Route path="/" element={<Booking/>}></Route>
                    </Route>
                </Routes>
            ) : (
                <Loading/>
            )}
        </>
    );

}

export default App;
