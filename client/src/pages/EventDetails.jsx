import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import DOMPurify from 'dompurify';

const categoryColors = {
  ACADEMIC: 'bg-blue-50 text-blue-600',
  WORKSHOP: 'bg-green-50 text-green-600',
  SOCIAL: 'bg-amber-50 text-amber-600',
  CONFERENCE: 'bg-purple-50 text-purple-600',
  GENERAL: 'bg-gray-100 text-gray-500',
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);

  // Chatroom states
  const [lobbyMessages, setLobbyMessages] = useState([]);
  const [lobbyInput, setLobbyInput] = useState('');
  const [fetchingLobby, setFetchingLobby] = useState(false);
  const chatContainerRef = React.useRef(null);

  useEffect(() => {
    fetchEventDetails();
    fetchReviews();
  }, [id]);

  // Chatroom hooks
  useEffect(() => {
    if (!event) return;
    const isAttending = event.attendees?.some(a => (typeof a === 'string' ? a : a._id) === user?._id);
    const isOrganizer = (typeof event.organizer === 'string' ? event.organizer : event.organizer?._id) === user?._id;
    const isAdmin = user?.role === 'admin';

    const fetchLobbyMessages = async () => {
      try {
        setFetchingLobby(true);
        const res = await axios.get(`${config.API_BASE_URL}/events/${id}/lobby`, { withCredentials: true });
        if (res.data?.success) {
          setLobbyMessages(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching lobby history:', err);
      } finally {
        setFetchingLobby(false);
      }
    };

    if (isAttending || isOrganizer || isAdmin) {
      fetchLobbyMessages();
    }
  }, [id, event, user]);

  useEffect(() => {
    if (!event) return;
    const isAttending = event.attendees?.some(a => (typeof a === 'string' ? a : a._id) === user?._id);
    const isOrganizer = (typeof event.organizer === 'string' ? event.organizer : event.organizer?._id) === user?._id;
    const isAdmin = user?.role === 'admin';

    if (socket && (isAttending || isOrganizer || isAdmin)) {
      socket.emit('joinEventLobby', { eventId: id, user });

      socket.on('newLobbyMessage', (message) => {
        setLobbyMessages(prev => [...prev, message]);
      });

      return () => {
        socket.emit('leaveEventLobby', { eventId: id });
        socket.off('newLobbyMessage');
      };
    }
  }, [socket, event, user, id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [lobbyMessages]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.API_BASE_URL}/events/${id}`, { withCredentials: true });
      if (res.data?.success) setEvent(res.data.data);
    } catch (error) {
      toast.error('Failed to load event details');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (studentId = null) => {
    try {
      setCheckingIn(true);
      const res = await axios.post(
        `${config.API_BASE_URL}/events/${id}/checkin`, 
        { studentId }, 
        { withCredentials: true }
      );
      if (res.data?.success) {
        toast.success(res.data?.message || 'Ticket pass verified successfully!');
        fetchEventDetails();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify ticket pass');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleDownloadQR = async () => {
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=0a2540&data=${encodeURIComponent(`${window.location.origin}/events/${event._id}/checkin-pass/${user?._id}`)}`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${event.title.replace(/\s+/g, '_')}_QR_Pass.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('QR Pass downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download QR code');
    }
  };

  const handlePrintTicket = () => {
    const printWindow = window.open('', '_blank', 'width=600,height=700');
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=0a2540&data=${encodeURIComponent(`${window.location.origin}/events/${event._id}/checkin-pass/${user?._id}`)}`;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>UEMS Admission Ticket - ${event.title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; padding: 40px; color: #0A2540; }
            .ticket { border: 3px dashed #FFD700; border-radius: 12px; padding: 30px; max-width: 400px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #B8860B; }
            .title { font-size: 16px; font-weight: 800; margin: 10px 0; text-transform: uppercase; }
            .qr { margin: 20px 0; }
            .serial { font-size: 10px; font-family: monospace; color: #888; letter-spacing: 1px; }
            .details { border-top: 1px dashed #ddd; border-bottom: 1px dashed #ddd; padding: 15px 0; margin: 20px 0; display: block; font-size: 11px; }
            .details-col { float: left; width: 50%; text-align: left; }
            .label { font-size: 8px; font-weight: bold; color: #888; text-transform: uppercase; display: block; margin-top: 8px; }
            .value { font-weight: bold; display: block; }
            @media print {
              body { padding: 0; }
              .ticket { box-shadow: none; border-color: #000; }
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">UEMS CAMPUS ADMISSION PASS</div>
            <div class="title">${event.title}</div>
            <div class="qr">
              <img src="${qrUrl}" width="200" height="200" />
            </div>
            <div class="serial">PASS-ID: UEMS-${event._id.substring(18)}-${user?._id.substring(18)}</div>
            
            <div class="details">
              <div class="details-col">
                <span class="label">Attendee</span>
                <span class="value">${user?.fullName}</span>
                <span class="label">Venue</span>
                <span class="value">${event.location}</span>
              </div>
              <div class="details-col">
                <span class="label">Access tier</span>
                <span class="value">Registered Pass</span>
                <span class="label">Date & Time</span>
                <span class="value">${new Date(event.date).toLocaleDateString()} @ ${event.time}</span>
              </div>
              <div style="clear: both;"></div>
            </div>
            <p style="font-size: 9px; color: #888;">Present this printed QR pass at the gate for validation.</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getGoogleCalendarUrl = () => {
    if (!event) return '';
    const eventDate = new Date(event.date);
    const year = eventDate.getFullYear();
    const month = String(eventDate.getMonth() + 1).padStart(2, '0');
    const day = String(eventDate.getDate()).padStart(2, '0');
    
    let hours = '10';
    let minutes = '00';
    if (event.time) {
      const timeParts = event.time.match(/(\d+):(\d+)/);
      if (timeParts) {
        hours = String(timeParts[1]).padStart(2, '0');
        minutes = String(timeParts[2]).padStart(2, '0');
      }
    }
    
    const dateStr = `${year}${month}${day}`;
    const timeStr = `${hours}${minutes}00`;
    
    const endHours = String((parseInt(hours) + 2) % 24).padStart(2, '0');
    const endTimeStr = `${endHours}${minutes}00`;
    
    const datesParam = `${dateStr}T${timeStr}/${dateStr}T${endTimeStr}`;
    const cleanDesc = event.description ? event.description.replace(/<[^>]*>/g, '') : '';
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${datesParam}&details=${encodeURIComponent(cleanDesc)}&location=${encodeURIComponent(event.location)}`;
  };

  const handleExportCSV = () => {
    if (!event || !event.attendees) return;

    // CSV Headers
    const headers = ["Student Name", "Email Address", "Registered Date", "Attendance Status"];
    
    // CSV Rows
    const rows = event.attendees.map(attendee => {
      const name = attendee.fullName || "N/A";
      const email = attendee.email || "N/A";
      const regDate = event.createdAt ? new Date(event.createdAt).toLocaleDateString() : "N/A";
      
      const isCheckedIn = event.checkedIn?.some(c => (typeof c === 'string' ? c : c._id) === attendee._id);
      const status = isCheckedIn ? "Checked In" : "Registered Only";
      
      return [
        `"${name.replace(/"/g, '""')}"`,
        `"${email.replace(/"/g, '""')}"`,
        `"${regDate}"`,
        `"${status}"`
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}_Attendance_Registry.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Attendance sheet downloaded!");
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/events/${id}/reviews`);
      if (res.data?.success) setReviews(res.data.data);
    } catch {}
  };

  const handleJoin = async () => {
    if (!user) { toast.error('Please login to join events'); navigate('/login'); return; }
    try {
      setJoining(true);
      await axios.post(`${config.API_BASE_URL}/events/${id}/join`, {}, { withCredentials: true });
      toast.success('Successfully joined!');
      fetchEventDetails();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to join event');
    } finally { setJoining(false); }
  };

  const handleLeave = async () => {
    try {
      setJoining(true);
      await axios.post(`${config.API_BASE_URL}/events/${id}/leave`, {}, { withCredentials: true });
      toast.success('You have left the event');
      fetchEventDetails();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to leave event');
    } finally { setJoining(false); }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    try {
      setSubmittingReview(true);
      await axios.post(`${config.API_BASE_URL}/events/${id}/reviews`, { rating: reviewRating, comment: reviewComment }, { withCredentials: true });
      toast.success('Review submitted!');
      setReviewComment('');
      fetchReviews();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit review');
    } finally { setSubmittingReview(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2540]" />
    </div>
  );

  if (!event) return null;

  const isAttending = event.attendees?.some(a => (typeof a === 'string' ? a : a._id) === user?._id);
  const isOrganizer = (typeof event.organizer === 'string' ? event.organizer : event.organizer?._id) === user?._id;
  const isAdmin = user?.role === 'admin';
  const hasPassed = new Date() > new Date(`${event.date?.split('T')[0]}T${event.time || '00:00'}`);
  const userCheckedIn = event.checkedIn?.some(c => (typeof c === 'string' ? c : c._id) === user?._id);



  const handleSendLobbyMessage = (e) => {
    e.preventDefault();
    if (!lobbyInput.trim() || !socket) return;

    socket.emit('sendLobbyMessage', {
      eventId: id,
      userId: user._id,
      senderName: user.fullName,
      content: lobbyInput.trim()
    });

    setLobbyInput('');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      {/* Cover Image */}
      <div className="relative h-72 md:h-[420px] w-full overflow-hidden">
        <img
          src={event.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/80 via-[#0A2540]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-8">
          <div className="max-w-[1400px] mx-auto">
            <span className={`text-[9px] font-bold px-3 py-1 rounded tracking-widest mb-3 inline-block ${categoryColors[event.category] || categoryColors.GENERAL}`}>
              {event.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">{event.title}</h1>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="absolute top-6 left-8 flex items-center gap-2 text-white/80 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meta Info */}
            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
              <div className="flex flex-wrap gap-6 text-[12px] text-gray-500">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <strong className="text-[#0A2540]">{new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <strong className="text-[#0A2540]">{event.time || 'Time TBA'}</strong>
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <strong className="text-[#0A2540]">{event.location}</strong>
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <strong className="text-[#0A2540]">{event.attendees?.length || 0} attending</strong>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm">
              <h2 className="text-[15px] font-bold text-[#0A2540] uppercase tracking-widest mb-4">About This Event</h2>
              <div 
                className="text-gray-600 leading-relaxed font-serif text-[14px] whitespace-normal rich-text-content"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description) }}
              />
              <style>{`
                .rich-text-content h1 { font-size: 1.5rem; font-weight: bold; margin: 1rem 0; color: #0A2540; }
                .rich-text-content h2 { font-size: 1.25rem; font-weight: bold; margin: 0.75rem 0; color: #0A2540; }
                .rich-text-content h3 { font-size: 1.1rem; font-weight: bold; margin: 0.5rem 0; color: #0A2540; }
                .rich-text-content p { margin-bottom: 1rem; }
                .rich-text-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
                .rich-text-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
                .rich-text-content a { color: #B8860B; text-decoration: underline; }
                .rich-text-content blockquote { border-left: 4px solid #FFD700; padding-left: 1rem; font-style: italic; margin: 1rem 0; }
              `}</style>

              {/* Organizer */}
              <div className="mt-8 pt-6 border-t border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Organized By</p>
                <div className="flex items-center gap-3">
                  <img
                    src={event.organizer?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(event.organizer?.fullName || 'O')}&background=0A2540&color=fff`}
                    alt={event.organizer?.fullName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div>
                    <p className="text-[13px] font-bold text-[#0A2540]">{event.organizer?.fullName || 'Organizer'}</p>
                    <p className="text-[11px] text-gray-400">{event.organizer?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Discussion Lobby */}
            <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-6">
                <div>
                  <span className="text-[#B8860B] text-[9px] font-extrabold uppercase tracking-[0.25em]">Live Coordination Lobby</span>
                  <h2 className="text-[15px] font-bold text-[#0A2540] uppercase tracking-widest mt-0.5">💬 Event Chatroom</h2>
                </div>
                <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  <span className="text-[9px] font-extrabold text-green-600 uppercase tracking-wider">Live</span>
                </div>
              </div>

              {(isAttending || isOrganizer || isAdmin) ? (
                <div className="space-y-4">
                  {/* Chat Message Scroll Box */}
                  <div ref={chatContainerRef} className="h-72 overflow-y-auto border border-gray-50 bg-[#FCFDFE] rounded-lg p-4 space-y-4">
                    {fetchingLobby ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0A2540]" />
                      </div>
                    ) : lobbyMessages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <span className="text-2xl mb-1">👋</span>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">No coordination messages yet</p>
                        <p className="text-[10px] text-gray-400 mt-1 leading-normal max-w-[250px]">Be the first to say hello or ask a question to other attendees!</p>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {lobbyMessages.map((msg, index) => {
                          const isMe = msg.user === user?._id;
                          return (
                            <div key={msg._id || index} className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName)}&background=${isMe ? '0A2540' : 'B8860B'}&color=fff`}
                                alt={msg.senderName}
                                className="w-7 h-7 rounded-full object-cover shadow-sm mt-0.5"
                              />
                              <div className={`max-w-[70%] rounded-xl px-3.5 py-2 text-xs leading-relaxed text-left ${isMe ? 'bg-[#0A2540] text-white rounded-tr-none' : 'bg-gray-100 text-[#0A2540] rounded-tl-none'}`}>
                                <div className="flex items-center gap-1.5 justify-between mb-1">
                                  <span className={`text-[9px] font-extrabold uppercase ${isMe ? 'text-[#FFD700]' : 'text-[#B8860B]'}`}>{msg.senderName}</span>
                                  <span className={`text-[8px] font-mono ${isMe ? 'text-white/40' : 'text-gray-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="whitespace-pre-line m-0">{msg.content}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Send Input Bar */}
                  <form onSubmit={handleSendLobbyMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={lobbyInput}
                      onChange={e => setLobbyInput(e.target.value)}
                      placeholder="Type coordination message or question..."
                      className="flex-1 px-4 py-3 bg-white border border-gray-100 focus:border-[#0A2540] rounded text-xs text-[#0A2540] font-medium outline-none transition-all shadow-sm"
                    />
                    <button
                      type="submit"
                      disabled={!lobbyInput.trim()}
                      className="px-6 bg-[#0A2540] hover:bg-[#123E66] disabled:bg-gray-100 text-white disabled:text-gray-400 text-[10px] font-extrabold uppercase tracking-widest rounded transition-all shadow cursor-pointer disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </form>
                </div>
              ) : (
                /* Unregistered Teaser Gate */
                <div className="relative border border-dashed border-gray-200 rounded-lg bg-gray-50/50 p-8 text-center overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px] bg-white/30 z-10">
                    <div className="bg-white/95 border border-gray-100 rounded-xl p-6 shadow-xl max-w-sm mx-auto">
                      <div className="w-10 h-10 bg-amber-50 border border-amber-200 text-[#B8860B] rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">🔒</div>
                      <h3 className="text-xs font-extrabold text-[#0A2540] uppercase tracking-wider mb-1">Locked Discussion Lobby</h3>
                      <p className="text-[10px] text-gray-400 leading-normal mb-4">You must join this event to view and participate in the real-time coordinator discussion board.</p>
                      <button 
                        onClick={handleJoin} 
                        className="px-6 py-2.5 bg-[#FFD700] hover:bg-yellow-300 text-[#0A2540] text-[9px] font-extrabold uppercase tracking-widest rounded shadow cursor-pointer transition-colors"
                      >
                        Join Event to Unlock
                      </button>
                    </div>
                  </div>

                  {/* Blurred mock placeholder messages for design aesthetics */}
                  <div className="space-y-4 filter blur-[2px] opacity-30 select-none">
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-300 animate-pulse" />
                      <div className="bg-gray-100 rounded-lg p-3 text-left w-1/2">
                        <div className="w-16 h-2 bg-gray-300 rounded mb-1" />
                        <div className="w-32 h-3 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="flex gap-2 flex-row-reverse">
                      <div className="w-7 h-7 rounded-full bg-gray-300 animate-pulse" />
                      <div className="bg-gray-200 rounded-lg p-3 text-left w-1/3">
                        <div className="w-16 h-2 bg-gray-400 rounded mb-1" />
                        <div className="w-24 h-3 bg-gray-300 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm">
              <h2 className="text-[15px] font-bold text-[#0A2540] uppercase tracking-widest mb-6">Reviews</h2>

              {isAttending && hasPassed && (
                <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-[#F8F9FA] rounded-lg border border-gray-100">
                  <h3 className="text-[13px] font-bold text-[#0A2540] mb-4">Leave a Review</h3>
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setReviewRating(star)}
                        className={`text-2xl transition-colors ${reviewRating >= star ? 'text-[#FFD700]' : 'text-gray-200'}`}>★</button>
                    ))}
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder="Share your experience..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded text-[12px] text-[#0A2540] focus:outline-none focus:border-[#0A2540] transition-colors resize-none mb-3"
                    required
                  />
                  <button type="submit" disabled={submittingReview}
                    className="px-6 py-2 bg-[#0A2540] text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gray-900 transition-colors disabled:opacity-50">
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-[12px] text-gray-400 font-serif italic text-center py-8">No reviews yet. Be the first to review this event.</p>
                ) : reviews.map(review => (
                  <div key={review._id} className="border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#0A2540] flex items-center justify-center text-white text-xs font-bold">
                          {review.user?.fullName?.charAt(0) || 'U'}
                        </div>
                        <span className="text-[13px] font-bold text-[#0A2540]">{review.user?.fullName || 'Anonymous'}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex gap-0.5 mb-2 text-[#FFD700] text-sm">
                      {[...Array(5)].map((_, i) => <span key={i}>{i < review.rating ? '★' : '☆'}</span>)}
                    </div>
                    <p className="text-[12px] text-gray-600 font-serif italic">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm sticky top-24">
              <div className="mb-5 pb-5 border-b border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Registered Attendees</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-extrabold text-[#0A2540]">{event.attendees?.length || 0}</span>
                  <span className="text-gray-400 text-[12px] mb-1">people</span>
                </div>
              </div>

              {event.status && (
                <div className="mb-4">
                  <span className={`text-[9px] font-bold px-3 py-1 rounded tracking-widest ${event.status === 'approved' ? 'bg-green-50 text-green-600' : event.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
                    {event.status.toUpperCase()}
                  </span>
                </div>
              )}

              {hasPassed ? (
                <div className="w-full py-3 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded text-center">Event Ended</div>
              ) : isOrganizer || isAdmin ? (
                <div className="space-y-3">
                  <button onClick={() => navigate(`/events/${id}/edit`)}
                    className="w-full py-3 bg-[#0A2540] text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Edit Event
                  </button>
                  <button onClick={() => setShowAttendees(true)}
                    className="w-full py-3 bg-gray-50 text-[#0A2540] text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gray-100 transition-colors cursor-pointer">
                    View Attendees
                  </button>
                </div>
              ) : isAttending ? (
                <div className="space-y-3">
                  <a href={getGoogleCalendarUrl()} target="_blank" rel="noopener noreferrer"
                    className="w-full py-3 bg-[#FFD700] hover:bg-yellow-300 text-[#0A2540] text-[10px] font-bold uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer">
                    📅 Add to Google Calendar
                  </a>
                  <button onClick={handleLeave} disabled={joining}
                    className="w-full py-3 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer">
                    {joining ? 'Processing...' : 'Leave Event'}
                  </button>
                </div>
              ) : (
                <button onClick={handleJoin} disabled={joining}
                  className="w-full py-3 bg-[#FFD700] text-[#0A2540] text-[10px] font-bold uppercase tracking-widest rounded hover:bg-yellow-300 transition-colors shadow-md disabled:opacity-50 cursor-pointer">
                  {joining ? 'Joining...' : 'Join Event'}
                </button>
              )}

              {isAttending && !isOrganizer && (
                <div className="mt-4 flex items-center gap-2 text-green-600 text-[11px] font-bold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  You're registered for this event
                </div>
              )}
            </div>

            {/* Virtual Admission QR Code Ticket */}
            {isAttending && !isOrganizer && (
              <div className="bg-white border-2 border-dashed border-[#FFD700] rounded-xl p-6 shadow-md relative overflow-hidden animate-fade-in-up mt-6">
                <div className="absolute top-0 left-0 right-0 h-2.5 bg-[#0A2540]" />
                
                <div className="text-center pb-4 border-b border-gray-100 mt-2">
                  <span className="text-[#B8860B] text-[9px] font-extrabold uppercase tracking-[0.25em]">UEMS Admissions</span>
                  <h4 className="text-[14px] font-extrabold text-[#0A2540] uppercase tracking-wider mt-0.5">Campus Admission Pass</h4>
                </div>

                <div className="py-5 flex flex-col items-center justify-center">
                  <div className="relative p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0a2540&data=${encodeURIComponent(`${window.location.origin}/events/${event._id}/checkin-pass/${user?._id}`)}`}
                      alt="Ticket QR Code" 
                      className={`w-36 h-36 object-contain ${userCheckedIn ? 'opacity-25 scale-95 blur-[1px]' : ''} transition-all duration-300`}
                    />
                    {userCheckedIn && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-transparent">
                        <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 text-xl font-bold shadow-md animate-bounce mb-1">
                          ✓
                        </div>
                        <span className="text-[9px] font-extrabold text-green-600 tracking-widest uppercase bg-green-50/90 px-2 py-0.5 rounded border border-green-200">Validated</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] font-mono text-gray-400 mt-3 tracking-widest uppercase">
                    PASS-ID: UEMS-{event._id?.substring(18)}-{user?._id?.substring(18)}
                  </p>
                </div>

                <div className="space-y-3.5 pb-4 border-b border-dashed border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest">Attendee</span>
                      <span className="text-[12px] font-bold text-[#0A2540] truncate block">{user?.fullName}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest">Access tier</span>
                      <span className="text-[12px] font-bold text-[#B8860B] uppercase tracking-wider">Registered Pass</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest">Venue</span>
                      <span className="text-[11px] font-bold text-[#0A2540] truncate block">{event.location}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest">Date & Time</span>
                      <span className="text-[11px] font-semibold text-[#0A2540] truncate block">{new Date(event.date).toLocaleDateString()} @ {event.time}</span>
                    </div>
                  </div>
                </div>

                {/* Print & Download Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-4 pb-4 border-b border-gray-100">
                  <button
                    type="button"
                    onClick={handleDownloadQR}
                    className="py-2 px-3 border border-gray-200 hover:border-[#0A2540] text-[#0A2540] text-[9px] font-extrabold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    📥 Download QR
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintTicket}
                    className="py-2 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-[#0A2540] text-[9px] font-extrabold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    🖨️ Print Pass
                  </button>
                </div>

                {/* Gate Admission Status Indicator */}
                <div className="pt-4 text-center">
                  {userCheckedIn ? (
                    <div className="w-full py-2.5 bg-green-50/50 border border-green-200 rounded text-green-600 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-sm">
                      <span>✓</span> Attendance Recorded
                    </div>
                  ) : (
                    <div className="w-full py-2.5 bg-amber-50/60 border border-amber-200 rounded text-amber-600 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 animate-pulse shadow-sm">
                      <span>🎫</span> Awaiting Gate Scan
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Department Info */}
            {event.department && (
              <div className="bg-[#0A2540] rounded-lg p-6">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/50 mb-1">Department</p>
                <p className="text-white font-bold text-[13px]">{event.department}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendees Modal */}
      {showAttendees && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAttendees(false)}>
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#0A2540] text-white">
              <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-white">Attendees ({event.attendees?.length || 0})</h3>
              <div className="flex items-center gap-3">
                {event.attendees?.length > 0 && (
                  <button 
                    onClick={handleExportCSV}
                    className="px-2.5 py-1 bg-[#FFD700] hover:bg-yellow-300 text-[#0A2540] text-[8px] font-extrabold uppercase tracking-widest rounded transition-colors cursor-pointer"
                  >
                    📊 Export CSV
                  </button>
                )}
                <button onClick={() => setShowAttendees(false)} className="text-white/80 hover:text-white cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              {event.attendees?.map((attendee, i) => {
                const attendeeId = typeof attendee === 'string' ? attendee : attendee._id;
                const isCheckedIn = event.checkedIn?.some(c => (typeof c === 'string' ? c : c._id) === attendeeId);
                return (
                  <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <img
                        src={attendee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(attendee.fullName || 'U')}&background=0A2540&color=fff`}
                        alt={attendee.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-[13px] font-bold text-[#0A2540]">{attendee.fullName}</p>
                        <p className="text-[11px] text-gray-400">{attendee.email}</p>
                      </div>
                    </div>
                    {/* Check In Action / Badge */}
                    <div>
                      {isCheckedIn ? (
                        <span className="text-[9px] font-extrabold text-green-600 tracking-wider uppercase bg-green-50 border border-green-200 px-2.5 py-1 rounded-sm">
                          ✓ Attended
                        </span>
                      ) : (isOrganizer || isAdmin) ? (
                        <button
                          onClick={() => handleCheckIn(attendeeId)}
                          disabled={checkingIn}
                          className="px-3 py-1.5 bg-[#FFD700] hover:bg-yellow-300 text-[#0A2540] text-[9px] font-extrabold uppercase tracking-widest rounded-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                          Check In
                        </button>
                      ) : (
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                          Registered
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
