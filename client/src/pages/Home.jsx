import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import config from '../config';

const categoryColors = {
  ACADEMIC: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  WORKSHOP: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  SOCIAL: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  CONFERENCE: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  GENERAL: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
};

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/events`);
        if (res.data?.success) {
          // Get approved events to showcase on the home page
          const approved = res.data.data.filter(e => e.status === 'approved' || !e.status);
          setFeaturedEvents(approved.slice(0, 3));
        }
      } catch (e) {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-[#0A2540] overflow-x-hidden selection:bg-[#FFD700] selection:text-[#0A2540]">
      <Navbar />

      {/* Elegant Hero Section with Dynamic Floating Blurs */}
      <div className="relative bg-gradient-to-br from-[#030914] via-[#0A2540] to-[#0D1B2A] py-32 md:py-40 overflow-hidden">
        {/* Animated Background Spheres */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[120px] animate-float-slow" />
          <div className="absolute bottom-[-15%] left-[-5%] w-[450px] h-[450px] bg-[#FFD700]/5 rounded-full blur-[100px] animate-float-slower" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-8 z-10">
          <div className="max-w-4xl animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[#FFD700] text-[10px] font-bold uppercase tracking-[0.25em] mb-6 shadow-sm backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
              University Event Hub
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.05] mb-6">
              Where Academic <br />
              Excellence Meets <br />
              <span className="bg-gradient-to-r from-[#FFD700] via-[#F3C63F] to-[#E5A93B] bg-clip-text text-transparent drop-shadow-sm">
                Vibrant Community.
              </span>
            </h1>
            <p className="text-white/70 font-serif italic text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
              Discover research colloquiums, register for leadership workshops, and shape the rich cultural and intellectual landscape of our university ecosystem.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/events" className="group px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#E5A93B] text-[#0A2540] text-[11px] font-bold uppercase tracking-widest rounded-sm hover:from-white hover:to-white hover:text-[#0A2540] transition-all duration-300 shadow-[0_4px_20px_rgba(255,215,0,0.15)] flex items-center gap-2">
                Discover Events
                <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/signup" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300 border border-white/10 backdrop-blur-md">
                Create Account
              </Link>
            </div>
          </div>

          {/* Premium Stats Grid */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl border-t border-white/10 pt-12 animate-fade-in-up delay-200">
            {[
              { label: 'Active Events', value: '18+' },
              { label: 'Campus Members', value: '1,200+' },
              { label: 'Departments Joined', value: '12' },
              { label: 'Avg Rating', value: '4.9 ★' },
            ].map((stat, idx) => (
              <div key={idx} className="group hover:translate-y-[-2px] transition-transform duration-300">
                <p className="text-4xl font-extrabold text-white mb-1 tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent group-hover:text-[#FFD700] transition-colors">{stat.value}</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Events Showcase */}
      <div className="max-w-[1400px] mx-auto px-8 py-24 z-10 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-gray-100">
          <div>
            <span className="text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.25em] mb-2 block">Curated Campus Life</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A2540] tracking-tight">Featured Happenings</h2>
          </div>
          <Link to="/events" className="group mt-4 md:mt-0 text-[10px] font-bold text-[#0A2540] uppercase tracking-widest border-b border-transparent hover:border-[#FFD700] pb-1 transition-all flex items-center gap-1.5">
            Explore All Campus Events
            <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-md border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-100" />
                <div className="p-8 space-y-4">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-6 bg-gray-100 rounded w-3/4" />
                  <div className="h-10 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredEvents.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-md p-16 text-center shadow-sm">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p className="text-[14px] text-gray-400 font-serif italic">No events currently scheduled. Check back shortly!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <Link key={event._id} to={`/events/${event._id}`} className="group bg-white rounded-md border border-gray-100/80 overflow-hidden hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col h-full shadow-sm">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={event.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop'}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030914]/40 to-transparent" />
                  <span className={`absolute top-4 left-4 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest backdrop-blur-md ${categoryColors[event.category] || categoryColors.GENERAL}`}>
                    {event.category}
                  </span>
                </div>
                <div className="p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-gray-400 text-[11px] mb-3">
                      <span className="flex items-center gap-1.5 font-medium">
                        <svg className="w-3.5 h-3.5 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="flex items-center gap-1.5 font-medium max-w-[120px] truncate">
                        <svg className="w-3.5 h-3.5 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {event.location}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0A2540] mb-3 group-hover:text-[#B8860B] transition-colors line-clamp-2 leading-tight tracking-tight">{event.title}</h3>
                    <p className="text-gray-500 text-[12px] font-serif italic line-clamp-2 mb-6 leading-relaxed">
                      {event.description?.replace(/<[^>]*>?/gm, '')}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
                      <svg className="w-3 h-3 text-[#B8860B]" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>
                      {event.attendees?.length || 0} Attending
                    </span>
                    <span className="text-[10px] font-bold text-[#0A2540] uppercase tracking-widest group-hover:text-[#B8860B] transition-colors flex items-center gap-1">
                      Details
                      <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* AI Assistant Banner / Event Concierge Feature */}
      <div className="bg-[#FAFBFD] max-w-[1400px] mx-auto px-8 pb-20">
        <div className="bg-gradient-to-r from-[#0A2540] to-[#123E66] rounded-md p-10 md:p-12 relative overflow-hidden group shadow-lg border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
            <div className="absolute top-[-50%] right-[-10%] w-[350px] h-[350px] bg-white rounded-full blur-2xl" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="px-2.5 py-0.5 bg-yellow-400/10 border border-yellow-400/20 text-[#FFD700] text-[9px] font-bold uppercase tracking-widest rounded-full mb-4 inline-block">
              AI Campus Assistant
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
              Looking for something specific?
            </h3>
            <p className="text-white/60 font-serif italic text-[14px]">
              Ask UEMS Assistant to find events, coordinate study groups, or answer any scheduling questions instantly.
            </p>
          </div>
          <div className="relative z-10 flex-shrink-0">
            <Link to="/ask-anything" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FFD700] hover:bg-yellow-300 text-[#0A2540] text-[11px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-md">
              Ask Assistant Now
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Departments / Segments Categories Grid */}
      <div className="bg-white border-t border-gray-100 py-24">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.25em] mb-2 block">Departments & Fields</span>
            <h2 className="text-3xl font-extrabold text-[#0A2540] tracking-tight">Segmented Campuses</h2>
            <p className="text-gray-400 text-sm mt-3 font-serif italic">Find specialized groups, lectures, and academic opportunities matching your major.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Computer Science',
                desc: 'Hackathons, software engineering symposiums, and AI tech showcases.',
                bg: 'bg-blue-50/50 hover:bg-blue-50 hover:border-blue-100',
                text: 'text-blue-600',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              },
              {
                title: 'Fine Arts & Design',
                desc: 'Exhibitions, studio showcase series, and dramatic performance galas.',
                bg: 'bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-100',
                text: 'text-emerald-600',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              },
              {
                title: 'Political Science',
                desc: 'Model UN conferences, debates, and policy review lectures.',
                bg: 'bg-amber-50/50 hover:bg-amber-50 hover:border-amber-100',
                text: 'text-amber-600',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              },
              {
                title: 'Classical Studies',
                desc: 'Literature workshops, museum tours, and cultural dialogues.',
                bg: 'bg-purple-50/50 hover:bg-purple-50 hover:border-purple-100',
                text: 'text-purple-600',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
              },
            ].map((f, idx) => (
              <div key={idx} className={`p-8 border border-gray-100 rounded-md transition-all duration-300 cursor-pointer ${f.bg} group flex flex-col justify-between`}>
                <div>
                  <div className={`w-10 h-10 ${f.bg.includes('blue') ? 'bg-blue-500/10' : f.bg.includes('emerald') ? 'bg-emerald-500/10' : f.bg.includes('amber') ? 'bg-amber-500/10' : 'bg-purple-500/10'} ${f.text} rounded-sm flex items-center justify-center mb-6`}>
                    {f.icon}
                  </div>
                  <h3 className="text-[15px] font-bold text-[#0A2540] mb-2 tracking-tight group-hover:text-[#B8860B] transition-colors">{f.title}</h3>
                  <p className="text-[11px] text-gray-500 font-serif italic leading-relaxed">{f.desc}</p>
                </div>
                <div className="mt-8 flex items-center gap-1 text-[10px] font-bold text-gray-400 group-hover:text-[#B8860B] transition-colors">
                  View Major Events
                  <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Blocks Section */}
      <div className="bg-[#FAFBFD] border-t border-gray-100 py-24">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.25em] mb-2 block">Enterprise Integration</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A2540] tracking-tight leading-tight mb-6">
                Institutional Oversight, Built for Academic Excellence
              </h2>
              <p className="text-gray-500 text-sm font-serif italic leading-relaxed mb-8">
                University Event Management System (UEMS) is crafted specifically for high-achieving institutional workflows. Enable quick approvals, protect access controls, and measure campus engagement accurately.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Interactive Calendar Sync', desc: 'Auto-updated calendars with course, category, and date filtering.' },
                  { title: 'Safe Multi-role Access', desc: 'Secure routes matching Students, Teachers, and system Administrators.' },
                  { title: 'Live Instant Messaging Hub', desc: 'Integrated Socket.io chat rooms for real-time announcements.' }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-5 h-5 bg-[#0A2540] text-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✓</div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0A2540]">{item.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-serif italic mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#0A2540]/5 rounded-md transform rotate-1 scale-102" />
              <div className="relative border border-gray-100 bg-white p-8 rounded-md shadow-lg flex flex-col justify-between h-[360px] overflow-hidden group">
                <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[#FFD700]/5 rounded-full" />
                <div className="flex justify-between items-start">
                  <span className="text-[#B8860B] text-[10px] font-bold uppercase tracking-widest border border-[#FFD700]/30 px-2 py-0.5 rounded">Analytics Overview</span>
                  <span className="text-xs text-green-500 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    LIVE STATS
                  </span>
                </div>
                <div className="my-6">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Campus Growth Rate</p>
                  <p className="text-6xl font-extrabold text-[#0A2540] tracking-tighter">+124% <span className="text-xs text-[#B8860B] font-bold tracking-normal uppercase">this month</span></p>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#0A2540] flex items-center justify-center text-white text-xs font-bold">M</div>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xs font-bold">T</div>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xs font-bold">S</div>
                  </div>
                  <Link to="/signup" className="text-[10px] font-bold text-[#0A2540] uppercase tracking-widest hover:text-[#B8860B]">Join Community →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#0A2540] py-20 text-center relative overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-white/5 rounded-full blur-2xl" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            Shaping the Future of University Events
          </h2>
          <p className="text-white/60 font-serif italic text-lg max-w-xl mx-auto mb-10">
            Join thousands of active scholars, leaders, and coordinators on campus today.
          </p>
          <Link to="/signup" className="inline-block px-10 py-4 bg-gradient-to-r from-[#FFD700] to-[#E5A93B] hover:from-white hover:to-white text-[#0A2540] text-[11px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-md">
            Create Your Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
