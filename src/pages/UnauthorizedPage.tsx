import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { getStoredRoles, hasAnyRole } from '../services/authService';

const UnauthorizedPage: React.FC = () => {
  const roles = getStoredRoles();
  const isEmployee = hasAnyRole(roles, ['EMPLOYEE']) && !hasAnyRole(roles, ['ADMIN', 'HR']);
  const homePath = isEmployee ? '/my-profile' : '/dashboard';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      <div className="page-enter flex flex-col items-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-8 ring-rose-50/50">
          <ShieldAlert className="h-8 w-8" />
        </span>

        <p className="mt-6 bg-linear-to-r from-rose-600 to-orange-500 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent">
          403
        </p>
        <h1 className="mt-2 text-2xl font-bold text-(--text-main)">Access denied</h1>
        <p className="mt-3 max-w-md text-(--text-muted)">
          You do not have the required role permissions to view this page. If you think this is a mistake, contact your HR administrator.
        </p>

        <Link to={homePath} className="btn btn-primary mt-8">
          <ArrowLeft className="h-4 w-4" />
          {isEmployee ? 'Back to My Profile' : 'Back to Dashboard'}
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
