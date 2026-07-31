import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      {/* Visual Indicator */}
      <div
        style={{
          fontSize: '5rem',
          fontWeight: 800,
          color: '#e2e8f0',
          lineHeight: 1,
          marginBottom: '16px',
        }}
      >
        404
      </div>

      <h1
        style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#1e293b',
          margin: '0 0 8px 0',
        }}
      >
        Page Not Found
      </h1>

      <p
        style={{
          fontSize: '1rem',
          color: '#64748b',
          maxWidth: '420px',
          margin: '0 0 28px 0',
          lineHeight: 1.5,
        }}
      >
        Sorry, we couldn’t find the page you’re looking for. The link might be broken or the URL may have been mistyped.
      </p>

      {/* Navigation Actions */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        

        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '10px 20px',
            fontSize: '0.9rem',
            fontWeight: 500,
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#0066cc',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;