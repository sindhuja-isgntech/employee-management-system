import React from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  CalendarCheck,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { InitialsAvatar } from '@/components/common/InitialsAvatar';
import { getStoredRoles, getStoredUser, hasAnyRole, logOutUser } from '../services/authService';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-(--primary-soft) text-(--primary)'
      : 'text-(--text-muted) hover:bg-(--bg-subtle) hover:text-(--text-main)'
  }`;

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const userRoles = getStoredRoles();
  const currentUser = getStoredUser();
  const isManager = hasAnyRole(userRoles, ['ADMIN', 'HR']);
  const isEmployee = hasAnyRole(userRoles, ['EMPLOYEE']) && !isManager;
  const homeRoute = isEmployee ? '/my-profile' : '/dashboard';
  const roleLabel = hasAnyRole(userRoles, ['ADMIN']) ? 'Admin' : hasAnyRole(userRoles, ['HR']) ? 'HR' : 'Employee';

  const navItems: NavItem[] = [
    { to: homeRoute, label: isEmployee ? 'My Profile' : 'Dashboard', icon: isEmployee ? UserRound : LayoutDashboard },
    ...(isManager ? [{ to: '/employees', label: 'Employees', icon: Users }] : []),
    { to: '/departments', label: 'Departments', icon: Building2 },
    { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/leaves', label: 'Leaves', icon: CalendarDays },
  ];

  const handleLogout = () => {
    queryClient.clear();
    logOutUser();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-(--border-color) bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-8">
            <NavLink to={homeRoute} className="flex shrink-0 items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(image:--primary-gradient) text-white shadow-md shadow-blue-900/15">
                <Users className="h-5 w-5" />
              </span>
              <span className="hidden leading-tight sm:block">
                <span className="block text-sm font-bold text-(--text-main)">HRMS Portal</span>
                <span className="block text-xs text-(--text-muted)">HR Workspace</span>
              </span>
            </NavLink>

            {/* Desktop navigation */}
            <nav aria-label="Main navigation" className="hidden items-center gap-1 xl:flex">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={navLinkClass}>
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden items-center gap-3 rounded-full border border-(--border-color) bg-white py-1 pr-4 pl-1 shadow-sm sm:flex">
                <InitialsAvatar name={currentUser.name} size="sm" />
                <div className="min-w-0 leading-tight">
                  <p className="flex items-center gap-2 text-sm font-semibold text-(--text-main)">
                    <span className="max-w-40 truncate">{currentUser.name}</span>
                    <span className="rounded-full bg-(--primary-soft) px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-(--primary) uppercase">
                      {roleLabel}
                    </span>
                  </p>
                  <p className="max-w-52 truncate text-xs text-(--text-muted)">{currentUser.email}</p>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-(--border-color) bg-white px-3 py-2 text-sm font-medium text-(--text-muted) transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <nav aria-label="Main navigation" className="flex gap-1 overflow-x-auto border-t border-(--border-color) px-3 py-2 xl:hidden">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Main Outlet Container (re-animates on every route change) */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-(--border-color) bg-white/60 py-4 text-center text-xs text-(--text-muted) backdrop-blur">
        © {new Date().getFullYear()} Employee Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default AppLayout;
