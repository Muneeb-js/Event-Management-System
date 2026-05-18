import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/Event-Management-Logo.png';


const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'OVERVIEW', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', path: '/dashboard', active: true },
    { name: 'EVENTS', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', path: '/events' },
    { name: 'REGISTRATION', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', path: '#' },
    { name: 'ANALYTICS', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', path: '#' },
    { name: 'SETTINGS', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', path: '#' },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col p-6 sticky top-0 h-screen">
      {/* Sidebar Header */}
      <div className="mb-12 flex items-center gap-3">
        <img src={logoImg} alt="UEMS Logo" className="h-10 w-auto object-contain" />
        <div>
          <h1 className="font-extrabold text-[#0A2540] text-lg tracking-tight leading-none mb-1">ADMIN PORTAL</h1>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Institutional Access</p>
        </div>
      </div>


      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded transition-all group ${
              item.active 
                ? 'bg-[#0A2540] text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-[#0A2540]'
            }`}
          >
            <svg className={`w-4 h-4 ${item.active ? 'text-[#FFD700]' : 'text-gray-400 group-hover:text-[#0A2540]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
            </svg>
            <span className="text-[10px] font-bold tracking-widest uppercase">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-8 space-y-4 border-t border-gray-50">
        <Link to="/create-event" className="flex items-center justify-center gap-2 bg-[#FFD700] hover:bg-[#F0C800] text-[#0A2540] py-4 rounded font-bold text-[11px] tracking-widest uppercase transition-colors shadow-sm mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Create Event
        </Link>
        
        <div className="space-y-4">
          <Link to="#" className="flex items-center gap-4 px-4 py-1 text-gray-500 hover:text-[#0A2540] transition-colors group">
            <svg className="w-4 h-4 text-gray-400 group-hover:text-[#0A2540]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-[10px] font-bold tracking-widest uppercase">Support</span>
          </Link>
          <button className="flex items-center gap-4 px-4 py-1 text-gray-500 hover:text-red-600 transition-colors group">
            <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="text-[10px] font-bold tracking-widest uppercase">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
