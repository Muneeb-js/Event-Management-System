import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const StudentDashboard = ({ user, dashboardData }) => {
  const navigate = useNavigate();
  const recommendedEvents = dashboardData?.recommendedEvents || [];
  const recentAlerts = dashboardData?.recentAlerts || [];
  const today = new Date();

  const eventDays = {};
  dashboardData?.calendarEvents?.forEach(e => { eventDays[e.date] = e; });

  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const calendarDays = Array.from({ length: startOffset }, (_, i) => ({ empty: true, key: `e-${i}` }))
    .concat(Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, event: eventDays[i + 1] })));

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />



      <div className="max-w-[1400px] mx-auto px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <p className="text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
            {user?.role === 'teacher' ? 'Faculty Portal' : 'Student Portal'}
          </p>
          <h1 className="text-3xl font-extrabold text-[#0A2540] tracking-tight">My Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, {user?.fullName?.split(' ')[0] || 'Scholar'}</p>
        </div>
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            user?.role === 'teacher' 
              ? { label: 'Events Organized', value: (dashboardData?.organizedEventsCount || 0).toString().padStart(2, '0'), accent: true }
              : { label: 'Events Attended', value: (dashboardData?.eventsAttendedCount || 0).toString().padStart(2, '0'), accent: true },
            { label: 'Upcoming Events', value: (dashboardData?.upcomingCount || 0).toString().padStart(2, '0'), accent: false },
            { label: 'This Month', value: (dashboardData?.calendarEvents?.length || 0).toString().padStart(2, '0'), accent: false },
            { label: 'Alerts', value: (recentAlerts.length || 0).toString().padStart(2, '0'), accent: false },
          ].map((stat, idx) => (
            <div key={idx} className={`p-6 rounded-lg ${stat.accent ? 'bg-[#0A2540]' : 'bg-white border border-gray-100'} shadow-sm`}>
              <p className={`text-[9px] font-bold uppercase tracking-widest mb-3 ${stat.accent ? 'text-white/50' : 'text-gray-400'}`}>{stat.label}</p>
              <p className={`text-4xl font-extrabold ${stat.accent ? 'text-white' : 'text-[#0A2540]'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Calendar + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mini Calendar */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[15px] font-bold text-[#0A2540]">Academic Calendar</h2>
              <span className="text-[12px] font-bold text-[#0A2540]">
                {today.toLocaleString('default', { month: 'long' })} {today.getFullYear()}
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                <div key={d} className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((cell, i) => {
                if (cell.empty) return <div key={cell.key} />;
                const isToday = cell.day === today.getDate();
                const hasEvent = !!cell.event;
                return (
                  <div key={i} className={`relative h-10 flex flex-col items-center justify-center rounded cursor-default text-[12px] font-bold transition-all
                    ${isToday ? 'bg-[#0A2540] text-white' : hasEvent ? 'bg-[#FFD700]/20 text-[#0A2540]' : 'text-gray-500 hover:bg-gray-50'}`}>
                    {cell.day}
                    {hasEvent && !isToday && <span className="absolute bottom-1 w-1 h-1 bg-[#FFD700] rounded-full" />}
                    {hasEvent && isToday && <span className="absolute bottom-1 w-1 h-1 bg-white rounded-full" />}
                  </div>
                );
              })}
            </div>
            {dashboardData?.calendarEvents?.length === 0 && (
              <p className="text-center text-[11px] text-gray-400 italic mt-4">No events this month. <Link to="/events" className="text-[#0A2540] font-bold underline">Discover events</Link></p>
            )}
          </div>

          {/* Alerts */}
          <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <h2 className="text-[15px] font-bold text-[#0A2540] mb-5 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              Recent Alerts
            </h2>
            <div className="space-y-3">
              {recentAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-10 h-10 text-gray-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  <p className="text-[12px] text-gray-400 italic">No recent alerts</p>
                </div>
              ) : recentAlerts.map((alert, idx) => (
                <div key={alert._id || idx} className={`p-3 bg-gray-50 rounded-lg border-l-2 ${alert.type === 'warning' ? 'border-amber-400' : alert.type === 'error' ? 'border-red-400' : 'border-[#0A2540]'}`}>
                  <p className="text-[12px] font-bold text-[#0A2540]">{alert.title}</p>
                  <p className="text-[11px] text-gray-500 italic mt-0.5">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Events */}
        <div>
          <div className="flex items-end justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <p className="text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Tailored For You</p>
              <h2 className="text-2xl font-extrabold text-[#0A2540]">Recommended Events</h2>
            </div>
            <Link to="/events" className="text-[10px] font-bold text-[#0A2540] uppercase tracking-widest border-b-2 border-[#FFD700] pb-0.5">
              View All
            </Link>
          </div>

          {recommendedEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
              <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="text-[13px] font-bold text-[#0A2540] mb-1">You're all caught up!</p>
              <p className="text-[12px] text-gray-400 italic">No new events to recommend right now.</p>
              <Link to="/events" className="mt-4 inline-block px-6 py-2 bg-[#0A2540] text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gray-900 transition-colors">
                Browse All Events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedEvents.map((event, idx) => (
                <Link key={event._id || idx} to={`/events/${event._id}`} className="group bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={event.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop'}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/50 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-[13px] font-bold text-[#0A2540] mb-1 group-hover:text-[#B8860B] transition-colors line-clamp-1">{event.title}</h3>
                    <p className="text-[11px] text-gray-400">
                      {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {event.location}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
