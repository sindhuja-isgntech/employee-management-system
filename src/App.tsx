/*import  EmployeeDashboard1 from '../frontend-react/src/components/EmployeeDashboard1';

import './App.css'

function App() {

return (
    <div className="app">
    {/*<Dashboard />
 <EmployeeDashboard1 />
   
    </div>
  );
}

export default App*/

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../frontend-react/src/components/MainLayout';
import { DashboardPage } from '../frontend-react/src/pages/DashboardPage';
import { EmployeeListPage } from '../frontend-react/src/pages/EmployeeListPage';
import { EmployeeDetailPage } from '../frontend-react/src/pages/EmployeeDetailPage';

import { NotFoundPage } from '../frontend-react/src/pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        {/* Cleaner routes without prop drilling */}
        <Route path="employees" element={<EmployeeListPage />} />
        
        <Route path="employees/:id" element={<EmployeeDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
