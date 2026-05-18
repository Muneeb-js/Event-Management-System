import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {

      const userResponse = await axios.get(`${config.API_BASE_URL}/users/current-user`, {
        withCredentials: true
      });
      
      const userData = userResponse.data?.data?.user;
      setUser(userData);


      const eventsResponse = await axios.get(`${config.API_BASE_URL}/events`, {
        withCredentials: true
      });

      if (eventsResponse.data?.success && userData) {

        const allEvents = eventsResponse.data.data;

        const userEvents = allEvents.filter(event => 
          event.attendees.some(attendee => 
            (typeof attendee === 'string' ? attendee : attendee._id) === userData._id
          )
        );
        setMyEvents(userEvents);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.fullName} 
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-50"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 border-4 border-indigo-50">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-green-500 w-8 h-8 rounded-full border-4 border-white"></div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.fullName}</h1>
            <p className="text-gray-500 mb-4">@{user?.username} • {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student'}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                <span className="block text-xl font-bold text-indigo-600">{myEvents.length}</span>
                <span className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Events Joined</span>
              </div>
              <div className="bg-purple-50 px-4 py-2 rounded-lg">
                <span className="block text-xl font-bold text-purple-600">0</span>
                <span className="text-xs text-purple-600 font-medium uppercase tracking-wide">Upcoming</span>
              </div>
            </div>
          </div>
          
          <button onClick={() => navigate('/edit-profile')} className="px-6 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:border-indigo-600 hover:text-indigo-600 transition-all cursor-pointer">
            Edit Profile
          </button>
        </div>


        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Events</h2>
          
          {myEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {myEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 border-dashed">
              <div className="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No events joined yet</h3>
              <p className="text-gray-500 mb-6">Explore events and join one to see it here!</p>
              <Link to="/events" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all">
                Browse Events
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
