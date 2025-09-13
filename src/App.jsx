import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DevicePage from './pages/DevicePage';
import SuccessPage from './pages/SuccessPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import DevicesPage from './pages/admin/DevicesPage';
import AddDevicePage from './pages/admin/AddDevicePage';
import ProductsPage from './pages/admin/ProductsPage';
import TransactionsPage from './pages/admin/TransactionsPage';
import UsersPage from './pages/admin/UsersPage';
import LoginPage from './pages/admin/LoginPage';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Simple auth check - in a real app, this would check for a valid token
const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/admin/login" state={{ from: window.location.pathname }} replace />;
  }
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="device/:deviceId" element={<DevicePage />} />
          <Route path="success/" element={<SuccessPage />} />
          
          {/* Admin Routes */}
          <Route path="admin/login" element={<LoginPage />} />
          
          <Route 
            path="admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="devices" element={<DevicesPage />} />
            <Route path="devices/add" element={<AddDevicePage />} />
            <Route path="devices/:deviceId" element={<div>Device Detail</div>} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="analytics" element={<div>Analytics</div>} />
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
          
          {/* 404 - Keep this as the last route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
