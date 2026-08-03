/*import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EmployeeDashboard1 from "./components/EmployeeDashboard1";
import MainLayout1 from "./components/MainLayout1";
import EmployeeListPage from "./pages/EmployeeListPage";
import EmployeeDetailPage from "./pages/EmployeeDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

// Placeholder components for extra pages
const AnalyticsPage = () => (
  <div style={{ padding: "24px" }}>
    <h2>Analytics & Reports</h2>
    <p>Detailed performance analytics and metrics.</p>
  </div>
);



function App() {
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<MainLayout1 />}>
        {/* Default route redirects to /dashboard *
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Main Dashboard Route *
        <Route path="/dashboard" element={<EmployeeDashboard1 />} />

        <Route path="employees" element={<EmployeeListPage />} />

        {/* Dynamic Route Parameter :id *
          <Route path="employees/:id" element={<EmployeeDetailPage />} />
       
        {/* Additional Pages *
        <Route path="/analytics" element={<AnalyticsPage />} />
       </Route>
        {/* Catch-all 404 Route *
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;*/

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeDashboard1 from './components/EmployeeDashboard1';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import NotFoundPage from './pages/NotFoundPage'
import MainLayout1 from './components/MainLayout1'
import DashboardSummary from './components/DashboardSummary';

const AnalyticsPage = () => (
  <div style={{ padding: "24px" }}>
    <h2>Analytics & Reports</h2>
    <p>Detailed performance analytics and metrics.</p>
  </div>
);

export function App() {
  return (
    
      <Routes>
       <Route path="/" element={<MainLayout1 />}>
        {/* Default route redirects to /dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Main Dashboard Route */}
        <Route path="/dashboard" element={<EmployeeDashboard1 />} />

        <Route path="employees" element={<EmployeeListPage />} />

        {/* Dynamic Route Parameter :id */}
          <Route path="employees/:id" element={<EmployeeDetailPage />} />
       
        {/* Additional Pages */}
        <Route path="/analytics" element={<AnalyticsPage />} />
       </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
  
    
  );
}

export default App;