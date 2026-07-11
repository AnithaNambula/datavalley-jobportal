'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight, Briefcase, Users, ShieldCheck, Search,
  Sparkles, MapPin, TrendingUp, Clock, CheckCircle2, Building2
} from 'lucide-react';

const STATS = [
  { value: '12,000+', label: 'Active Listings',     color: 'text-sky-600' },
  { value: '4,500+',  label: 'Verified Employers',  color: 'text-violet-600' },
  { value: '80,000+', label: 'Talented Jobseekers', color: 'text-emerald-600' },
  { value: '$85k+',   label: 'Avg. Annual Salary',  color: 'text-rose-500' },
];

const FEATURES = [
  {
    icon: Search,
    title: 'Smart Job Search',
    desc: 'Filter by location, salary, experience, and job type to find exactly what you are looking for — fast.',
    gradient: 'from-sky-400 to-blue-600',
    light: 'bg-sky-50 dark:bg-sky-950/40',
    text: 'text-sky-600 dark:text-sky-400',
  },
  {
    icon: Users,
    title: 'One-Click Apply',
    desc: 'Send your resume and cover letter directly to top employers. Track every application status in real time.',
    gradient: 'from-violet-400 to-indigo-600',
    light: 'bg-violet-50 dark:bg-violet-950/40',
    text: 'text-violet-600 dark:text-violet-400',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Employers',
    desc: 'Every company on CareerWave is verified. Browse with confidence knowing every listing is legitimate.',
    gradient: 'from-emerald-400 to-teal-600',
    light: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: TrendingUp,
    title: 'Career Insights',
    desc: 'Get real-time salary benchmarks, in-demand skill data, and growth trends tailored to your field.',
    gradient: 'from-amber-400 to-orange-500',
    light: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-600 dark:text-amber-400',
  },
  {
    icon: Clock,
    title: 'Application Tracking',
    desc: 'Never lose track of where you stand. Monitor every stage from applied to hired in your personal dashboard.',
    gradient: 'from-rose-400 to-pink-600',
    light: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-600 dark:text-rose-400',
  },
  {
    icon: Building2,
    title: 'IT & Non-IT Jobs',
    desc: 'From software engineering to healthcare and finance — CareerWave covers every industry and every role.',
    gradient: 'from-cyan-400 to-sky-600',
    light: 'bg-cyan-50 dark:bg-cyan-950/40',
    text: 'text-cyan-600 dark:text-cyan-400',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Create Account',    desc: 'Sign up in seconds as a jobseeker or employer.',          color: 'bg-sky-500' },
  { step: '02', title: 'Build Your Profile',desc: 'Upload your resume, set your skills and preferences.',    color: 'bg-violet-500' },
  { step: '03', title: 'Apply to Jobs',     desc: 'Browse listings and submit applications with one click.', color: 'bg-emerald-500' },
  { step: '04', title: 'Get Hired',         desc: 'Track your status and land your dream role.',             color: 'bg-amber-500' },
];

export default function Home() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen overflow-hidden">

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-sky-50 to-violet-50 dark:from-slate-950 dark:via-sky-950/20 dark:to-violet-950/20" />
        {/* Decorative blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] rounded-full bg-sky-200/50 dark:bg-sky-900/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-violet-200/40 dark:bg-violet-900/20 blur-3xl pointer-events-none" />
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-emerald-100/40 dark:bg-emerald-900/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-sky-100 dark:border-sky-900 shadow-sm text-xs font-semibold text-sky-600 dark:text-sky-400 mb-8">
            <Sparkles className="h-3.5 w-3.5 fill-sky-500 text-sky-500" />
            The Next-Generation Hiring Platform
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto mb-6 leading-tight">
            <span className="text-slate-900 dark:text-white">Find Your Dream Job,</span>
            <br />
            <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
              Build Your Future
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with world-class employers, manage your applications in real-time,
            and discover roles that perfectly fit your skills.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link href="/jobs"
              className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-violet-600 hover:from-sky-600 hover:to-violet-700 text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-sky-200 dark:shadow-sky-900/30 hover:shadow-xl hover:shadow-sky-300/40 hover:-translate-y-0.5">
              <Search className="h-5 w-5" />
              Search Active Jobs
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/register?role=employer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-base flex items-center justify-center gap-2.5 text-slate-700 dark:text-slate-200 transition-all hover:-translate-y-0.5">
              <Briefcase className="h-5 w-5 text-violet-500" />
              Post a Job Listing
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 dark:text-slate-500 mb-16">
            {['Free to join', 'No hidden fees', '10,000+ companies hiring', 'Updated daily'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {t}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {STATS.map(({ value, label, color }) => (
              <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 text-center hover:shadow-md transition-shadow">
                <p className={`text-3xl font-extrabold ${color} mb-1`}>{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-3">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Get Hired in 4 Simple Steps</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc, color }, i) => (
              <div key={step} className="relative group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-6 h-0.5 bg-slate-200 dark:bg-slate-700 z-10" />
                )}
                <div className={`h-12 w-12 rounded-xl ${color} flex items-center justify-center text-white font-extrabold text-lg mb-4 shadow-md`}>
                  {step}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Why CareerWave?</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">
              Everything you need to find your perfect role — or your perfect hire.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, gradient, light, text }) => (
              <div key={title} className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-7 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all overflow-hidden">
                {/* Hover gradient top bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl`} />
                <div className={`h-12 w-12 rounded-xl ${light} flex items-center justify-center ${text} mb-5`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-violet-600 to-purple-700" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Ready to Take the Next Step?
          </h2>
          <p className="text-sky-100 text-lg mb-10 max-w-xl mx-auto">
            Join over 80,000 professionals who found their dream job on CareerWave.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register"
              className="px-8 py-4 rounded-2xl bg-white hover:bg-sky-50 text-violet-700 font-bold text-base transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
              Get Started — It's Free
            </Link>
            <Link href="/jobs"
              className="px-8 py-4 rounded-2xl border-2 border-white/30 hover:border-white/60 text-white font-bold text-base transition-all hover:-translate-y-0.5 backdrop-blur-sm">
              Browse Jobs First
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
