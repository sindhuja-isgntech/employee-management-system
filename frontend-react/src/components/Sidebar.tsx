/*import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '#dashboard', active: true },
  { label: 'Employees', href: '#employees' },
  { label: 'Departments', href: '#departments' },
  { label: 'Reports', href: '#reports' },
  { label: 'Settings', href: '#settings' },
];

export const Sidebar: React.FC = () => {
  const getLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'block',
    padding: '10px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    color: isActive ? '#0066cc' : '#444',
    backgroundColor: isActive ? '#e6f0fa' : 'transparent',
    fontWeight: isActive ? 600 : 400,
    marginBottom: '4px',
  });
  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: '#f8f9fa',
        borderRight: '1px solid #e0e0e0',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <NavLink to="/dashboard" style={getLinkStyle}>
          <span>📊</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/employees" style={getLinkStyle}>
          <span>👥</span>
          <span>Employees</span>
        </NavLink>

        <NavLink to="/analytics" style={getLinkStyle}>
          <span>📈</span>
          <span>Analytics</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;*/

// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building, Settings, Shield } from 'lucide-react';
import { cn } from '../../../src/lib/utils';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Employees', path: '/employees', icon: Users },
  { label: 'Departments', path: '/departments', icon: Building },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="flex h-full flex-col p-10">
      {/* Brand Header inside Sidebar */}
      <div className="mb-6 flex items-center gap-2 px-3 py-3">
        <Shield className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
          EMS Portal
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
