import { Outlet } from "react-router-dom";
import {Header} from "./Header.tsx";
import {Sidebar} from "./Sidebar.tsx";
import {Footer} from "./Footer.tsx";

function MainLayout1() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <Header />

      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />

        <main
          style={{
            flex: 1,
            padding: "24px",
            backgroundColor: "#ecf6ff",
            overflowY: "auto",
          }}
        >
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default MainLayout1;


// src/layouts/MainLayout.tsx
/*import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar.tsx';
import EmployeeDashboard1 from '../components/EmployeeDashboard1.tsx';

export const MainLayout1 = () => {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* 1. TOP HEADER (Full Width) *
      <Header /> 

      {/* 2. BODY CONTAINER (Sidebar + Main Content side-by-side) *
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar *
        <aside className="w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <Sidebar />
        </aside>

        {/* Right Main Content Area *
        <main className="flex-1 ">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout1;*/