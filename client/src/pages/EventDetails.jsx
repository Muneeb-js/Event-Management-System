import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
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
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    fetchReviews();
  }, [id]);

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
        <button onClick={() => navigate(-1)} className="absolute top-6 left-8 flex items-center gap-2 text-white/80 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">
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
                    className="w-full py-3 bg-[#0A2540] text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Edit Event
                  </button>
                  <button onClick={() => setShowAttendees(true)}
                    className="w-full py-3 bg-gray-50 text-[#0A2540] text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gray-100 transition-colors">
                    View Attendees
                  </button>
                </div>
              ) : isAttending ? (
                <button onClick={handleLeave} disabled={joining}
                  className="w-full py-3 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-red-100 transition-colors disabled:opacity-50">
                  {joining ? 'Processing...' : 'Leave Event'}
                </button>
              ) : (
                <button onClick={handleJoin} disabled={joining}
                  className="w-full py-3 bg-[#FFD700] text-[#0A2540] text-[10px] font-bold uppercase tracking-widest rounded hover:bg-yellow-300 transition-colors shadow-md disabled:opacity-50">
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
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-[15px] font-bold text-[#0A2540]">Attendees ({event.attendees?.length || 0})</h3>
              <button onClick={() => setShowAttendees(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              {event.attendees?.map((attendee, i) => (
                <div key={i} className="flex items-center gap-3">
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
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
