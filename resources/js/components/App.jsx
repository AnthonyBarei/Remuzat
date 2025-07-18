// React
import React from 'react';
import { Routes, Route } from "react-router-dom";
// Mui
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
// Components
import Loading from './Main/Loading';
import Login from './Pages/Auth/Login';
import SignUp from './Pages/Auth/SignUp';
import Booking from './Booking/Booking';
import Landing from './Pages/Landing';
import Admin from './Admin/Admin';
// Routes
import { PrivateRoutes } from './Routes/ProtectedRoutes';
// Auth
import { useAuth } from '../context/hooks/useAuth';

const App = () => {
    const { loading } = useAuth();

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            {!loading ? (
                <Routes>
                    <Route path="/" element={<Landing/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route element={<PrivateRoutes/>}>
                        <Route path="/reservation" element={<Booking/>}></Route>
                    </Route>
                    <Route path="/admin/*" element={<Admin/>}/>
                </Routes>
            ) : (
                <Loading/>
            )}
        </LocalizationProvider>
    );

}

export default App;
