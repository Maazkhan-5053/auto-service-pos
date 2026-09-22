import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import WorkOrders from './pages/WorkOrders';
import Customers from './pages/Customers';
import Vehicles from './pages/Vehicles';
import Inventory from './pages/Inventory';
import Appointments from './pages/Appointments';
import Invoices from './pages/Invoices';
import Employees from './pages/Employees';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute section="dashboard"><Dashboard /></ProtectedRoute>} />
          <Route path="/pos" element={<ProtectedRoute section="pos"><POS /></ProtectedRoute>} />
          <Route path="/work-orders" element={<ProtectedRoute section="workorders"><WorkOrders /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute section="customers"><Customers /></ProtectedRoute>} />
          <Route path="/vehicles" element={<ProtectedRoute section="vehicles"><Vehicles /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute section="inventory"><Inventory /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute section="appointments"><Appointments /></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute section="invoices"><Invoices /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute section="employees"><Employees /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute section="reports"><Reports /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute section="settings"><Settings /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}
