import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeeListPage } from './pages/EmployeeListPage';
import { EmployeeDetailPage } from './pages/EmployeeDetailPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Default route redirects to /dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Main Dashboard Route */}
        <Route path="dashboard" element={<DashboardPage />} />

        <Route path="employees" element={<EmployeeListPage />} />

        {/* Dynamic Route Parameter :id */}
        <Route path="employees/:id" element={<EmployeeDetailPage />} />

        {/* Additional Pages */}
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
