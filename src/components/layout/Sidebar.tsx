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

// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Employees', path: '/employees', icon: Users },
  { label: 'Departments', path: '/departments', icon: Building },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <aside
      className={cn(
        // Same surface + border as the header so both read as one frame
        'sticky top-(--header-height) h-[calc(100vh-var(--header-height))] shrink-0 self-start overflow-y-auto',
        'w-16 border-r border-(--border-color) bg-(--bg-surface) px-2 py-6 md:w-(--sidebar-width) md:px-4'
      )}
    >
      {/* Section label */}
      <p className="mb-3 hidden px-3 text-[0.7rem] font-semibold uppercase tracking-widest text-(--text-light) md:block">
        Navigation
      </p>

      {/* Navigation List */}
      <nav aria-label="Main Navigation" className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.label}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center justify-center gap-3 rounded-(--radius-md) px-3 py-2.5 text-sm font-medium transition-colors md:justify-start',
                  isActive
                    ? 'bg-(--primary-soft) font-semibold text-(--primary) before:absolute before:top-2 before:bottom-2 before:left-0 before:w-1 before:rounded-r before:bg-(--primary)'
                    : 'text-(--text-muted) hover:bg-(--bg-subtle) hover:text-(--text-main)'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden md:inline">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
