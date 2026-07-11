'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase, Clock, CheckCircle2, XCircle, Star,
  FileText, Loader2, MapPin, ArrowRight, TrendingUp,
  Bookmark, Search, Bell, Calendar, ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import Link from 'next/link';

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS = {
  pending:     { label: 'Pending',     color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-950/40',   bar: 'bg-amber-400',   icon: Clock },
  reviewed:    { label: 'Reviewed',    color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-950/40',     bar: 'bg-blue-400',    icon: FileText },
  shortlisted: { label: 'Shortlisted', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40', bar: 'bg-indigo-500',  icon: Star },
  rejected:    { label: 'Rejected',    color: 'text-red-500 dark:text-red-400',       bg: 'bg-red-50 dark:bg-red-950/40',       bar: 'bg-red-400',     icon: XCircle },
  hired:       { label: 'Hired',       color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', bar: 'bg-emerald-500', icon: CheckCircle2 },
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, accent }) {
  const accents = {
    indigo:  { bg: 'bg-indigo-600',  light: 'bg-indigo-50 dark:bg-indigo-950/50',  text: 'text-indigo-600 dark:text-indigo-400',  glow: 'shadow-indigo-100 dark:shadow-indigo-950' },
    amber:   { bg: 'bg-amber-500',   light: 'bg-amber-50 dark:bg-amber-950/50',    text: 'text-amber-600 dark:text-amber-400',    glow: 'shadow-amber-100 dark:shadow-amber-950' },
    emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-50 dark:bg-emerald-950/50',text: 'text-emerald-600 dark:text-emerald-400',glow: 'shadow-emerald-100 dark:shadow-emerald-950' },
    violet:  { bg: 'bg-violet-600',  light: 'bg-violet-50 dark:bg-violet-950/50',  text: 'text-violet-600 dark:text-violet-400',  glow: 'shadow-violet-100 dark:shadow-violet-950' },
  };
  const a = accents[accent] ?? accents.indigo;

  return (
    <div className={`relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all overflow-hidden group`}>
      {/* Decorative blob */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${a.bg} opacity-40 group-hover:opacity-60 transition-opacity blur-2xl`} />
      <div className="relative">
        <div className={`inline-flex items-center justify-center h-11 w-11 rounded-xl ${a.light} ${a.text} mb-4`}>
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">{value}</p>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ── Application Row ───────────────────────────────────────────────────────────
function ApplicationRow({ app, index }) {
  const s = STATUS[app.status] ?? STATUS.pending;
  const Icon = s.icon;

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-sm transition-all">
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Index bubble */}
        <div className="hidden sm:flex h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
          <Briefcase className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-tight">
            {app.job?.title ?? 'Position Removed'}
          </h3>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-slate-500 dark:text-slate-400">{app.job?.company ?? '—'}</span>
            {app.job?.location && (
              <>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />{app.job.location}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 pl-12 sm:pl-0">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${s.color} ${s.bg}`}>
          <Icon className="h-3 w-3" />
          {s.label}
        </span>
        <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
          <Calendar className="h-3 w-3" />
          {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedCount, setSavedCount]     = useState(0);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetchData = async () => {
      try {
        const [appRes, savedRes] = await Promise.all([
          user.role === 'jobseeker' ? api.get('/applications/my') : Promise.resolve(null),
          user.role === 'jobseeker' ? api.get('/auth/saved-jobs')  : Promise.resolve(null),
        ]);
        if (appRes?.data?.success)   setApplications(appRes.data.applications);
        if (savedRes?.data?.success) setSavedCount(savedRes.data.savedJobs.length);
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  const counts = {
    total:       applications.length,
    pending:     applications.filter((a) => a.status === 'pending').length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    hired:       applications.filter((a) => a.status === 'hired').length,
    reviewed:    applications.filter((a) => a.status === 'reviewed').length,
    rejected:    applications.filter((a) => a.status === 'rejected').length,
  };

  const recentApps = applications.slice(0, 5);

  // Progress pipeline steps
  const pipeline = [
    { key: 'pending',     label: 'Applied'  },
    { key: 'reviewed',    label: 'Reviewed' },
    { key: 'shortlisted', label: 'Shortlisted' },
    { key: 'hired',       label: 'Hired'    },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* ── Hero Banner ── */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 sm:p-10 shadow-xl shadow-indigo-200 dark:shadow-indigo-950">
          {/* Decorative circles */}
          <div className="absolute top-[-40px] right-[-40px] w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-[-60px] right-[10%] w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-[20%] right-[25%] w-20 h-20 rounded-full bg-white/10 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-indigo-200 text-sm font-medium mb-1">{greeting()},</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {user?.name ?? 'Jobseeker'} 👋
              </h1>
              <p className="text-indigo-200 mt-2 text-sm max-w-md">
                {counts.total === 0
                  ? "You haven't applied to any jobs yet. Start exploring opportunities!"
                  : `You have ${counts.total} application${counts.total > 1 ? 's' : ''} — ${counts.pending} pending review.`}
              </p>
            </div>
            <Link href="/jobs"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-700 font-semibold text-sm hover:bg-indigo-50 transition-all shadow-md whitespace-nowrap shrink-0">
              <Search className="h-4 w-4" />
              Browse Jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Briefcase}    label="Total Applied"  value={counts.total}       sub="all time"        accent="indigo"  />
              <StatCard icon={Clock}        label="Pending"        value={counts.pending}     sub="awaiting reply"  accent="amber"   />
              <StatCard icon={Star}         label="Shortlisted"    value={counts.shortlisted} sub="in consideration" accent="violet"  />
              <StatCard icon={CheckCircle2} label="Hired"          value={counts.hired}       sub="offers received" accent="emerald" />
            </div>

            {/* ── Two Column Layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ── Recent Applications (2/3 width) ── */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Applications</h2>
                  {applications.length > 5 && (
                    <Link href="/dashboard" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 hover:underline">
                      View all <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>

                {applications.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="h-7 w-7 text-slate-400" />
                    </div>
                    <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">No applications yet</p>
                    <p className="text-sm text-slate-400 mb-4">Apply to jobs and track your progress here.</p>
                    <Link href="/jobs" className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors">
                      Start Applying
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentApps.map((app, i) => (
                      <ApplicationRow key={app._id} app={app} index={i} />
                    ))}
                  </div>
                )}
              </div>

              {/* ── Right Sidebar (1/3 width) ── */}
              <div className="space-y-5">

                {/* Application Pipeline */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <TrendingUp className="h-4 w-4 text-indigo-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Application Pipeline</h3>
                  </div>
                  <div className="space-y-3">
                    {pipeline.map(({ key, label }) => {
                      const s = STATUS[key];
                      const count = counts[key] ?? 0;
                      const pct = counts.total > 0 ? Math.round((count / counts.total) * 100) : 0;
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{count}</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${s.bar} transition-all duration-700`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link href="/jobs"
                      className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/70 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Search className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Search Jobs</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link href="/saved-jobs"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Bookmark className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Saved Jobs {savedCount > 0 && <span className="ml-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-full">{savedCount}</span>}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link href="/profile"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Bell className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Update Profile</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Status Legend */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Status Guide</h3>
                  <div className="space-y-2.5">
                    {Object.entries(STATUS).map(([key, s]) => {
                      const Icon = s.icon;
                      return (
                        <div key={key} className="flex items-center gap-2.5">
                          <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${s.bg}`}>
                            <Icon className={`h-3 w-3 ${s.color}`} />
                          </span>
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{s.label}</span>
                          <span className={`ml-auto text-xs font-bold ${s.color}`}>
                            {counts[key] ?? 0}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
