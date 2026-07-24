import React from 'react';

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
  return (
    <aside className="sidebar">
      <nav aria-label="Main Navigation">
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={`nav-item ${item.active ? 'active' : ''}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;