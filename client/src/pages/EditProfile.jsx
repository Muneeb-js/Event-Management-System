import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, checkLoginStatus, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', username: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });

  useEffect(() => {
    if (user) {
      setFormData({ fullName: user.fullName || '', email: user.email || '', username: user.username || '' });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.id]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(`${config.API_BASE_URL}/users/update-details`, formData, { withCredentials: true });
      if (avatarFile) {
        const fd = new FormData();
        fd.append('avatar', avatarFile);
        await axios.patch(`${config.API_BASE_URL}/users/avatar`, fd, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } });
      }
      await checkLoginStatus();
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      await axios.post(`${config.API_BASE_URL}/users/change-password`, passwordData, { withCredentials: true });
      toast.success('Password changed successfully');
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (authLoading) return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2540]" />
    </div>
  );

  const displayAvatar = avatarPreview || user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=0A2540&color=fff&size=128`;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Account Management</p>
          <h1 className="text-3xl font-extrabold text-[#0A2540] tracking-tight">Edit Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Card */}
          <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm flex flex-col items-center text-center h-fit">
            <div className="relative mb-5">
              <img src={displayAvatar} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-gray-100" />
              <label htmlFor="avatar" className="absolute bottom-0 right-0 w-8 h-8 bg-[#0A2540] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors border-2 border-white">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </label>
              <input type="file" id="avatar" className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
            <h2 className="text-[15px] font-bold text-[#0A2540] mb-0.5">{user?.fullName}</h2>
            <p className="text-[11px] text-gray-400 mb-2">{user?.email}</p>
            <span className="text-[9px] font-bold text-[#0A2540] bg-[#FFD700]/20 px-3 py-1 rounded tracking-widest uppercase">{user?.role}</span>
            {avatarFile && (
              <p className="text-[10px] text-green-600 font-bold mt-3">New avatar selected — save to apply</p>
            )}
          </div>

          {/* Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Form */}
            <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm">
              <h2 className="text-[15px] font-bold text-[#0A2540] uppercase tracking-widest mb-6">Personal Information</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="fullName" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-2">Full Name</label>
                    <input id="fullName" type="text" value={formData.fullName} onChange={handleChange}
                      className="w-full border-b-2 border-gray-200 py-2.5 text-[13px] text-[#0A2540] bg-transparent focus:outline-none focus:border-[#0A2540] transition-colors placeholder-gray-300"
                      placeholder="Your full name" />
                  </div>
                  <div>
                    <label htmlFor="username" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-2">Username</label>
                    <input id="username" type="text" value={formData.username} onChange={handleChange}
                      className="w-full border-b-2 border-gray-200 py-2.5 text-[13px] text-[#0A2540] bg-transparent focus:outline-none focus:border-[#0A2540] transition-colors placeholder-gray-300"
                      placeholder="username" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-2">Email Address</label>
                  <input id="email" type="email" value={formData.email} onChange={handleChange}
                    className="w-full border-b-2 border-gray-200 py-2.5 text-[13px] text-[#0A2540] bg-transparent focus:outline-none focus:border-[#0A2540] transition-colors placeholder-gray-300"
                    placeholder="you@university.edu" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => navigate('/dashboard')}
                    className="px-6 py-2.5 border border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-widest rounded hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="px-6 py-2.5 bg-[#0A2540] text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gray-900 transition-colors disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Password Form */}
            <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm">
              <h2 className="text-[15px] font-bold text-[#0A2540] uppercase tracking-widest mb-1">Security</h2>
              <p className="text-[11px] text-gray-400 font-serif italic mb-6">Change your account password.</p>
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label htmlFor="oldPassword" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-2">Current Password</label>
                  <input id="oldPassword" type="password" value={passwordData.oldPassword} onChange={handlePasswordChange}
                    className="w-full border-b-2 border-gray-200 py-2.5 text-[13px] text-[#0A2540] bg-transparent focus:outline-none focus:border-[#0A2540] transition-colors placeholder-gray-300"
                    placeholder="••••••••" required />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-2">New Password</label>
                  <input id="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange}
                    className="w-full border-b-2 border-gray-200 py-2.5 text-[13px] text-[#0A2540] bg-transparent focus:outline-none focus:border-[#0A2540] transition-colors placeholder-gray-300"
                    placeholder="••••••••" required />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={passwordLoading}
                    className="px-6 py-2.5 bg-[#FFD700] text-[#0A2540] text-[10px] font-bold uppercase tracking-widest rounded hover:bg-yellow-300 transition-colors disabled:opacity-50">
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
