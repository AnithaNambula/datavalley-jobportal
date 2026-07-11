'use client';

import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Camera, Loader2, MapPin, Phone, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, uploadUserAvatar } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

  const getAvatarSrc = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      toast.error('Only JPG, PNG or WEBP images allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2 MB.');
      return;
    }

    setUploading(true);
    await uploadUserAvatar(file);   // updates user.avatar in context + DB
    setUploading(false);
    e.target.value = '';
  };

  const initials = user?.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  // Always read avatar from context user — persists across re-renders & logins
  const avatarSrc = getAvatarSrc(user?.avatar);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">My Profile</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">View and manage your account details.</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">

          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          </div>

          <div className="px-6 pb-6">
            {/* Avatar row */}
            <div className="flex items-end justify-between -mt-12 mb-5">
              <div className="relative group">
                {/* Circle */}
                <div className="h-24 w-24 rounded-full border-4 border-white dark:border-slate-900 shadow-lg overflow-hidden bg-indigo-600 flex items-center justify-center">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-white text-3xl font-bold select-none">{initials}</span>
                  )}

                  {/* Hover overlay */}
                  {!uploading && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="h-6 w-6 text-white mb-0.5" />
                      <span className="text-white text-[10px] font-semibold">Change</span>
                    </div>
                  )}

                  {/* Upload spinner overlay */}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                </div>

                {/* Camera badge button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  title="Upload profile photo"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md transition-colors disabled:opacity-60"
                >
                  {uploading
                    ? <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                    : <Camera className="h-3.5 w-3.5 text-white" />}
                </button>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Role badge */}
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 capitalize mb-1">
                <Briefcase className="h-3 w-3" />
                {user?.role ?? 'Guest'}
              </span>
            </div>

            {/* Name */}
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user?.name ?? 'Guest User'}</h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5 mb-5">
              {uploading ? 'Uploading photo...' : 'Click the camera icon to update your profile photo'}
            </p>

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-slate-800 mb-5" />

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailCard icon={<Mail className="h-4 w-4 text-indigo-500" />}   label="Email"    value={user?.email} />
              <DetailCard icon={<Shield className="h-4 w-4 text-violet-500" />} label="Role"     value={user?.role}  capitalize />
              {user?.phone    && <DetailCard icon={<Phone className="h-4 w-4 text-emerald-500" />}  label="Phone"    value={user.phone} />}
              {user?.location && <DetailCard icon={<MapPin className="h-4 w-4 text-rose-500" />}    label="Location" value={user.location} />}
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-5 text-center">
              Supported formats: JPG, PNG, WEBP · Max size: 2 MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value, capitalize }) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
      <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className={`text-sm font-semibold text-slate-800 dark:text-slate-200 truncate ${capitalize ? 'capitalize' : ''}`}>
          {value ?? '—'}
        </p>
      </div>
    </div>
  );
}
