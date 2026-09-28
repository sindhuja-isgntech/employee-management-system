import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, LayoutDashboard } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-(--bg-main) px-6 py-12 text-center">
      {/* Visual Indicator */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--primary-soft) text-(--primary)">
        <Compass className="h-8 w-8" />
      </div>

      <p className="mt-6 bg-(image:--primary-gradient) bg-clip-text text-7xl font-extrabold tracking-tight text-transparent">
        404
      </p>

      <h1 className="mt-2 text-2xl font-bold text-(--text-main)">Page Not Found</h1>

      <p className="mt-3 max-w-md text-(--text-muted)">
        Sorry, we couldn’t find the page you’re looking for. The link might be broken or the URL may have been mistyped.
      </p>

      {/* Navigation Actions */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
        <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-primary">
          <LayoutDashboard className="h-4 w-4" />
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
