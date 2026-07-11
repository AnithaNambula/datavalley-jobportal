'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, X, Globe, Code2 } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on login and register pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xl tracking-tight">
              <Briefcase className="h-5 w-5" />
              <span>CareerWave</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Discover opportunities that align with your career goals or hire top talents from across the globe with our modern hiring tools.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 text-slate-400">
              <a href="#" className="hover:text-indigo-600 transition-colors"><X className="h-4 w-4" /></a>
              <a href="#" className="hover:text-indigo-600 transition-colors"><Globe className="h-4 w-4" /></a>
              <a href="#" className="hover:text-indigo-600 transition-colors"><Code2 className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-4">For Candidates</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/jobs" className="hover:text-indigo-600 transition-colors">Browse Jobs</Link></li>
              <li><Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Applied Jobs</Link></li>
              <li><Link href="/saved-jobs" className="hover:text-indigo-600 transition-colors">Saved Listings</Link></li>
              <li><Link href="/profile" className="hover:text-indigo-600 transition-colors">My Profile</Link></li>
            </ul>
          </div>

          {/* Business Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-4">For Employers</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Post a Job</Link></li>
              <li><Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Manage Candidates</Link></li>
              <li><Link href="/profile" className="hover:text-indigo-600 transition-colors">Company Profile</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {currentYear} CareerWave. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
