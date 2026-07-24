import React from 'react';

export default function Navbar() {
  return (
    <header className="app-header">
      <div className="brand">
        <img
          src="/assets/images/logo.png"
          alt="EMS Logo"
          width="32"
          height="32"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <h1>EMS Dashboard</h1>
      </div>

      <div className="header-actions">
        <div class="user-menu">
          <img
            src="/assets/images/avatars/default-avatar.png"
            alt="Profile Picture"
            className="avatar"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/36'; }}
          />
          <div className="user-info">
            <span className="user-name">Alex Morgan</span>
            <span className="user-role">System Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}