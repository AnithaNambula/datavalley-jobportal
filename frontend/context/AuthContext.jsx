'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Failed to load user', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (name, email, password, role, company) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/register', { name, email, password, role, company });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        toast.success('Registration successful!');
        router.push('/dashboard');
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed';
      toast.error(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        toast.success('Logged in successfully!');
        // Redirect based on role
        if (res.data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid email or password';
      toast.error(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/');
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success) {
        setUser(res.data.user);
        toast.success('Profile updated successfully!');
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Profile update failed';
      toast.error(errMsg);
      return { success: false, error: errMsg };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await api.put('/auth/change-password', { currentPassword, newPassword });
      if (res.data.success) {
        toast.success('Password changed successfully!');
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Password change failed';
      toast.error(errMsg);
      return { success: false, error: errMsg };
    }
  };

  // Refresh user from DB
  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) setUser(res.data.user);
    } catch {}
  };

  // Upload avatar and persist to context
  const uploadUserAvatar = async (file) => {
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await api.post('/auth/upload-avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        // Update user in context immediately with new avatar
        setUser((prev) => ({ ...prev, avatar: res.data.avatar }));
        toast.success('Profile photo updated!');
        return { success: true, avatar: res.data.avatar };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Upload failed';
      toast.error(errMsg);
      return { success: false, error: errMsg };
    }
  };

  // Toggle save job
  const toggleSaveJob = async (jobId) => {
    try {
      const res = await api.post(`/auth/saved-jobs/${jobId}`);
      if (res.data.success) {
        // Refresh user profile info (which has updated savedJobs array)
        const meRes = await api.get('/auth/me');
        if (meRes.data.success) {
          setUser(meRes.data.user);
        }
        toast.success(res.data.message);
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to save job';
      toast.error(errMsg);
      return { success: false, error: errMsg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        toggleSaveJob,
        refreshUser,
        uploadUserAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
