'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase, Menu, X, User as UserIcon, Bookmark,
  LayoutDashboard, LogOut, ShieldCheck, ChevronDown
} from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pathname === '/login' || pathname === '/register') return null;

  const isActive = (path) => pathname === path;

  const avatarSrc = user?.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `${BASE_URL}${user.avatar}`)
    : null;

  const initials = user?.name
    ?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) ?? '?';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-2xl tracking-tight shrink-0">
            <Briefcase className="h-6 w-6 stroke-[2.5]" />
            <span>CareerWave</span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-5">
            <Link href="/jobs" className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${isActive('/jobs') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}>
              Search Jobs
            </Link>

            {user && user.role !== 'admin' && (
              <>
                <Link href="/dashboard" className={`text-sm font-medium flex items-center gap-1.5 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${isActive('/dashboard') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}>
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                {user.role === 'jobseeker' && (
                  <Link href="/saved-jobs" className={`text-sm font-medium flex items-center gap-1.5 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${isActive('/saved-jobs') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}>
                    <Bookmark className="h-4 w-4" /> Saved Jobs
                  </Link>
                )}
                <Link href="/profile" className={`text-sm font-medium flex items-center gap-1.5 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${isActive('/profile') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}>
                  <UserIcon className="h-4 w-4" /> Profile
                </Link>
              </>
            )}
          </div>

          {/* ── Desktop Right Side ── */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Admin Panel button — always visible top-right when admin */}
                {user.role === 'admin' && (
                  <Link href="/admin"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border ${
                      isActive('/admin')
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-200 dark:shadow-amber-900/30'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-950/60'
                    }`}>
                    <ShieldCheck className="h-4 w-4" />
                    Admin Panel
                  </Link>
                )}

                {/* User avatar dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {/* Avatar circle */}
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center border-2 border-indigo-100 dark:border-indigo-900 shrink-0">
                      {avatarSrc
                        ? <img src={avatarSrc} alt={user.name} className="h-full w-full object-cover" />
                        : <span className="text-white text-xs font-bold">{initials}</span>
                      }
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">{user.name}</p>
                      <p className="text-xs text-slate-400 capitalize leading-tight">{user.role}</p>
                    </div>
                    <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-50">
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center shrink-0">
                          {avatarSrc
                            ? <img src={avatarSrc} alt={user.name} className="h-full w-full object-cover" />
                            : <span className="text-white text-sm font-bold">{initials}</span>
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-1.5">
                        {user.role === 'admin' && (
                          <Link href="/admin" onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors">
                            <ShieldCheck className="h-4 w-4" /> Admin Panel
                          </Link>
                        )}
                        {user.role !== 'admin' && (
                          <>
                            <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                              <LayoutDashboard className="h-4 w-4 text-indigo-500" /> Dashboard
                            </Link>
                            <Link href="/profile" onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                              <UserIcon className="h-4 w-4 text-violet-500" /> My Profile
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 py-1.5">
                        <button onClick={() => { setDropdownOpen(false); logout(); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-2 py-1.5">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-sm shadow-indigo-100 dark:shadow-none hover:-translate-y-px">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-500 dark:text-slate-400">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-1">
          <Link href="/jobs" onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
            Search Jobs
          </Link>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30">
                  <ShieldCheck className="h-4 w-4" /> Admin Panel
                </Link>
              )}
              {user.role !== 'admin' && (
                <>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <LayoutDashboard className="h-4 w-4 text-indigo-500" /> Dashboard
                  </Link>
                  {user.role === 'jobseeker' && (
                    <Link href="/saved-jobs" onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <Bookmark className="h-4 w-4 text-indigo-500" /> Saved Jobs
                    </Link>
                  )}
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <UserIcon className="h-4 w-4 text-violet-500" /> Profile
                  </Link>
                </>
              )}

              {/* Mobile user info + logout */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-2">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                  <div className="h-9 w-9 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center shrink-0 border-2 border-indigo-100 dark:border-indigo-900">
                    {avatarSrc
                      ? <img src={avatarSrc} alt={user.name} className="h-full w-full object-cover" />
                      : <span className="text-white text-xs font-bold">{initials}</span>
                    }
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                  </div>
                </div>
                <button onClick={() => { setMobileMenuOpen(false); logout(); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-2 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Login
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
