import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        height: '40px',
        backgroundColor: '#f1f3f5',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.85rem',
        color: '#666666',
      }}
    >
      <p style={{ margin: 0 }}>
        &copy; {new Date().getFullYear()} Employee Management System. All rights reserved.
      </p>
    </footer>
  );
};