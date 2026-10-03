import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { EmployeeProvider } from './context/EmployeeContext';
import { ToastProvider } from './components/common/toast/ToastProvider';
import './index.css';

// Create a single QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* QueryClientProvider MUST wrap App */}
      <QueryClientProvider client={queryClient}>
        <EmployeeProvider>
          <BrowserRouter>
            <ToastProvider>
              <App />
            </ToastProvider>
          </BrowserRouter>
        </EmployeeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}
