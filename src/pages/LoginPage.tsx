import React, { useState, FormEvent } from 'react';
import { useNavigate }    from 'react-router-dom';
import axios              from 'axios';
import { loginRequest }   from '../api/authApi';
import { setMemoryToken } from '../api/axiosInstance';
import { useAuth }        from '../context/AuthContext';
import { useTheme }       from '../context/ThemeContext';

// ── User-facing error messages ────────────────────────────────────────────────
const HTTP_ERRORS: Record<number, string> = {
  401: 'Incorrect credentials, please try again.',
  403: 'Your account does not have access to this system.',
  429: 'Too many attempts — please wait a moment and try again.',
  500: 'Server error. Please try again in a few seconds.',
  503: 'Service unavailable. The backend may be starting up.',
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const LeafIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945
         M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0
         2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
  </svg>
);
const EyeOpenIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
         -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EyeClosedIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7
         a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878
         l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59
         3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025
         10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);
const SunIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 3v1m0 16v1m8.66-9H21M3 12H2m15.07-6.07-.7.7M7.63 17.37l-.7.7
         M17.37 17.37l-.7-.7M7.63 6.63l-.7-.7M12 7a5 5 0 100 10A5 5 0 0012 7z" />
  </svg>
);
const MoonIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);
const SpinnerIcon = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
const LoginPage: React.FC = () => {
  const navigate            = useNavigate();
  const { setAuth }         = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [username,     setUsername]     = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe,   setRememberMe]   = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [isLoading,    setIsLoading]    = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await loginRequest({ username, password });
      setMemoryToken(data.access_token);   // in-memory only — never localStorage
      setAuth(data.access_token, data.role);
      navigate(`/dashboard/${data.role}`, { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          HTTP_ERRORS[err.response.status]
          ?? `Unexpected error (${err.response.status}). Please try again.`,
        );
      } else {
        setError('Unable to reach the server. Check your network and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = username.trim().length > 0 && password.length > 0 && !isLoading;

  // Shared input class
  const inputCls = `
    w-full px-4 py-2.5 rounded-xl text-sm
    bg-white dark:bg-slate-700/60
    border border-gray-200 dark:border-slate-600
    text-gray-900 dark:text-slate-100
    placeholder-gray-400 dark:placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400
    focus:border-transparent disabled:opacity-50 transition-all duration-150
  `;

  return (
    <div className="min-h-screen
                    bg-gradient-to-br from-emerald-50 via-sky-50 to-violet-100
                    dark:from-slate-950 dark:via-slate-900 dark:to-slate-900
                    flex items-center justify-center px-4 py-12">

      {/* ── Floating theme toggle ── */}
      <button
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="fixed top-4 right-4 z-50
                   w-10 h-10 flex items-center justify-center rounded-xl
                   bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm
                   border border-gray-200 dark:border-slate-700
                   text-gray-500 dark:text-slate-400
                   hover:text-emerald-600 dark:hover:text-emerald-400
                   hover:border-emerald-300 dark:hover:border-emerald-600
                   shadow-md transition-all duration-200"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className="w-full max-w-md animate-fade-in">

        {/* ── Branding header ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center
                          w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600
                          rounded-2xl shadow-2xl shadow-emerald-500/30 mb-5">
            <LeafIcon />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Campus Sustainability Tracker
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-slate-400">
            University of Massachusetts Amherst
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xs text-gray-400 dark:text-slate-500">
              
            </span>
          </div>
        </div>

        {/* ── Login card ── */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md
                        rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40
                        border border-white dark:border-slate-700/50
                        p-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-6 text-center">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} noValidate data-testid="login-form">

            {/* Error banner */}
            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-3
                           bg-red-50 dark:bg-red-900/20
                           border border-red-200 dark:border-red-800/50
                           text-red-700 dark:text-red-400
                           rounded-xl p-4 text-sm animate-fade-in"
              >
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414
                       1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293
                       1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10
                       8.586 8.707 7.293z"
                    clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Username */}
            <div className="mb-4">
              <label htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                Username
              </label>
              <input
                id="username" type="text" autoComplete="username" required
                value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                className={inputCls}
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password" required
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`${inputCls} pr-11`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-400 dark:text-slate-500
                             hover:text-emerald-600 dark:hover:text-emerald-400
                             transition-colors duration-150 p-0.5"
                >
                  {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center mb-6">
              <input
                id="remember-me" type="checkbox"
                checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 dark:border-slate-600
                           text-emerald-600 focus:ring-emerald-500
                           bg-white dark:bg-slate-700 cursor-pointer"
              />
              <label htmlFor="remember-me"
                className="ml-2 text-sm text-gray-600 dark:text-slate-400
                           select-none cursor-pointer">
                Remember me on this device
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full
                         bg-gradient-to-r from-emerald-600 to-teal-600
                         hover:from-emerald-700 hover:to-teal-700
                         active:from-emerald-800 active:to-teal-800
                         text-white font-semibold py-2.5 px-4 rounded-xl text-sm
                         shadow-lg shadow-emerald-500/30
                         transition-all duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                         focus:outline-none focus:ring-2 focus:ring-emerald-500
                         focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
              {isLoading
                ? <span className="flex items-center justify-center gap-2">
                    <SpinnerIcon /> Signing in…
                  </span>
                : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;