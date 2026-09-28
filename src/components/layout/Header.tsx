import React from 'react';
import { Users } from 'lucide-react';
import { InitialsAvatar } from '@/components/common/InitialsAvatar';

interface HeaderProps {
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Alex Morgan',
  userRole = 'System Admin',
  avatarUrl,
}) => {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-logo">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h1>Employee Management System</h1>
          <span className="brand-tagline hidden sm:block">HR Workspace</span>
        </div>
      </div>

      <div className="header-actions">
        <div className="user-menu">
          <InitialsAvatar name={userName} src={avatarUrl} size="sm" />
          <div className="user-info hidden sm:flex">
            <span className="user-name">{userName}</span>
            <span className="user-role">{userRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
