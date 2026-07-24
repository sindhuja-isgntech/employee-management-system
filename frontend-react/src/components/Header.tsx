import React from 'react';

interface HeaderProps {
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Alex Morgan',
  userRole = 'System Admin',
  avatarUrl = 'https://via.placeholder.com/36',
}) => {
  return (
    <header className="app-header">
      <div className="brand">
        <h1>EMS Dashboard</h1>
      </div>

      <div className="header-actions">
        <div className="user-menu">
          <img src={avatarUrl} alt={userName} className="avatar" />
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">{userRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;