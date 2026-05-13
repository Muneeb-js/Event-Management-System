import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';
import Navbar from '../components/Navbar';

const CATEGORIES = ['ALL', 'ACADEMIC', 'SOCIAL', 'WORKSHOP', 'CONFERENCE'];

const categoryColors = {
  ACADEMIC: 'bg-blue-50 text-blue-600 border-blue-100',
  WORKSHOP: 'bg-green-50 text-green-600 border-green-100',
  SOCIAL: 'bg-amber-50 text-amber-600 border-amber-100',
  CONFERENCE: 'bg-purple-50 text-purple-600 border-purple-100',
  ALL: 'bg-gray-100 text-gray-500 border-gray-200',
};

const EventCard = ({ event }) => (
  <Link to={`/events/${event._id}`} className="group bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
    <div className="relative h-48 overflow-hidden flex-shrink-0">
      <img
        src={event.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop'}
        alt={event.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/60 to-transparent" />
      <span className={`absolute top-3 left-3 text-[8px] font-bold px-2 py-0.5 rounded border tracking-widest ${categoryColors[event.category] || categoryColors.ALL}`}>
        {event.category || 'GENERAL'}
      </span>
      {event.status === 'approved' && (
        <span className="absolute top-3 right-3 text-[8px] font-bold px-2 py-0.5 rounded bg-green-500/90 text-white tracking-widest">APPROVED</span>
      )}
    </div>
    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-[14px] font-bold text-[#0A2540] mb-2 group-hover:text-[#B8860B] transition-colors line-clamp-2 leading-snug">{event.title}</h3>
      <div className="flex flex-col gap-1 mb-3">
        <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <svg className="w-3 h-3 text-[#B8860B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <svg className="w-3 h-3 text-[#B8860B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {event.location}
        </span>
      </div>
      <p className="text-[11px] text-gray-400 font-serif italic line-clamp-2 flex-1">{event.description}</p>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <img
            src={event.organizer?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(event.organizer?.fullName || 'O')}&background=0A2540&color=fff&size=32`}
            alt={event.organizer?.fullName}
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-[10px] text-gray-400 truncate max-w-[100px]">{event.organizer?.fullName}</span>
        </div>
        <span className="text-[10px] font-bold text-[#0A2540] uppercase tracking-widest group-hover:text-[#B8860B] transition-colors">
          {event.attendees?.length || 0} attending
        </span>
      </div>
    </div>
  </Link>
);

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchEvents();
  }, [category]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category !== 'ALL') params.append('category', category);
      const res = await axios.get(`${config.API_BASE_URL}/events?${params.toString()}`);
      if (res.data?.success) setEvents(res.data.data);
    } catch (e) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const filtered = events
    .filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.location?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'attendees') return (b.attendees?.length || 0) - (a.attendees?.length || 0);
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      {/* Header */}
      <div className="bg-[#0A2540] px-8 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-[1400px] mx-auto relative">
          <p className="text-[#FFD700] text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Discovery</p>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">All Events</h1>
          <p className="text-white/50 font-serif italic">Browse and register for upcoming academic and campus events.</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Search + Filters Bar */}
        <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events or locations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded text-[12px] text-[#0A2540] focus:outline-none focus:border-[#0A2540] transition-colors"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded transition-colors ${
                  category === cat
                    ? 'bg-[#0A2540] text-white'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {cat === 'ALL' ? 'All' : cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="text-[11px] font-bold text-[#0A2540] bg-gray-50 border border-gray-100 rounded px-2 py-1.5 focus:outline-none">
              <option value="date">Date</option>
              <option value="attendees">Most Popular</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[11px] text-gray-400">
            Showing <strong className="text-[#0A2540]">{filtered.length}</strong> event{filtered.length !== 1 ? 's' : ''}
            {search && <span> matching "<strong className="text-[#0A2540]">{search}</strong>"</span>}
          </p>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-100" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <h3 className="text-[15px] font-bold text-[#0A2540] mb-2">No events found</h3>
            <p className="text-[12px] text-gray-400 italic mb-6">Try adjusting your filters or search term.</p>
            <button onClick={() => { setSearch(''); setCategory('ALL'); }}
              className="px-6 py-2 bg-[#0A2540] text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gray-900 transition-colors">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(event => <EventCard key={event._id} event={event} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
