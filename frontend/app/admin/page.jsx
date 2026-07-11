'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  Users, Briefcase, FileText, TrendingUp, Search,
  Trash2, Loader2, ShieldCheck, UserCheck, Building2,
  ChevronDown, RefreshCw, Calendar, Mail, Crown
} from 'lucide-react';

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent, sub }) {
  const styles = {
    indigo:  { bg: 'bg-indigo-50 dark:bg-indigo-950/40',   text: 'text-indigo-600 dark:text-indigo-400',   val: 'text-indigo-700 dark:text-indigo-300' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', val: 'text-emerald-700 dark:text-emerald-300' },
    violet:  { bg: 'bg-violet-50 dark:bg-violet-950/40',   text: 'text-violet-600 dark:text-violet-400',   val: 'text-violet-700 dark:text-violet-300' },
    amber:   { bg: 'bg-amber-50 dark:bg-amber-950/40',     text: 'text-amber-600 dark:text-amber-400',     val: 'text-amber-700 dark:text-amber-300' },
    sky:     { bg: 'bg-sky-50 dark:bg-sky-950/40',         text: 'text-sky-600 dark:text-sky-400',         val: 'text-sky-700 dark:text-sky-300' },
  };
  const s = styles[accent] ?? styles.indigo;
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center ${s.text}`}>
          <Icon className="h-5 w-5" />
        </div>
        {sub && <span className="text-xs text-slate-400 dark:text-slate-500">{sub}</span>}
      </div>
      <p className={`text-3xl font-extrabold ${s.val}`}>{value ?? '—'}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">{label}</p>
    </div>
  );
}

// ── Role Badge ────────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const map = {
    jobseeker: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-900',
    employer:  'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-900',
    admin:     'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900',
  };
  const icons = { jobseeker: UserCheck, employer: Building2, admin: Crown };
  const Icon = icons[role] ?? UserCheck;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${map[role] ?? map.jobseeker}`}>
      <Icon className="h-3 w-3" />{role}
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats]       = useState(null);
  const [users, setUsers]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Guard: only admin can access
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      toast.error('Access denied.');
      router.push('/');
    }
  }, [user, authLoading, router]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data.success) setStats(res.data.stats);
    } catch {}
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search)     params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      params.append('limit', 50);
      const res = await api.get(`/admin/users?${params}`);
      if (res.data.success) { setUsers(res.data.users); setTotal(res.data.total); }
    } catch { toast.error('Failed to load users.'); }
    finally { setLoading(false); }
  }, [search, roleFilter]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { if (user?.role === 'admin') fetchUsers(); }, [fetchUsers, user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchUsers()]);
    setRefreshing(false);
    toast.success('Refreshed!');
  };

  const handleDelete = async (userId, userName) => {
    if (!confirm(`Delete user "${userName}"? This cannot be undone.`)) return;
    setDeletingId(userId);
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        setTotal((p) => p - 1);
        toast.success(`${userName} deleted.`);
        fetchStats();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    } finally { setDeletingId(null); }
  };

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Admin Panel</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage all registered users</p>
            </div>
          </div>
          <button onClick={handleRefresh} disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard icon={Users}     label="Total Users"      value={stats?.totalUsers}       accent="indigo"  />
          <StatCard icon={UserCheck} label="Jobseekers"       value={stats?.jobseekers}       accent="sky"     />
          <StatCard icon={Building2} label="Employers"        value={stats?.employers}        accent="violet"  />
          <StatCard icon={Briefcase} label="Total Jobs"       value={stats?.totalJobs}        accent="emerald" />
          <StatCard icon={TrendingUp}label="New This Week"    value={stats?.recentSignups}    accent="amber" sub="last 7 days" />
        </div>

        {/* ── Users Table ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">

          {/* Table Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Registered Users</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {total} user{total !== 1 ? 's' : ''} total
                {roleFilter && ` · filtered by ${roleFilter}`}
                {search && ` · "${search}"`}
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or email..."
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              {/* Role filter */}
              <div className="relative">
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                  <option value="">All Roles</option>
                  <option value="jobseeker">Jobseeker</option>
                  <option value="employer">Employer</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              <span className="text-sm">Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No users found.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">#</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {users.map((u, i) => {
                      const avatarSrc = u.avatar
                        ? (u.avatar.startsWith('http') ? u.avatar : `${BASE_URL}${u.avatar}`)
                        : null;
                      const initials = u.name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) ?? '?';
                      return (
                        <tr key={u._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 text-xs text-slate-400 font-mono">{String(i + 1).padStart(2, '0')}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {/* Avatar */}
                              <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs shrink-0 overflow-hidden border border-indigo-100 dark:border-indigo-900">
                                {avatarSrc
                                  ? <img src={avatarSrc} alt={u.name} className="h-full w-full object-cover" />
                                  : initials}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-slate-100">{u.name}</p>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                  <Mail className="h-3 w-3" />{u.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4"><RoleBadge role={u.role} /></td>
                          <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {u.role !== 'admin' ? (
                              <button onClick={() => handleDelete(u._id, u.name)} disabled={deletingId === u._id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 border border-red-100 dark:border-red-900 transition-colors disabled:opacity-50">
                                {deletingId === u._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                Delete
                              </button>
                            ) : (
                              <span className="text-xs text-slate-300 dark:text-slate-600 italic">Protected</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => {
                  const avatarSrc = u.avatar
                    ? (u.avatar.startsWith('http') ? u.avatar : `${BASE_URL}${u.avatar}`)
                    : null;
                  const initials = u.name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) ?? '?';
                  return (
                    <div key={u._id} className="px-4 py-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm shrink-0 overflow-hidden border border-indigo-100 dark:border-indigo-900">
                          {avatarSrc ? <img src={avatarSrc} alt={u.name} className="h-full w-full object-cover" /> : initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">{u.name}</p>
                          <p className="text-xs text-slate-400 truncate">{u.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <RoleBadge role={u.role} />
                            <span className="text-xs text-slate-400">
                              {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      {u.role !== 'admin' && (
                        <button onClick={() => handleDelete(u._id, u.name)} disabled={deletingId === u._id}
                          className="shrink-0 p-2 rounded-lg text-red-500 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 transition-colors disabled:opacity-50">
                          {deletingId === u._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Footer */}
          {!loading && users.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 text-xs text-slate-400 text-center">
              Showing {users.length} of {total} users
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
