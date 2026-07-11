'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, KeyRound, Mail, User as UserIcon, Building, Loader2, ArrowRight } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['jobseeker', 'employer']),
  company: z.string().optional(),
}).refine((data) => {
  if (data.role === 'employer' && (!data.company || data.company.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: 'Company name is required for employers',
  path: ['company'],
});

export default function Register() {
  const { register: registerUser, user, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'employer' ? 'employer' : 'jobseeker';

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const {
    register: registerField,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: initialRole,
      company: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setSubmitting(true);
    const result = await registerUser(data.name, data.email, data.password, data.role, data.company);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-slate-950">
      {/* Left Column (Branding & visual) */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-indigo-600 overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-800 opacity-90 z-0" />
        <div className="absolute top-[20%] left-[-20%] w-[400px] h-[400px] rounded-full bg-indigo-300/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-2xl tracking-tight">
            <Briefcase className="h-6 w-6 stroke-[2.5]" />
            <span>CareerWave</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight">
            Create an Account <br />
            & Explore Opportunities.
          </h2>
          <p className="text-indigo-100 max-w-sm leading-relaxed text-sm">
            Whether you are here to hire outstanding engineers or to apply for your next engineering manager gig, we have got you covered.
          </p>
        </div>

        <div className="relative z-10 text-xs text-indigo-200">
          © {new Date().getFullYear()} CareerWave. Modern Hiring Ecosystem.
        </div>
      </div>

      {/* Right Column (Form container) */}
      <div className="lg:col-span-7 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Create Account</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Sign up today and unlock customized career features
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selection Slider */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Registering As
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
                <button
                  type="button"
                  onClick={() => setValue('role', 'jobseeker')}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedRole === 'jobseeker'
                      ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setValue('role', 'employer')}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedRole === 'employer'
                      ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Employer
                </button>
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-sm"
                  {...registerField('name')}
                />
              </div>
              {errors.name && (
                <p className="text-xs font-medium text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-sm"
                  {...registerField('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-sm"
                  {...registerField('password')}
                />
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Conditional Company Name Input */}
            {selectedRole === 'employer' && (
              <div className="space-y-1.5 animate-fade-in">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Company Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-sm"
                    {...registerField('company')}
                  />
                </div>
                {errors.company && (
                  <p className="text-xs font-medium text-red-600 mt-1">{errors.company.message}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-100 dark:shadow-none disabled:opacity-75 disabled:pointer-events-none"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-sm text-center text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
