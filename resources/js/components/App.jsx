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
import ForgotPassword from './Pages/Auth/ForgotPassword';
import ResetPassword from './Pages/Auth/ResetPassword';
import EmailVerification from './Pages/Auth/EmailVerification';
import Booking from './Booking/Booking';
import Landing from './Pages/Landing';
import Admin from './Admin/Admin';
import Profile from './Pages/Profile';
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
                    <Route path="/forgot-password" element={<ForgotPassword/>}/>
                    <Route path="/reset-password" element={<ResetPassword/>}/>
                    <Route path="/email/verify" element={<EmailVerification/>}/>
                    <Route element={<PrivateRoutes/>}>
                        <Route path="/reservation" element={<Booking/>}></Route>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/admin/*" element={<Admin/>}/>
                    </Route>
                </Routes>
            ) : (
                <Loading/>
            )}
        </LocalizationProvider>
    );

}

export default App;
