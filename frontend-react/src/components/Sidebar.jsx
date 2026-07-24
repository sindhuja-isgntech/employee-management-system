import React from 'react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav aria-label="Main Navigation">
        <ul>
          <li><a href="#dashboard" className="nav-item active" aria-current="page">Dashboard</a></li>
          <li><a href="#employees" className="nav-item">Employees</a></li>
          <li><a href="#departments" className="nav-item">Departments</a></li>
          <li><a href="#reports" className="nav-item">Reports</a></li>
          <li><a href="#settings" className="nav-item">Settings</a></li>
        </ul>
      </nav>
    </aside>
  );
}