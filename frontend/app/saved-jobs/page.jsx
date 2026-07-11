'use client';

import React, { useEffect, useState } from 'react';
import { Bookmark, Briefcase, MapPin, BookmarkX, Loader2, CheckCircle2, Send, X } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Link from 'next/link';

// ─── Apply Modal ──────────────────────────────────────────────────────────────
function ApplyModal({ job, onClose, onSuccess }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/applications/${job._id}`, { coverLetter });
      toast.success('Application submitted!');
      onSuccess(job._id);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Apply for {job.title}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{job.company} · {job.location}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={5}
            placeholder="Tell the employer why you're a great fit..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <><Send className="h-4 w-4" /> Submit</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SavedJobsPage() {
  const { user, toggleSaveJob } = useAuth();
  const [savedJobs, setSavedJobs]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [removingId, setRemovingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'jobseeker') { setLoading(false); return; }
      try {
        const [savedRes, appRes] = await Promise.all([
          api.get('/auth/saved-jobs'),
          api.get('/applications/my'),
        ]);
        if (savedRes.data.success) setSavedJobs(savedRes.data.savedJobs);
        if (appRes.data.success)   setAppliedIds(new Set(appRes.data.applications.map((a) => a.job?._id)));
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  const handleUnsave = async (jobId) => {
    setRemovingId(jobId);
    const result = await toggleSaveJob(jobId);
    if (result?.success) {
      setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
    }
    setRemovingId(null);
  };

  const typeColors = {
    'Full-time':  'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400',
    'Part-time':  'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400',
    'Contract':   'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
    'Internship': 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
    'Remote':     'bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Bookmark className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Saved Jobs</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {savedJobs.length > 0 ? `${savedJobs.length} job${savedJobs.length > 1 ? 's' : ''} saved` : 'Jobs you have bookmarked for later.'}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
            <span className="text-sm">Loading saved jobs...</span>
          </div>

        /* Empty State */
        ) : savedJobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
            <Briefcase className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-2">No saved jobs yet</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
              Click the bookmark icon on any job to save it here.
            </p>
            <Link href="/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors">
              Browse Jobs
            </Link>
          </div>

        /* Saved Job Cards */
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedJobs.map((job) => {
              const hasApplied = appliedIds.has(job._id);
              const salaryText = job.salary?.max
                ? `$${(job.salary.min / 1000).toFixed(0)}k – $${(job.salary.max / 1000).toFixed(0)}k`
                : 'Salary not disclosed';

              return (
                <div key={job._id}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all flex flex-col">

                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Unsave Button */}
                      <button
                        onClick={() => handleUnsave(job._id)}
                        disabled={removingId === job._id}
                        title="Remove from saved"
                        className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-colors"
                      >
                        {removingId === job._id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <BookmarkX className="h-4 w-4" />
                        }
                      </button>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${typeColors[job.type] ?? typeColors['Full-time']}`}>
                        {job.type}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base mb-1">{job.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{job.company}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                    <span>·</span>
                    <span>{salaryText}</span>
                  </div>

                  {/* Skills */}
                  {job.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.skills.slice(0, 4).map((skill) => (
                        <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 mb-4 flex-1">{job.description}</p>

                  {/* Action */}
                  {hasApplied ? (
                    <div className="w-full py-2 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-sm font-medium flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Applied
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {selectedJob && (
        <ApplyModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onSuccess={(id) => setAppliedIds((prev) => new Set([...prev, id]))}
        />
      )}
    </div>
  );
}
