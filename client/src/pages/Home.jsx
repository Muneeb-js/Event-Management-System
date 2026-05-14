import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import config from '../config';

const categoryColors = {
  ACADEMIC: 'bg-blue-50 text-blue-600',
  WORKSHOP: 'bg-green-50 text-green-600',
  SOCIAL: 'bg-amber-50 text-amber-600',
  CONFERENCE: 'bg-purple-50 text-purple-600',
  GENERAL: 'bg-gray-100 text-gray-500',
};

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/events`);
        if (res.data?.success) {
          setFeaturedEvents(res.data.data.slice(0, 3));
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
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-[#0A2540] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFD700] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-8 py-28">
          <p className="text-[#FFD700] text-[10px] font-bold uppercase tracking-[0.3em] mb-4">University Event Management System</p>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-none mb-6 max-w-3xl">
            Where Academic<br />Excellence Meets<br />
            <span className="text-[#FFD700]">Community.</span>
          </h1>
          <p className="text-white/60 font-serif italic text-lg max-w-xl mb-10">
            Discover, participate, and shape the intellectual and cultural landscape of our campus.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/events" className="px-8 py-3 bg-[#FFD700] text-[#0A2540] text-[11px] font-bold uppercase tracking-widest rounded hover:bg-yellow-300 transition-colors shadow-lg">
              Discover Events
            </Link>
            <Link to="/signup" className="px-8 py-3 bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest rounded hover:bg-white/20 transition-colors border border-white/20">
              Join the Community
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-lg">
            {[
              { label: 'Active Events', value: '12+' },
              { label: 'Campus Members', value: '500+' },
              { label: 'Departments', value: '8' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-3xl font-extrabold text-white mb-1">{stat.value}</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Events */}
      <div className="max-w-[1400px] mx-auto px-8 py-20">
        <div className="flex items-end justify-between mb-10 pb-6 border-b border-gray-200">
          <div>
            <p className="text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Curated for You</p>
            <h2 className="text-3xl font-extrabold text-[#0A2540] tracking-tight">Featured Events</h2>
          </div>
          <Link to="/events" className="text-[10px] font-bold text-[#0A2540] uppercase tracking-widest border-b-2 border-[#FFD700] pb-1 hover:text-[#B8860B] transition-colors">
            View All Events
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-lg border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-100" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <Link key={event._id} to={`/events/${event._id}`} className="group bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={event.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop'}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/60 to-transparent" />
                  <span className={`absolute top-4 left-4 text-[9px] font-bold px-2 py-0.5 rounded tracking-widest ${categoryColors[event.category] || categoryColors.GENERAL}`}>
                    {event.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-[15px] font-bold text-[#0A2540] mb-2 group-hover:text-[#B8860B] transition-colors line-clamp-2">{event.title}</h3>
                  <div className="flex items-center gap-4 text-gray-400 text-[11px] mb-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {event.location}
                    </span>
                  </div>
                  <p className="text-gray-500 text-[12px] font-serif italic line-clamp-2 mb-4">
                    {event.description?.replace(/<[^>]*>?/gm, '')}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400">{event.attendees?.length || 0} attending</span>
                    <span className="text-[10px] font-bold text-[#0A2540] uppercase tracking-widest group-hover:text-[#B8860B] transition-colors">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-8 py-20">
          <div className="text-center mb-14">
            <p className="text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Why UEMS?</p>
            <h2 className="text-3xl font-extrabold text-[#0A2540] tracking-tight">Built for Academic Communities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <svg className="w-5 h-5 text-[#0A2540]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
                title: 'Discover Events',
                desc: 'Browse all upcoming academic conferences, workshops, social events, and more — all in one place.'
              },
              {
                icon: <svg className="w-5 h-5 text-[#0A2540]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                title: 'Seamless Registration',
                desc: 'Join events with a single click. Your calendar updates automatically and your dashboard tracks everything.'
              },
              {
                icon: <svg className="w-5 h-5 text-[#0A2540]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                title: 'Role-Based Access',
                desc: 'Students enroll in events. Teachers create and manage them. Admins have full institutional oversight.'
              },
            ].map(f => (
              <div key={f.title} className="p-8 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-[#0A2540]/5 rounded-lg flex items-center justify-center mb-5">{f.icon}</div>
                <h3 className="text-[15px] font-bold text-[#0A2540] mb-2">{f.title}</h3>
                <p className="text-[12px] text-gray-500 font-serif italic leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#0A2540]">
        <div className="max-w-[1400px] mx-auto px-8 py-16 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-3">Ready to get started?</h2>
          <p className="text-white/60 font-serif italic mb-8">Join thousands of students and faculty already using UEMS.</p>
          <Link to="/signup" className="inline-block px-10 py-3 bg-[#FFD700] text-[#0A2540] text-[11px] font-bold uppercase tracking-widest rounded hover:bg-yellow-300 transition-colors">
            Create Your Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
