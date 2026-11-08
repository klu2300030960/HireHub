import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bookmark,
  Menu,
  X,
  ArrowUpRight,
  Briefcase,
  Compass,
  FileText,
  Target,
  LayoutDashboard,
  LogOut,
  Building2,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { savedJobIds, isAuthenticated, logout, candidateProfile } = useApp();

  const navLinks = [
    { label: 'Home', path: '/', icon: Briefcase },
    { label: 'Find Jobs', path: '/jobs', icon: Search },
    { label: 'Companies', path: '/companies', icon: Building2 },
    { label: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
    { label: 'Skill Gap', path: '/skill-gap', icon: Target },
    { label: 'Eligibility', path: '/eligibility', icon: CheckCircle2 },
    { label: 'Tracker', path: '/tracker', icon: LayoutDashboard },
    { label: 'Career Guidance', path: '/career-guidance', icon: Compass },
    ...(isAuthenticated ? [{ label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }] : [])
  ];

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-2 sm:gap-4">
            
            {/* Brand Logo Zone (Touch friendly) */}
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-2.5 shrink-0 group focus:outline-none min-h-[44px]"
              aria-label="HireHub Home"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-blue-600 transition-colors shrink-0">
                <Briefcase className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                  Hire<span className="text-blue-600">Hub</span>
                </span>
                <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                  Tech Career Gateway
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Large Screens) */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[40px] flex items-center ${
                      active
                        ? 'text-blue-600 bg-blue-50/80 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Zone */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              
              {/* Saved Jobs Icon with counter (Touch friendly) */}
              <Link
                to="/saved-jobs"
                title="Saved Jobs"
                className="relative p-2.5 sm:p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={`Saved Jobs, ${savedJobIds.length} bookmarked`}
              >
                <Bookmark className="w-5 h-5" />
                {savedJobIds.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {savedJobIds.length}
                  </span>
                )}
              </Link>

              {/* Desktop Auth Buttons / User Profile */}
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-xl transition-colors min-h-[44px]"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {candidateProfile.name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">
                      {candidateProfile.name}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={logout}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer min-h-[44px] flex items-center"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap min-h-[44px] flex items-center"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 rounded-lg shadow-sm transition-colors whitespace-nowrap min-h-[44px]"
                  >
                    <span>Sign Up</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Mobile Menu Hamburger Button (Min 44x44px Touch Target) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden w-11 h-11 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================
          MOBILE NAVIGATION DRAWER & BACKDROP
          ======================================================== */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex flex-col bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          
          {/* Top Bar for Mobile Menu */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-slate-900 text-base">
                Hire<span className="text-blue-600">Hub</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Navigation List */}
          <div className="flex-1 bg-white overflow-y-auto px-4 py-4 space-y-4">
            
            {/* Candidate Profile Widget if Logged In */}
            {isAuthenticated ? (
              <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {candidateProfile.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block leading-tight">
                      {candidateProfile.name}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {candidateProfile.degree} ({candidateProfile.graduationYear})
                    </span>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 bg-white text-blue-700 text-xs font-bold rounded-lg border border-blue-200 shadow-2xs"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pb-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full min-h-[44px] flex items-center justify-center text-center px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full min-h-[44px] flex items-center justify-center text-center px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
                >
                  Create Account
                </Link>
              </div>
            )}

            {/* Links Group */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1">
                Platform Navigation
              </span>

              {navLinks.map((link) => {
                const active = isActive(link.path);
                const IconComponent = link.icon;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-colors min-h-[46px] ${
                      active
                        ? 'text-blue-600 bg-blue-50/80 font-bold'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </Link>
                );
              })}
            </div>

            {/* Saved Jobs dedicated row */}
            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/saved-jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 min-h-[46px]"
              >
                <span className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4 text-purple-600" />
                  <span>Saved Vacancies</span>
                </span>
                <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {savedJobIds.length}
                </span>
              </Link>
            </div>

            {/* Sign Out on Mobile */}
            {isAuthenticated && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer min-h-[46px]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of HireHub</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};
