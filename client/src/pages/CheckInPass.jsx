import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const CheckInPass = () => {
  const { eventId, studentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.API_BASE_URL}/events/${eventId}`, { withCredentials: true });
      if (res.data?.success) {
        setEvent(res.data.data);
      }
    } catch (error) {
      console.error('Error loading gate credentials:', error);
      toast.error('Failed to load gate verification details');
    } finally {
      setLoading(false);
    }
  };

  const handleGateAdmission = async () => {
    try {
      setCheckingIn(true);
      const res = await axios.post(
        `${config.API_BASE_URL}/events/${eventId}/checkin`, 
        { studentId }, 
        { withCredentials: true }
      );
      if (res.data?.success) {
        toast.success('Access Granted! Attendance verified.');
        fetchEventDetails();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2540]" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold mb-4 shadow-sm">⚠️</div>
          <h2 className="text-xl font-extrabold text-[#0A2540] uppercase tracking-wider mb-2">Invalid Access Link</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">The scanned event details or register reference could not be located in our secure records.</p>
          <Link to="/" className="inline-block px-8 py-3 bg-[#0A2540] text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gray-900 transition-colors">Return home</Link>
        </div>
      </div>
    );
  }

  // Find student in attendees
  const student = event.attendees?.find(a => (typeof a === 'string' ? a : a._id) === studentId);
  // Check if they are already checked in
  const isAlreadyCheckedIn = event.checkedIn?.some(c => (typeof c === 'string' ? c : c._id) === studentId);
  // Check organizer authorization
  const isAuthorizedStaff = (typeof event.organizer === 'string' ? event.organizer : event.organizer?._id) === user?._id || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#FAFBFD] pb-24 text-[#0A2540] selection:bg-[#FFD700] selection:text-[#0A2540]">
      <Navbar />

      <div className="max-w-xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <span className="text-[#B8860B] text-[9px] font-extrabold uppercase tracking-[0.25em]">Security Gate Desk</span>
          <h1 className="text-2xl font-extrabold text-[#0A2540] uppercase tracking-tight mt-1">Ticket Pass Verification</h1>
          <p className="text-gray-400 font-serif italic text-xs mt-1">Scanned live via UEMS Admissions Gate</p>
        </div>

        {/* Verification Status Card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-fade-in-up">
          
          {/* Top Status Header */}
          {!student ? (
            <div className="bg-red-500 text-white p-6 text-center space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto text-xl font-bold animate-pulse">✕</div>
              <h2 className="text-[14px] font-extrabold uppercase tracking-widest">Access Denied</h2>
              <p className="text-white/80 text-[10px] tracking-normal font-medium uppercase">Student is not registered for this event</p>
            </div>
          ) : isAlreadyCheckedIn ? (
            <div className="bg-[#FFD700] text-[#0A2540] p-6 text-center space-y-2">
              <div className="w-12 h-12 bg-[#0A2540]/10 rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</div>
              <h2 className="text-[14px] font-extrabold uppercase tracking-widest">Attendance Recorded</h2>
              <p className="text-[#0A2540]/80 text-[10px] tracking-normal font-bold uppercase">Pass Validated & Already Checked In</p>
            </div>
          ) : (
            <div className="bg-emerald-500 text-white p-6 text-center space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto text-xl font-bold animate-bounce">✓</div>
              <h2 className="text-[14px] font-extrabold uppercase tracking-widest font-sans">Valid Ticket Pass</h2>
              <p className="text-white/80 text-[10px] tracking-normal font-medium uppercase">Registered Attendee - Awaiting Gate Admission</p>
            </div>
          )}

          <div className="p-8 space-y-8">
            
            {/* Student Profile Block */}
            {student ? (
              <div className="space-y-4">
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Student Credentials</span>
                <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-lg border border-gray-100/50">
                  <img
                    src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName || 'U')}&background=0A2540&color=fff`}
                    alt={student.fullName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h3 className="text-[15px] font-extrabold text-[#0A2540]">{student.fullName}</h3>
                    <p className="text-[12px] text-gray-400 font-medium">{student.email}</p>
                    <p className="text-[9px] font-mono text-gray-400 mt-1 uppercase">Student ID: {student._id}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50/50 border border-red-100 rounded-lg text-center">
                <p className="text-xs text-red-500 font-bold uppercase tracking-wider">Unverified Credentials Found</p>
                <p className="text-[11px] text-gray-400 mt-1">This user referenced by Ticket ID ({studentId}) is not associated with this event roster.</p>
              </div>
            )}

            {/* Event Coordinates Block */}
            <div className="space-y-4">
              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Event Coordinate Registry</span>
              <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-100/50 space-y-4">
                <div>
                  <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Event Registry Title</span>
                  <h4 className="text-[14px] font-bold text-[#0A2540] truncate">{event.title}</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Venue Location</span>
                    <span className="text-[12px] font-bold text-[#0A2540]">{event.location}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date & Time</span>
                    <span className="text-[12px] font-bold text-[#0A2540]">{new Date(event.date).toLocaleDateString()} @ {event.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action control */}
            {student && (
              <div className="pt-6 border-t border-gray-50 space-y-4">
                {isAlreadyCheckedIn ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600 text-center space-y-1">
                    <p className="text-[11px] font-extrabold uppercase tracking-widest">Attendance Registry Complete</p>
                    <p className="text-[10px] text-emerald-500 font-medium">This admission pass has already been validated. ACCESS PERMITTED.</p>
                  </div>
                ) : (
                  <>
                    {isAuthorizedStaff ? (
                      <button
                        onClick={handleGateAdmission}
                        disabled={checkingIn}
                        className="w-full py-4 bg-[#0A2540] hover:bg-[#123E66] text-white text-[10px] font-bold uppercase tracking-widest rounded-md transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {checkingIn ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            ✓ Confirm Gate Check-In
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-center">
                        <p className="text-[10px] text-[#B8860B] font-extrabold uppercase tracking-widest mb-1">Staff Authorization Required</p>
                        <p className="text-[10px] text-gray-400 leading-normal">
                          Only Event Organizers (Teachers) or System Administrators are authorized to confirm gate check-in admissions. Please present this ticket pass to a gate official.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Back link */}
            <div className="text-center pt-2">
              <Link 
                to={student ? `/events/${eventId}` : '/'} 
                className="text-gray-400 hover:text-gray-600 text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                ← Back to Event page
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInPass;
