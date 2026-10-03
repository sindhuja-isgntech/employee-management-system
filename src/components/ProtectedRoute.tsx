import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getStoredRoles, hasAnyRole } from '../services/authService';

type Role = string;

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const token = localStorage.getItem('jwt_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return hasAnyRole(getStoredRoles(), allowedRoles)
    ? <Outlet />
    : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;