import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img 
          src={event.coverImage || event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3"} 
          alt={event.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2670";
          }}
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-wide">
          {event.category || 'Event'}
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center gap-1 truncate max-w-[150px]">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {event.location || 'Online'}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {event.title}
        </h3>
        {event.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
            {event.description.replace(/<[^>]*>?/gm, '')}
          </p>
        )}
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {event.organizer?.avatar ? (
                <img src={event.organizer.avatar} alt="" className="w-6 h-6 rounded-full" />
            ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                    {event.organizer?.fullName?.charAt(0) || 'O'}
                </div>
            )}
            <span className="text-sm font-medium text-gray-600">{event.organizer?.fullName || 'Organizer'}</span>
          </div>
        </div>
        <Link 
          to={`/events/${event._id}`} 
          className="block w-full mt-4 py-2.5 rounded-xl bg-gray-50 text-indigo-600 font-bold hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
