import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import AttendancePage from './pages/AttendancePage';
import DepartmentsPage from './pages/DepartmentsPage';
import LeavesPage from './pages/LeavesPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import { EmployeeList } from './components/employees/EmployeeList';
import { EmployeeDashboard } from './components/dashboard/EmployeeDashboard';
import { getStoredRoles, hasAnyRole } from './services/authService';

const HomeRedirect: React.FC = () => {
  const roles = getStoredRoles();
  const home = hasAnyRole(roles, ['ADMIN', 'HR']) ? '/dashboard' : '/my-profile';
  return <Navigate to={home} replace />;
};

const App: React.FC = () => {
  // The single <BrowserRouter> lives in main.tsx; a second one here crashes the app
  return (
    <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Authenticated Application Layout */}
        <Route element={<AppLayout />}>
          {/* Routes open to all authenticated users */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'HR', 'EMPLOYEE']} />}>
            <Route index element={<HomeRedirect />} />
            
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/leaves" element={<LeavesPage />} />
            <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE']} />}>
              <Route path="/my-profile" element={<EmployeeDetailPage isMyProfile />} />
            </Route>
          </Route>

          {/* HR & ADMIN Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'HR']} />}>
          <Route path="/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />
          </Route>
        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  );
};

export default App;