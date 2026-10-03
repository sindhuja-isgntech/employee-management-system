import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { KeyRound, Loader2, Lock, Users } from 'lucide-react';
import { resetPassword } from '../services/authService';

const inputClass = 'h-11 w-full rounded-lg border border-(--border-color) bg-white px-3 text-sm text-(--text-main) transition-colors placeholder:text-(--text-light) focus:border-(--primary) focus:ring-4 focus:ring-(--primary-soft) focus:outline-none disabled:cursor-not-allowed disabled:bg-(--bg-subtle)';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (password !== confirmation) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch {
      setError('This reset link is invalid or expired. Request a new one and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--bg-main) px-5 py-12">
      <section className="page-enter w-full max-w-md rounded-2xl border border-(--border-color) bg-white p-8 shadow-(--shadow-md) sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(image:--primary-gradient) text-white">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-(--text-main)">Employee Management System</p>
            <p className="text-sm text-(--text-muted)">HR Workspace</p>
          </div>
        </div>

        {success ? (
          <div role="status">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-(--primary-soft) text-(--primary)">
              <KeyRound className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-(--text-main)">Password updated</h1>
            <p className="mt-2 text-sm text-(--text-muted)">You can now sign in with your new password.</p>
            <Link to="/login" className="btn btn-primary mt-6 inline-flex">Back to sign in</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-(--text-main)">Set a new password</h1>
            <p className="mt-1.5 text-sm text-(--text-muted)">Choose a password with at least 6 characters.</p>
            {error && <p role="alert" className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>}
            {!token && <p role="alert" className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">This reset link is missing its token. Request a new one.</p>}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block space-y-1.5 text-sm font-medium text-(--text-main)">
                New password
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-(--text-light)" />
                  <input type="password" autoComplete="new-password" minLength={6} required disabled={!token || loading} value={password} onChange={(event) => setPassword(event.target.value)} className={`${inputClass} pl-10`} />
                </div>
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-(--text-main)">
                Confirm new password
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-(--text-light)" />
                  <input type="password" autoComplete="new-password" minLength={6} required disabled={!token || loading} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className={`${inputClass} pl-10`} />
                </div>
              </label>
              <button type="submit" disabled={!token || loading} className="btn btn-primary inline-flex h-11 w-full items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? 'Updating password...' : 'Update password'}
              </button>
            </form>
            <p className="mt-5 text-center text-sm text-(--text-muted)">
              Need another link? <Link to="/login" className="font-medium text-(--primary) hover:underline">Return to sign in</Link>
            </p>
          </>
        )}
      </section>
    </main>
  );
};

export default ResetPasswordPage;