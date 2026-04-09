import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth }           from '../context/AuthContext';
import { useTheme }          from '../context/ThemeContext';
import { setMemoryToken }    from '../api/axiosInstance';
import { UserRole }          from '../types';

const ROLE_META: Record<UserRole, { label: string; pill: string }> = {
  admin: {
    label: 'Admin',
    pill:  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  },
  facility_manager: {
    label: 'Facility Manager',
    pill:  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  student: {
    label: 'Student',
    pill:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
};

// ── SVG icons (kept inline to avoid extra deps) ────────────────────────────────
const LeafIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945
         M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0
         2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
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
const GridIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const BellIcon = ({ count }: { count: number }) => (
  <span className="relative flex items-center">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
    {count > 0 && (
      <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full
                       bg-red-500 text-white text-[9px] font-bold
                       flex items-center justify-center leading-none">
        {count}
      </span>
    )}
  </span>
);
const ReportIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1
         0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
interface NavbarProps {
  role:        string;
  alertCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({ role, alertCount = 0 }) => {
  const navigate          = useNavigate();
  const { clearAuth }     = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMemoryToken(null);
    clearAuth();
    navigate('/login', { replace: true });
  };

  const meta      = ROLE_META[role as UserRole] ?? { label: role, pill: 'bg-gray-100 text-gray-600' };
  const dashPath  = `/dashboard/${role}`;

  // Shared class for nav icon-buttons
  const iconBtn = `w-9 h-9 flex items-center justify-center rounded-xl
                   bg-gray-100/80 dark:bg-slate-700/80
                   text-gray-500 dark:text-slate-400
                   hover:bg-emerald-50 dark:hover:bg-emerald-900/30
                   hover:text-emerald-600 dark:hover:text-emerald-400
                   transition-all duration-200`;

  // Shared class for text nav links
  const navLinkCls = `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
                      text-gray-600 dark:text-slate-400
                      hover:text-emerald-700 dark:hover:text-emerald-400
                      hover:bg-emerald-50/80 dark:hover:bg-emerald-900/20
                      transition-all duration-150`;

  return (
    <header className="sticky top-0 z-30 w-full
                       bg-white/80 dark:bg-slate-900/80
                       backdrop-blur-md
                       border-b border-slate-200/60 dark:border-slate-700/60
                       shadow-sm shadow-black/[0.03] dark:shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* ── Brand ── */}
          <div className="flex items-center gap-3 flex-shrink-0 mr-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600
                            rounded-lg flex items-center justify-center
                            shadow-md shadow-emerald-500/30">
              <LeafIcon />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                Sustainability Tracker
              </p>
              <p className="text-[10px] text-gray-400 dark:text-slate-500">
                UMass Amherst · Group 14
              </p>
            </div>
          </div>

          {/* ── Desktop nav links ── */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            <Link to={dashPath} className={navLinkCls}>
              <GridIcon /> Dashboard
            </Link>
            <a href="#alerts" className={`${navLinkCls} relative`}>
              <BellIcon count={alertCount} /> Alerts
            </a>
            <a href="#reports" className={navLinkCls}>
              <ReportIcon /> Reports
            </a>
          </nav>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Role pill */}
            <span className={`hidden sm:inline-flex text-xs font-semibold
                              px-2.5 py-1 rounded-full ${meta.pill}`}>
              {meta.label}
            </span>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className={iconBtn}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Sign-out (desktop) */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium
                         px-3 py-2 rounded-xl
                         text-gray-600 dark:text-slate-400
                         hover:bg-red-50 dark:hover:bg-red-900/20
                         hover:text-red-600 dark:hover:text-red-400
                         transition-all duration-150"
              aria-label="Sign out"
            >
              <LogoutIcon />
              Sign out
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className={`md:hidden ${iconBtn}`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1
                          border-t border-gray-100 dark:border-slate-700/60
                          animate-fade-in">
            <Link to={dashPath} className={navLinkCls} onClick={() => setMenuOpen(false)}>
              <GridIcon /> Dashboard
            </Link>
            <a href="#alerts"  className={navLinkCls} onClick={() => setMenuOpen(false)}>
              <BellIcon count={alertCount} /> Alerts
            </a>
            <a href="#reports" className={navLinkCls} onClick={() => setMenuOpen(false)}>
              <ReportIcon /> Reports
            </a>

            <div className="flex items-center justify-between px-3 pt-3 mt-1
                            border-t border-gray-100 dark:border-slate-700/60">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${meta.pill}`}>
                {meta.label}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium
                           text-red-500 dark:text-red-400 hover:text-red-600
                           transition-colors"
              >
                <LogoutIcon /> Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;