import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    role: 'student',
    avatar: null
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    username: '',
    password: ''
  });

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!email.includes('@')) return 'Email must contain @ symbol';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validateFullName = (name) => {
    if (!name) return 'Full name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) return 'Name should only contain letters and spaces';
    return '';
  };

  const validateUsername = (username) => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) return 'Username can only contain letters, numbers, and underscores';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    
    if (id === 'avatar') {
      setFormData({ ...formData, avatar: files[0] });
      return;
    }

    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    const nameError = validateFullName(formData.fullName);
    const usernameError = validateUsername(formData.username);
    const passwordError = validatePassword(formData.password);

    if (emailError || nameError || usernameError || passwordError) {
      setErrors({ email: emailError, fullName: nameError, username: usernameError, password: passwordError });
      return;
    }

    if (!formData.avatar) {
      toast.error('Please upload an avatar image for your profile.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('username', formData.username);
      data.append('password', formData.password);
      data.append('role', formData.role);
      data.append('avatar', formData.avatar);

      const response = await axios.post(`${config.API_BASE_URL}/users/register`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data?.success || response.status === 201) {
        toast.success('Registration successful. Please sign in.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during registration.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-5/12 bg-[#0A2540] flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10">
          <Link to="/" className="text-white text-xl font-extrabold tracking-tight uppercase">
            Academic Editorial UEMS
          </Link>
        </div>
        
        <div className="relative z-10 max-w-lg pb-12">
          <span className="text-[#FFD700] text-[10px] font-bold uppercase tracking-widest mb-4 block">
            Registration
          </span>
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Join the Community.
          </h1>
          <p className="text-white/70 font-serif italic text-lg leading-relaxed">
            "Education is not the learning of facts, but the training of the mind to think."
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center bg-white p-8 overflow-y-auto">
        <div className="w-full max-w-xl py-12">
          {/* Mobile Branding */}
          <div className="lg:hidden mb-10 text-center">
            <Link to="/" className="text-[#0A2540] text-xl font-extrabold tracking-tight uppercase block mb-2">
              Academic Editorial UEMS
            </Link>
            <span className="text-[#B8860B] text-[10px] font-bold uppercase tracking-widest">
              Registration
            </span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-[#0A2540] mb-2">Apply for Access</h2>
            <p className="text-gray-500 font-serif italic text-sm">Please provide your details to establish your academic profile.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-200 py-3 text-[#0A2540] font-medium bg-transparent focus:outline-none focus:border-[#0A2540] transition-colors placeholder:text-gray-300 rounded-none"
                  placeholder="Eleanor Vance"
                />
                {errors.fullName && <p className="mt-2 text-xs text-red-500 font-medium">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="username" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-200 py-3 text-[#0A2540] font-medium bg-transparent focus:outline-none focus:border-[#0A2540] transition-colors placeholder:text-gray-300 rounded-none"
                  placeholder="evance_99"
                />
                {errors.username && <p className="mt-2 text-xs text-red-500 font-medium">{errors.username}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-2">
                Institutional Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-200 py-3 text-[#0A2540] font-medium bg-transparent focus:outline-none focus:border-[#0A2540] transition-colors placeholder:text-gray-300 rounded-none"
                placeholder="eleanor@university.edu"
              />
              {errors.email && <p className="mt-2 text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-200 py-3 text-[#0A2540] font-medium bg-transparent focus:outline-none focus:border-[#0A2540] transition-colors placeholder:text-gray-300 rounded-none"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-2 text-xs text-red-500 font-medium">{errors.password}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="role" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-2">
                  Academic Role
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-200 py-3 text-[#0A2540] font-medium bg-transparent focus:outline-none focus:border-[#0A2540] transition-colors rounded-none appearance-none cursor-pointer"
                >
                  <option value="student">Student Scholar</option>
                  <option value="teacher">Faculty Member</option>
                </select>
              </div>

              <div>
                <label htmlFor="avatar" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-2">
                  Profile Portrait
                </label>
                <input
                  id="avatar"
                  type="file"
                  onChange={handleChange}
                  className="w-full py-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-gray-100 file:text-[#0A2540] hover:file:bg-gray-200 cursor-pointer transition-colors"
                />
              </div>
            </div>

            <div className="pt-4">
              <label className="flex items-start group cursor-pointer">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded-sm border-gray-300 text-[#0A2540] focus:ring-[#0A2540]" required />
                <span className="ml-3 text-xs text-gray-500 leading-relaxed group-hover:text-[#0A2540] transition-colors">
                  I agree to the academic integrity policy and the <a href="#" className="font-bold underline hover:text-[#B8860B]">Terms of Service</a> governing this platform.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A2540] hover:bg-gray-900 text-white text-[11px] font-bold uppercase tracking-widest py-4 mt-8 transition-colors flex justify-center items-center rounded-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>

          <div className="mt-10 text-center text-sm font-medium text-gray-500">
            Already have an active profile?{' '}
            <Link to="/login" className="text-[#0A2540] font-bold hover:text-[#B8860B] transition-colors border-b-2 border-[#0A2540] hover:border-[#B8860B] pb-0.5">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
