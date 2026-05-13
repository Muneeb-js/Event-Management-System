import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, loading, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setShowDropdown(false);
      toast.success('Logged out successfully');
      navigate('/login');
    } else {
      toast.error('Logout failed');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Dashboard', path: '/dashboard', authRequired: true },
    { name: 'Ask Anything', path: '/ask-anything' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-8 py-0 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-7 h-7 bg-[#0A2540] rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <span className="font-extrabold text-[#0A2540] text-[13px] tracking-tight uppercase hidden sm:block">UEMS</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.filter(l => !l.authRequired || isLoggedIn).map(link => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors relative rounded ${
                isActive(link.path)
                  ? 'text-[#0A2540]'
                  : 'text-gray-400 hover:text-[#0A2540]'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#FFD700] rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {isLoggedIn && (user?.role === 'teacher' || user?.role === 'admin') && (
            <Link to="/create-event"
              className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-[#0A2540] text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gray-900 transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              New Event
            </Link>
          )}

          {!loading && (
            <>
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-100 hover:border-gray-300 transition-colors"
                  >
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=0A2540&color=fff`}
                      alt="Profile"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div className="hidden md:block text-left">
                      <p className="text-[11px] font-bold text-[#0A2540] leading-none">{user?.fullName?.split(' ')[0]}</p>
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider">{user?.role}</p>
                    </div>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 bg-[#0A2540]">
                        <p className="text-[12px] font-bold text-white truncate">{user?.fullName}</p>
                        <p className="text-[10px] text-white/50 truncate">{user?.email}</p>
                        <span className="text-[8px] font-bold text-[#FFD700] uppercase tracking-widest">{user?.role}</span>
                      </div>
                      <div className="py-1">
                        <Link to="/dashboard" onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-[#0A2540] hover:bg-gray-50 transition-colors uppercase tracking-wider">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                          Dashboard
                        </Link>
                        <Link to="/edit-profile" onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-[#0A2540] hover:bg-gray-50 transition-colors uppercase tracking-wider">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          Edit Profile
                        </Link>
                        <div className="border-t border-gray-50 mt-1 pt-1">
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-red-500 hover:bg-red-50 transition-colors uppercase tracking-wider">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-[11px] font-bold text-[#0A2540] uppercase tracking-widest hover:text-gray-600 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/signup" className="px-4 py-1.5 bg-[#0A2540] text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gray-900 transition-colors">
                    Register
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-[#0A2540]" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-8 py-4 space-y-2">
          {navLinks.filter(l => !l.authRequired || isLoggedIn).map(link => (
            <Link key={link.name} to={link.path} onClick={() => setMobileOpen(false)}
              className="block text-[11px] font-bold text-[#0A2540] uppercase tracking-widest py-2 hover:text-gray-600 transition-colors">
              {link.name}
            </Link>
          ))}
          {!isLoggedIn && (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-[11px] font-bold text-[#0A2540] uppercase tracking-widest py-2">Sign In</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="block text-[11px] font-bold text-[#0A2540] uppercase tracking-widest py-2">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;