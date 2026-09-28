import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-(--bg-main)">
      {/* 1. Header Navigation (sticky, full width) */}
      <Header />

      {/* 2. Middle Section: Sidebar + Dynamic Content */}
      <div className="flex flex-1">
        <Sidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {/* React Router renders active child routes here without page reloads */}
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
