import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import Reservations from './Reservations';
import Users from './Users';

const Admin: React.FC = () => {
    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/users" element={<Users />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AdminLayout>
    );
};

export default Admin; 