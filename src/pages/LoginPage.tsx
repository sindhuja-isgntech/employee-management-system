import React, { useState } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  CalendarCheck,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { hasAnyRole, loginUser, requestPasswordReset } from '../services/authService';

const FEATURES = [
  { icon: Users, title: 'Employee records', text: 'Profiles, departments and designations in one place.' },
  { icon: CalendarCheck, title: 'Attendance & leave', text: 'Daily check-ins and leave requests, tracked end to end.' },
  { icon: ShieldCheck, title: 'Role-based access', text: 'Admin, HR and employee views, secured with JWT.' },
];

const inputClass =
  'h-11 w-full rounded-lg border border-(--border-color) bg-white pr-3 pl-10 text-sm text-(--text-main) transition-colors placeholder:text-(--text-light) focus:border-(--primary) focus:ring-4 focus:ring-(--primary-soft) focus:outline-none disabled:cursor-not-allowed disabled:bg-(--bg-subtle)';

type LoginCredentials = {
    email: string;
    password: string;
};

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
  const queryClient = useQueryClient();
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: '',
        password: '',
    });

const [loading , setLoading] = useState<boolean>(false);
const [error , setError] = useState<string | null>(null);
const [showPassword, setShowPassword] = useState<boolean>(false);
const [forgotPassword, setForgotPassword] = useState(false);
const [resetNotice, setResetNotice] = useState<string | null>(null);
const [resetLoading, setResetLoading] = useState(false);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const auth = await loginUser(credentials);
      queryClient.clear();
      const homePath = hasAnyRole(auth.user.roles, ['ADMIN', 'HR']) ? '/dashboard' : '/my-profile';
      navigate(homePath, { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError<{ message?: string }>(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (axios.isAxiosError(err) && !err.response) {
        setError('Cannot reach the sign-in service. Check that the backend is running and this page is opened from localhost.');
      } else {
        setError('Sign-in failed. Verify your email and password, then try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setResetLoading(true);
      setError(null);
      setResetNotice(null);
      try {
        await requestPasswordReset(credentials.email);
        setResetNotice('If an account exists for that email, a password reset link will be sent.');
      } catch {
        setError('Unable to process your request right now. Please try again later.');
      } finally {
        setResetLoading(false);
      }
  };

return (
    <div className="flex min-h-screen w-full bg-(--bg-main)">
      {/* Brand panel (large screens) */}
      <aside className="relative hidden w-[46%] max-w-2xl flex-col justify-between overflow-hidden bg-(image:--primary-gradient) p-12 text-white lg:flex">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg leading-tight font-semibold">Employee Management System</p>
            <p className="text-sm text-white/70">HR Workspace</p>
          </div>
        </div>

        <div className="page-enter relative max-w-md">
          <h1 className="text-4xl leading-tight font-bold tracking-tight">
            Manage your workforce with confidence.
          </h1>
          <p className="mt-4 text-base text-white/80">
            One secure workspace for people, attendance and leave, so HR can focus on people rather than paperwork.
          </p>

          <ul className="stagger mt-10 space-y-5">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-white/75">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/60">
          © {new Date().getFullYear()} Employee Management System. All rights reserved.
        </p>
      </aside>

      {/* Sign-in panel */}
      <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <div className="page-enter w-full max-w-md">
          {/* Compact brand (small screens) */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(image:--primary-gradient) text-white shadow-md">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="leading-tight font-semibold text-(--text-main)">Employee Management System</p>
              <p className="text-sm text-(--text-muted)">HR Workspace</p>
            </div>
          </div>

          <div className="rounded-2xl border border-(--border-color) bg-white p-8 shadow-(--shadow-md) sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-(--text-main)">{forgotPassword ? 'Reset your password' : 'Welcome back'}</h2>
              <p className="mt-1.5 text-sm text-(--text-muted)">{forgotPassword ? 'Enter your work email to receive a reset link.' : 'Sign in with your work email to continue.'}</p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-lg border border-(--danger)/25 bg-(--danger-soft) px-4 py-3 text-sm text-(--danger)"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {resetNotice && (
              <div role="status" className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {resetNotice}
              </div>
            )}

            <form onSubmit={forgotPassword ? handleForgotPassword : handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="block text-sm font-medium text-(--text-main)">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-(--text-light)" />
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    autoComplete="username"
                    autoFocus
                    required
                    disabled={loading || resetLoading}
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className={inputClass}
                  />
                </div>
              </div>

              {!forgotPassword && <div className="space-y-1.5">
                <label htmlFor="login-password" className="block text-sm font-medium text-(--text-main)">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-(--text-light)" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-(--text-light) transition-colors hover:bg-(--bg-subtle) hover:text-(--text-main)"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>}

              {!forgotPassword && (
                <div className="-mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setForgotPassword(true); setError(null); setResetNotice(null); }}
                    className="text-sm font-medium text-(--primary) hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || resetLoading}
                className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-(--primary) text-sm font-semibold text-white shadow-sm transition-colors hover:bg-(--primary-hover) focus:ring-4 focus:ring-(--primary-soft) focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading || resetLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {forgotPassword ? 'Sending link...' : 'Signing in...'}
                  </>
                ) : (
                  <>
                    {forgotPassword ? 'Send reset link' : 'Sign in'}
                    {!forgotPassword && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
                  </>
                )}
              </button>
            </form>

            {forgotPassword && (
              <button
                type="button"
                onClick={() => { setForgotPassword(false); setError(null); setResetNotice(null); }}
                className="mt-4 w-full text-center text-sm font-medium text-(--primary) hover:underline"
              >
                Back to sign in
              </button>
            )}

            <div className="mt-8 flex items-center gap-2 border-t border-(--border-color) pt-6 text-xs text-(--text-muted)">
              <ShieldCheck className="h-4 w-4 shrink-0 text-(--primary)" />
              <span>Access is restricted to authorised staff. Contact your HR administrator if you need an account.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;