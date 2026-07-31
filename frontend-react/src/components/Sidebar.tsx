import React from 'react';
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

export default Sidebar;