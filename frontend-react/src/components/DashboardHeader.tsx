import React from 'react';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onAddNew: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  onAddNew,
}) => {
  return (
    <header className="page-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="quick-actions">
        <button type="button" className="btn btn-primary" onClick={onAddNew}>
          + Add New Employee
        </button>
      </div>
    </header>
  );
};