import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SuperAdminApp } from './apps/admin/SuperAdminApp';
import { CafeClientApp } from './apps/client/CafeClientApp';
import { CustomerApp } from './apps/customer/CustomerApp';
import { UnifiedAuthPage } from './components/auth/UnifiedAuthPage';
import { Toast } from './components/ui/Toast';

import { useCafeData } from './context/CafeDataContext';

const RootRoute: React.FC = () => {
  const { currentUser } = useCafeData();
  const isLoggedOut = localStorage.getItem('cafems_logged_out') === 'true';

  if (!currentUser || isLoggedOut) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={currentUser.role === 'super_admin' ? '/admin' : '/client'} replace />;
};

const ProtectedRoute: React.FC<{
  children: React.ReactElement;
  requiredRole?: 'super_admin' | 'cafe_client';
}> = ({ children, requiredRole }) => {
  const { currentUser } = useCafeData();
  const isLoggedOut = localStorage.getItem('cafems_logged_out') === 'true';

  if (!currentUser || isLoggedOut) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to={currentUser.role === 'super_admin' ? '/admin' : '/client'} replace />;
  }

  return children;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route: goes to /login if unauthenticated, otherwise /admin or /client */}
        <Route path="/" element={<RootRoute />} />

        {/* Unified Authentication Login Gateway for Super Admin & Cafe Client */}
        <Route path="/login" element={<UnifiedAuthPage />} />

        {/* 1. Super Admin Application (Protected) */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <SuperAdminApp />
            </ProtectedRoute>
          }
        />

        {/* 2. Cafe Client Operations Application (Protected) */}
        <Route
          path="/client/*"
          element={
            <ProtectedRoute requiredRole="cafe_client">
              <CafeClientApp />
            </ProtectedRoute>
          }
        />
        <Route path="/cafe/*" element={<Navigate to="/client" replace />} />

        {/* 3. Customer Dining Application */}
        <Route path="/customer/*" element={<CustomerApp />} />
        <Route path="/table/:id" element={<CustomerApp />} />

        {/* Catch-all route */}
        <Route path="*" element={<RootRoute />} />
      </Routes>

      {/* Global reactive toast notifications */}
      <Toast />
    </BrowserRouter>
  );
};

export default App;
