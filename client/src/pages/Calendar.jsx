import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import Navbar from '../components/Navbar';

import { useAuth } from '../context/AuthContext';

const Calendar = () => {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMyEvents, setShowMyEvents] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Fetch all events
        const eventsResponse = await axios.get(`${config.API_BASE_URL}/events`, {
          withCredentials: true
        });
        if (eventsResponse.data?.success) {
          const formattedEvents = eventsResponse.data.data.map(event => ({
            id: event._id,
            title: event.title,
            start: `${event.date.split('T')[0]}T${event.time || '00:00'}`,
            extendedProps: {
              ...event
            },
            backgroundColor: getCategoryColor(event.category),
            borderColor: getCategoryColor(event.category),
          }));
          setEvents(formattedEvents);
          setFilteredEvents(formattedEvents);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load calendar data');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2540]"></div>
      </div>
    );
  }

  useEffect(() => {
    if (!user) {
      setFilteredEvents(events);
      return;
    }

    if (showMyEvents) {
      const myEvents = events.filter(event => {
        if (user.role === 'teacher') {
          return event.extendedProps.organizer?._id === user._id || event.extendedProps.organizer === user._id;
        } else if (user.role === 'student') {
          return event.extendedProps.attendees?.includes(user._id);
        }
        return true;
      });
      setFilteredEvents(myEvents);
    } else {
      setFilteredEvents(events);
    }
  }, [showMyEvents, events, user]);

  const getCategoryColor = (category) => {
    const colors = {
      'ACADEMIC': '#3B82F6', // Blue
      'WORKSHOP': '#10B981', // Green
      'SOCIAL': '#F59E0B',   // Amber
      'CONFERENCE': '#8B5CF6', // Purple
      'GENERAL': '#6B7280',  // Gray
    };
    return colors[category] || '#6B7280';
  };

  const handleEventClick = (info) => {
    navigate(`/events/${info.event.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      {/* Page Header */}
      <div className="bg-[#0A2540] px-8 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-[1400px] mx-auto relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[#FFD700] text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Schedule</p>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-1">Event Calendar</h1>
            <p className="text-white/50 font-serif italic">Plan your schedule and stay updated with all campus activities.</p>
          </div>

          {user && (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-lg border border-white/10">
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                {user.role === 'teacher' ? 'My Created Events' : 'My Enrolled Events'}
              </span>
              <button
                onClick={() => setShowMyEvents(!showMyEvents)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                  showMyEvents ? 'bg-[#FFD700]' : 'bg-white/20'
                }`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${showMyEvents ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-8 py-8">

        {loading ? (
          <div className="flex justify-center items-center h-[600px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2540]"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={filteredEvents}
              eventClick={handleEventClick}
              height="auto"
              aspectRatio={2}
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short'
              }}
              dayMaxEvents={true}
              slotMinTime="07:00:00"
              slotMaxTime="22:00:00"
            />
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .calendar-container .fc {
          --fc-border-color: #f3f4f6;
          --fc-daygrid-event-dot-width: 8px;
          --fc-today-bg-color: #fefce8;
          font-family: inherit;
        }
        .calendar-container .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0A2540;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .calendar-container .fc .fc-button {
          background-color: white;
          border-color: #e5e7eb;
          color: #374151;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          padding: 0.5rem 1rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .calendar-container .fc .fc-button:hover {
          background-color: #f9fafb;
          border-color: #d1d5db;
          color: #111827;
        }
        .calendar-container .fc .fc-button-active {
          background-color: #0A2540 !important;
          border-color: #0A2540 !important;
          color: white !important;
        }
        .calendar-container .fc .fc-col-header-cell-cushion {
          font-size: 0.75rem;
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 1rem 0;
        }
        .calendar-container .fc-event {
          cursor: pointer;
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 0.75rem;
          font-weight: 600;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
      `}} />
    </div>
  );
};

export default Calendar;
