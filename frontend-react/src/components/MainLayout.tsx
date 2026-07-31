import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const MainLayout: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* 1. Header Navigation */}
      <Header />

      {/* 2. Middle Section: Sidebar + Dynamic Content */}
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        <main
          style={{
            flex: 1,
            padding: '24px',
            backgroundColor: '#ffffff',
            overflowY: 'auto',
          }}
        >
          {/* React Router renders active child routes here without page reloads */}
          <Outlet />
        </main>
      </div>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;