'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, MapPin, Briefcase, X, CheckCircle2, Loader2, Send,
  ChevronLeft, ChevronRight, Bookmark, BookmarkCheck,
  DollarSign, Clock, Building2, SlidersHorizontal, Users,
  UploadCloud, FileCheck
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const TYPE_CONFIG = {
  'Full-time':  { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', dot: 'bg-emerald-500' },
  'Part-time':  { color: 'text-violet-700 dark:text-violet-400',   bg: 'bg-violet-50 dark:bg-violet-950/40',   dot: 'bg-violet-500'  },
  'Contract':   { color: 'text-blue-700 dark:text-blue-400',       bg: 'bg-blue-50 dark:bg-blue-950/40',       dot: 'bg-blue-500'    },
  'Internship': { color: 'text-amber-700 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-950/40',     dot: 'bg-amber-500'   },
  'Remote':     { color: 'text-teal-700 dark:text-teal-400',       bg: 'bg-teal-50 dark:bg-teal-950/40',       dot: 'bg-teal-500'    },
};

// ─── Apply Modal ──────────────────────────────────────────────────────────────
function ApplyModal({ job, onClose, onSuccess }) {
  const { user } = useAuth();
  const [step, setStep]               = useState(1);
  const [submitting, setSubmitting]   = useState(false);
  const [resumeFile, setResumeFile]   = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [dragOver, setDragOver]       = useState(false);
  const fileInputRef                  = React.useRef(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1979 }, (_, i) => currentYear + 1 - i);

  const [form, setForm] = useState({
    fullName:      user?.name  || '',
    email:         user?.email || '',
    yearOfPassout: '',
    skills:        user?.skills?.join(', ') || '',
    coverLetter:   '',
  });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const parseSkills  = (str) => str.split(',').map((s) => s.trim()).filter(Boolean);

  const handleFile = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) { setResumeError('Only PDF or Word (.doc/.docx) allowed.'); return; }
    if (file.size > 5 * 1024 * 1024)           { setResumeError('File size must be under 5 MB.'); return; }
    setResumeError('');
    setResumeFile(file);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim())    { toast.error('Full name is required.'); return; }
    if (!form.email.trim())       { toast.error('Email is required.'); return; }
    if (!form.yearOfPassout)      { toast.error('Year of passout is required.'); return; }

    setSubmitting(true);
    try {
      if (resumeFile) {
        const fd = new FormData();
        fd.append('resume', resumeFile);
        await api.post('/auth/upload-resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      await api.post(`/applications/${job._id}`, {
        coverLetter:     form.coverLetter,
        yearOfPassout:   Number(form.yearOfPassout),
        applicantSkills: parseSkills(form.skills),
      });
      setStep(2);
      onSuccess(job._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply. Try again.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider mb-1">Applying for</p>
              <h2 className="text-lg font-bold text-white leading-tight">{job.title}</h2>
              <p className="text-indigo-200 text-sm mt-0.5">{job.company} · {job.location}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors mt-1">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Step 1: Form */}
        {step === 1 && (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">

            {/* Row 1: Full Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input name="fullName" value={form.fullName} onChange={handleChange} required
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  placeholder="your@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
            </div>

            {/* Row 2: Year of Passout + Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Year of Passout <span className="text-red-500">*</span>
                </label>
                <select name="yearOfPassout" value={form.yearOfPassout} onChange={handleChange} required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer">
                  <option value="">Select year</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Skills <span className="text-slate-400 font-normal normal-case">(comma separated)</span>
                </label>
                <input name="skills" value={form.skills} onChange={handleChange}
                  placeholder="React, Node.js, SQL..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                {form.skills.trim() && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {parseSkills(form.skills).map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Resume / CV
              </label>
              <div onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`cursor-pointer rounded-xl border-2 border-dashed transition-all px-6 py-4 text-center ${
                  dragOver          ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30' :
                  resumeFile        ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/20' :
                  'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-indigo-300 hover:bg-indigo-50/40'
                }`}>
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                {resumeFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <FileCheck className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 truncate max-w-[200px]">{resumeFile.name}</p>
                      <p className="text-xs text-slate-400">{(resumeFile.size / 1024).toFixed(0)} KB · Click to change</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="h-7 w-7 text-slate-300 dark:text-slate-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Drag & drop or <span className="text-indigo-600 dark:text-indigo-400">browse</span></p>
                    <p className="text-xs text-slate-400 mt-0.5">PDF, DOC or DOCX · Max 5 MB</p>
                  </>
                )}
              </div>
              {resumeError && <p className="text-xs text-red-500 mt-1">{resumeError}</p>}
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Cover Letter <span className="text-slate-400 font-normal normal-case">(optional)</span>
              </label>
              <textarea name="coverLetter" value={form.coverLetter} onChange={handleChange} rows={3}
                placeholder="Briefly introduce yourself and explain why you're a great fit..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all" />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={submitting || !!resumeError}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-200 dark:shadow-none">
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting...</> : <><Send className="h-4 w-4" />Submit Application</>}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Success */}
        {step === 2 && (
          <div className="px-6 py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Application Submitted!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Your application for <span className="font-semibold text-slate-700 dark:text-slate-300">{job.title}</span> at{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">{job.company}</span> has been sent successfully.
            </p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, appliedIds, savedIds, onApplyClick, onSaveClick }) {
  const { user } = useAuth();
  const hasApplied = appliedIds.has(job._id);
  const isSaved = savedIds.has(job._id);
  const [saving, setSaving] = useState(false);
  const tc = TYPE_CONFIG[job.type] ?? TYPE_CONFIG['Full-time'];

  const salary = job.salary?.max
    ? `$${(job.salary.min / 1000).toFixed(0)}k – $${(job.salary.max / 1000).toFixed(0)}k / yr`
    : 'Salary not listed';

  const handleSave = async () => {
    if (!user) { toast.error('Login to save jobs.'); return; }
    setSaving(true);
    await onSaveClick(job._id);
    setSaving(false);
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Company avatar */}
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950/60 dark:to-violet-950/60 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900">
              <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">{job.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{job.company}</p>
            </div>
          </div>
          {/* Save button */}
          {user?.role === 'jobseeker' && (
            <button onClick={handleSave} disabled={saving} title={isSaved ? 'Unsave' : 'Save job'}
              className={`shrink-0 p-2 rounded-xl border transition-all ${
                isSaved
                  ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
              }`}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />{job.location}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <DollarSign className="h-3.5 w-3.5 text-slate-400" />{salary}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="h-3.5 w-3.5 text-slate-400" />{job.experience ?? 'Any level'}
          </span>
        </div>

        {/* Type badge + Vacancies */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${tc.bg} ${tc.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${tc.dot}`} />
            {job.type}
          </span>
          {job.vacancies > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
              <Users className="h-3 w-3" />
              {job.vacancies} {job.vacancies === 1 ? 'Vacancy' : 'Vacancies'}
            </span>
          )}
        </div>

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {job.skills.slice(0, 4).map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium border border-slate-200 dark:border-slate-700">
                {s}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700">
                +{job.skills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 mb-4 flex-1 leading-relaxed">{job.description}</p>

        {/* Divider */}
        <div className="border-t border-slate-100 dark:border-slate-800 mb-4" />

        {/* Action */}
        {hasApplied ? (
          <div className="w-full py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-900">
            <CheckCircle2 className="h-4 w-4" /> Application Submitted
          </div>
        ) : user?.role === 'employer' ? (
          <div className="w-full py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 text-sm font-medium text-center border border-slate-200 dark:border-slate-700">
            Not available for employers
          </div>
        ) : (
          <button onClick={() => onApplyClick(job)}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold transition-all shadow-md shadow-indigo-100 dark:shadow-indigo-950/50">
            Apply Now →
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function JobsPage() {
  const { user, toggleSaveJob } = useAuth();
  const router = useRouter();

  const [jobs, setJobs]                 = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [location, setLocation]         = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [total, setTotal]               = useState(0);
  const [appliedIds, setAppliedIds]     = useState(new Set());
  const [savedIds, setSavedIds]         = useState(new Set());
  const [selectedJob, setSelectedJob]   = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (search)       p.append('search', search);
      if (location)     p.append('location', location);
      if (selectedType) p.append('type', selectedType);
      p.append('page', page); p.append('limit', 9);
      const res = await api.get(`/jobs?${p}`);
      if (res.data.success) { setJobs(res.data.jobs); setTotalPages(res.data.pages); setTotal(res.data.total); }
    } catch { toast.error('Failed to load jobs.'); }
    finally { setLoading(false); }
  }, [search, location, selectedType, page]);

  const fetchUserData = useCallback(async () => {
    if (!user || user.role !== 'jobseeker') return;
    try {
      const [a, s] = await Promise.all([api.get('/applications/my'), api.get('/auth/saved-jobs')]);
      if (a.data.success) setAppliedIds(new Set(a.data.applications.map((x) => x.job?._id)));
      if (s.data.success) setSavedIds(new Set(s.data.savedJobs.map((x) => x._id)));
    } catch {}
  }, [user]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);
  useEffect(() => { fetchUserData(); }, [fetchUserData]);
  useEffect(() => { setPage(1); }, [search, location, selectedType]);

  const handleApplyClick = (job) => {
    if (!user) { toast.error('Please login to apply.'); router.push('/login'); return; }
    setSelectedJob(job);
  };

  const handleSaveToggle = async (jobId) => {
    if (!user) { toast.error('Please login to save jobs.'); router.push('/login'); return; }
    const result = await toggleSaveJob(jobId);
    if (result?.success) setSavedIds((prev) => { const n = new Set(prev); n.has(jobId) ? n.delete(jobId) : n.add(jobId); return n; });
  };

  const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── Hero Search Banner ── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Find Your Next <span className="text-indigo-600 dark:text-indigo-400">Opportunity</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">
              {total > 0 ? `${total} open positions across IT & Non-IT sectors` : 'Browse job listings from top companies.'}
            </p>
          </div>

          {/* Search inputs */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title, skill, or company..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
            </div>
            <div className="relative sm:w-64">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="City or Remote..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-md shadow-indigo-200 dark:shadow-none">
              <SlidersHorizontal className="h-4 w-4" /> Search
            </button>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={() => setSelectedType('')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                selectedType === '' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
              }`}>All Types</button>
            {JOB_TYPES.map((t) => (
              <button key={t} onClick={() => setSelectedType(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  selectedType === t ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
                }`}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Results meta */}
        {!loading && jobs.length > 0 && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{jobs.length}</span> of <span className="font-semibold text-slate-900 dark:text-slate-100">{total}</span> results
              {selectedType && <> · <span className="text-indigo-600 dark:text-indigo-400">{selectedType}</span></>}
            </p>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
              </div>
            </div>
            <p className="text-sm text-slate-400">Finding the best opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-16 text-center">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">No jobs found</p>
            <p className="text-sm text-slate-400">Try different keywords or remove some filters.</p>
            <button onClick={() => { setSearch(''); setLocation(''); setSelectedType(''); }}
              className="mt-4 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} appliedIds={appliedIds} savedIds={savedIds}
                onApplyClick={handleApplyClick} onSaveClick={handleSaveToggle} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-900 hover:border-indigo-300 transition-all">
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-xl text-sm font-semibold transition-all ${
                    p === page ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                  }`}>{p}</button>
              ))}
            </div>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-900 hover:border-indigo-300 transition-all">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {selectedJob && (
        <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)}
          onSuccess={(id) => setAppliedIds((prev) => new Set([...prev, id]))} />
      )}
    </div>
  );
}
