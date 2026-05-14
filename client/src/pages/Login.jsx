import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import config from '../config';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    identifier: '',
    password: ''
  });

  const validateIdentifier = (identifier) => {
    if (!identifier) return 'Email or username is required';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    return '';
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const identifierError = validateIdentifier(formData.identifier);
    const passwordError = validatePassword(formData.password);

    if (identifierError || passwordError) {
      setErrors({ identifier: identifierError, password: passwordError });
      return;
    }

    setLoading(true);

    try {
      const isEmail = formData.identifier.includes('@');
      const payload = {
        password: formData.password,
        [isEmail ? 'email' : 'username']: formData.identifier
      };

      const response = await axios.post(`${config.API_BASE_URL}/users/login`, payload, {
        withCredentials: true
      });

      if (response.data?.success) {
        toast.success('Welcome back.');
        login(response.data.data.user);
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid credentials.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#0A2540] flex-col justify-between p-16 relative overflow-hidden">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        
        <div className="relative z-10">
          <Link to="/" className="text-white text-xl font-extrabold tracking-tight uppercase">
            Academic Editorial UEMS
          </Link>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <span className="text-[#FFD700] text-[10px] font-bold uppercase tracking-widest mb-4 block">
            Portal Access
          </span>
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Advance the Discourse.
          </h1>
          <p className="text-white/70 font-serif italic text-lg leading-relaxed">
            "Knowledge emerges only through the continuous dialectic of rigorous inquiry and open exchange."
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          {/* Mobile Branding */}
          <div className="lg:hidden mb-12 text-center">
            <Link to="/" className="text-[#0A2540] text-xl font-extrabold tracking-tight uppercase block mb-2">
              Academic Editorial UEMS
            </Link>
            <span className="text-[#B8860B] text-[10px] font-bold uppercase tracking-widest">
              Portal Access
            </span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-[#0A2540] mb-2">Sign In</h2>
            <p className="text-gray-500 font-serif italic text-sm">Access your personalized academic dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="identifier" className="block text-[10px] font-bold text-[#0A2540] uppercase tracking-widest mb-2">
                Email or Username
              </label>
              <input
                id="identifier"
                type="text"
                value={formData.identifier}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-200 py-3 text-[#0A2540] font-medium bg-transparent focus:outline-none focus:border-[#0A2540] transition-colors placeholder:text-gray-300 rounded-none"
                placeholder="scholar@university.edu"
              />
              {errors.identifier && <p className="mt-2 text-xs text-red-500 font-medium">{errors.identifier}</p>}
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

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300 text-[#0A2540] focus:ring-[#0A2540]" />
                <span className="ml-2 text-sm text-gray-500 font-medium group-hover:text-[#0A2540] transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm font-bold text-[#0A2540] hover:text-[#B8860B] transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A2540] hover:bg-gray-900 text-white text-[11px] font-bold uppercase tracking-widest py-4 mt-8 transition-colors flex justify-center items-center rounded-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-10 text-center text-sm font-medium text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#0A2540] font-bold hover:text-[#B8860B] transition-colors border-b-2 border-[#0A2540] hover:border-[#B8860B] pb-0.5">
              Apply for Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
