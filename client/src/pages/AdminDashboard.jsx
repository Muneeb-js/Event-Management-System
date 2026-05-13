import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';

const categoryColors = {
  ACADEMIC: 'bg-blue-50 text-blue-600',
  WORKSHOP: 'bg-green-50 text-green-600',
  SOCIAL: 'bg-amber-50 text-amber-600',
  CONFERENCE: 'bg-purple-50 text-purple-600',
  GENERAL: 'bg-gray-100 text-gray-500',
};

const StatCard = ({ label, value, icon, badge }) => (
  <div className="bg-white p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      {badge && <span className="bg-[#FFF9E6] text-[#B8860B] text-[9px] font-bold px-2 py-0.5 rounded tracking-wider">{badge}</span>}
    </div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <h2 className="text-3xl font-extrabold text-[#0A2540] tabular-nums">{value}</h2>
  </div>
);

const AdminDashboard = ({ data, user }) => {
  const navigate = useNavigate();
  const [pendingEvents, setPendingEvents] = useState(data?.pendingEvents || []);
  const [actionLoading, setActionLoading] = useState({});

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2540]" />
    </div>
  );

  const handleApprove = async (eventId) => {
    setActionLoading(prev => ({ ...prev, [eventId]: 'approving' }));
    try {
      await axios.patch(`${config.API_BASE_URL}/dashboard/events/${eventId}/approve`, {}, { withCredentials: true });
      setPendingEvents(prev => prev.filter(e => e._id !== eventId));
      toast.success('Event approved successfully!');
    } catch (err) {
      toast.error('Failed to approve event');
    } finally {
      setActionLoading(prev => ({ ...prev, [eventId]: null }));
    }
  };

  const handleReject = async (eventId) => {
    setActionLoading(prev => ({ ...prev, [eventId]: 'rejecting' }));
    try {
      await axios.patch(`${config.API_BASE_URL}/dashboard/events/${eventId}/reject`, {}, { withCredentials: true });
      setPendingEvents(prev => prev.filter(e => e._id !== eventId));
      toast.success('Event rejected.');
    } catch (err) {
      toast.error('Failed to reject event');
    } finally {
      setActionLoading(prev => ({ ...prev, [eventId]: null }));
    }
  };

  const maxTrend = Math.max(...(data.registrationTrends || []).map(t => t.percentage), 1);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-10">
          <Link to="/" className="font-bold text-[#0A2540] text-sm tracking-tight uppercase">Academic Editorial UEMS</Link>
          <div className="hidden md:flex items-center gap-6">
            {[['Dashboard', '/dashboard'], ['Discovery', '/events'], ['Calendar', '/calendar']].map(([name, path]) => (
              <Link key={name} to={path} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">{name}</Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/create-event')} className="flex items-center gap-2 px-4 py-2 bg-[#0A2540] text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gray-900 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            New Event
          </button>
          <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden cursor-pointer" onClick={() => navigate('/edit-profile')}>
            <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div>
            <p className="text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Institutional Intelligence</p>
            <h1 className="text-3xl font-extrabold text-[#0A2540] tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back, {user?.fullName}</p>
          </div>
          <div className="bg-[#0A2540] p-5 rounded-lg text-white min-w-[220px]">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/50 mb-1">Active Quarter</p>
            <h3 className="text-lg font-bold mb-1">{data.activeQuarter}</h3>
            <p className="text-[11px] text-white/60">{data.pendingCount} event{data.pendingCount !== 1 ? 's' : ''} pending review</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Events" value={data.totalEvents} badge="Live" icon={<svg className="w-4 h-4 text-[#0A2540]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
          <StatCard label="Total Attendees" value={data.totalAttendees} badge={`+${data.approvedCount} approved`} icon={<svg className="w-4 h-4 text-[#0A2540]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
          <StatCard label="Students" value={data.totalStudents} icon={<svg className="w-4 h-4 text-[#0A2540]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>} />
          <StatCard label="Pending Review" value={data.pendingCount} badge="Action needed" icon={<svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        </div>

        {/* Charts + Approval Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Trends Chart */}
          <div className="lg:col-span-2 bg-white p-8 border border-gray-100 rounded-lg shadow-sm">
            <h3 className="text-[15px] font-bold text-[#0A2540] mb-1">Registration Trends</h3>
            <p className="text-[11px] text-gray-400 italic mb-8">Attendee engagement grouped by event month</p>
            <div className="flex items-end justify-between gap-2 h-48">
              {(data.registrationTrends || []).map((trend, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[9px] text-gray-400 font-bold">{trend.count}</span>
                  <div
                    className={`w-full rounded-t transition-all duration-700 ${trend.highlighted ? 'bg-[#FFD700]' : 'bg-gray-200 hover:bg-gray-300'}`}
                    style={{ height: `${Math.max(trend.percentage, 4)}%` }}
                  />
                  <p className="text-[8px] font-bold text-gray-400 tracking-wider">{trend.month}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Approval Queue */}
          <div className="bg-white p-6 border border-gray-100 rounded-lg shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold text-[#0A2540]">Approval Queue</h3>
              <span className="bg-amber-50 text-amber-600 text-[9px] font-bold px-2 py-0.5 rounded-full">{pendingEvents.length} pending</span>
            </div>
            <div className="space-y-5 flex-1 overflow-y-auto max-h-64 pr-1">
              {pendingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-10 h-10 text-green-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-sm text-gray-400 font-medium">All caught up!</p>
                  <p className="text-xs text-gray-300">No events pending review</p>
                </div>
              ) : pendingEvents.map((event) => (
                <div key={event._id} className="border-l-2 border-[#FFD700] pl-4">
                  <h4 className="text-[12px] font-bold text-[#0A2540] mb-0.5 truncate">{event.title}</h4>
                  <p className="text-[10px] text-gray-400 italic mb-2">by {event.organizer?.fullName || 'Unknown'}</p>
                  <p className="text-[9px] text-gray-400 mb-2">{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(event._id)}
                      disabled={!!actionLoading[event._id]}
                      className="flex-1 py-1.5 bg-[#0A2540] text-white text-[9px] font-bold uppercase tracking-widest rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {actionLoading[event._id] === 'approving' ? '...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(event._id)}
                      disabled={!!actionLoading[event._id]}
                      className="flex-1 py-1.5 bg-gray-100 text-gray-500 text-[9px] font-bold uppercase tracking-widest rounded hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      {actionLoading[event._id] === 'rejecting' ? '...' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Events Table + Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Events Table */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#0A2540]">Recent Events</h3>
              <Link to="/events" className="text-[10px] font-bold text-[#0A2540] uppercase tracking-widest border-b border-[#FFD700]">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                    <th className="px-6 py-3 font-bold">Event</th>
                    <th className="px-4 py-3 font-bold">Organizer</th>
                    <th className="px-4 py-3 font-bold text-center">Category</th>
                    <th className="px-4 py-3 font-bold text-center">Attendees</th>
                    <th className="px-4 py-3 font-bold text-center">Status</th>
                    <th className="px-4 py-3 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(data.recentEvents || []).map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-[12px] font-bold text-[#0A2540] truncate max-w-[180px]">{event.title}</p>
                        <p className="text-[10px] text-gray-400">{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                      </td>
                      <td className="px-4 py-4 text-[11px] text-gray-500 truncate max-w-[120px]">{event.organizer?.fullName || '—'}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded tracking-widest ${categoryColors[event.category] || categoryColors.GENERAL}`}>{event.category}</span>
                      </td>
                      <td className="px-4 py-4 text-center text-[12px] font-bold text-[#0A2540]">{event.attendees?.length || 0}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded tracking-widest ${event.status === 'approved' ? 'bg-green-50 text-green-600' : event.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
                          {event.status?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Link to={`/events/${event._id}`} className="text-[9px] font-bold text-[#0A2540] hover:underline">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white p-6 border border-gray-100 rounded-lg shadow-sm">
            <h3 className="text-[15px] font-bold text-[#0A2540] mb-1">Events by Category</h3>
            <p className="text-[11px] text-gray-400 italic mb-6">Distribution across all event types</p>
            <div className="space-y-4">
              {(data.categoryBreakdown || []).map((cat) => (
                <div key={cat.category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-bold text-[#0A2540]">{cat.category}</span>
                    <span className="text-[10px] text-gray-400">{cat.count} events ({cat.percentage}%)</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0A2540] rounded-full transition-all duration-700"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-gray-50 space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Actions</p>
              <Link to="/create-event" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="w-7 h-7 bg-[#0A2540] rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </div>
                <span className="text-[11px] font-bold text-[#0A2540]">Create New Event</span>
              </Link>
              <Link to="/events" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-7 h-7 bg-gray-100 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#0A2540]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                </div>
                <span className="text-[11px] font-bold text-[#0A2540]">View All Events</span>
              </Link>
              <Link to="/edit-profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-7 h-7 bg-gray-100 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#0A2540]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <span className="text-[11px] font-bold text-[#0A2540]">Edit Profile</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Attendee Management */}
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50">
            <h3 className="text-[15px] font-bold text-[#0A2540]">Attendee Management</h3>
            <p className="text-[11px] text-gray-400 italic mt-0.5">Students registered across all events</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="px-6 py-3 font-bold">Attendee</th>
                  <th className="px-4 py-3 font-bold">Email</th>
                  <th className="px-4 py-3 font-bold">Event</th>
                  <th className="px-4 py-3 font-bold text-center">Role</th>
                  <th className="px-4 py-3 font-bold text-center">Date</th>
                  <th className="px-4 py-3 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(data.attendeeManagement || []).length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">No attendees yet</td></tr>
                ) : (data.attendeeManagement || []).map((att, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={att.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(att.name)}&background=0A2540&color=fff`} alt="" className="w-8 h-8 rounded-full object-cover" />
                        <p className="text-[12px] font-bold text-[#0A2540]">{att.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[10px] text-gray-500">{att.email}</td>
                    <td className="px-4 py-4 text-[11px] text-gray-500 truncate max-w-[160px]">{att.eventTitle}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-[8px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded tracking-widest">{att.role}</span>
                    </td>
                    <td className="px-4 py-4 text-[10px] text-gray-500 text-center">{att.time}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-[8px] font-bold px-2 py-0.5 bg-green-50 text-green-600 rounded tracking-widest">{att.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
