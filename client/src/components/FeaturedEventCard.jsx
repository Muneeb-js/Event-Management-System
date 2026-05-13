import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedEventCard = ({ event }) => {
  // Using placeholder data if event is missing fields to match the mockup's style
  const category = event?.category || 'ACADEMIC';
  const title = event?.title || 'Inaugural Research Symposium';
  const description = event?.description || 'Exploring the future of interdisciplinary studies.';
  const image = event?.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop';
  
  // Format date loosely to match mockup (e.g. OCT 12)
  const dateObj = event?.date ? new Date(event.date) : new Date();
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  const location = event?.location || 'HALL A';

  return (
    <div className="w-[300px] flex-shrink-0 flex flex-col group bg-white border border-gray-100/80 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg overflow-hidden">
      {/* Image Container */}
      <div className="relative h-44 overflow-hidden p-2 pb-0">
        <div className="relative w-full h-full rounded-md overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          {/* Badge */}
          <div className="absolute top-3 left-3 bg-[#FFD700] text-[#0A2540] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {category}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-1 group-hover:text-[#0A2540] transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-xs font-serif italic mb-4 line-clamp-2">
          {description}
        </p>
        
        {/* Footer */}
        <div className="mt-auto flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider gap-3">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {dateStr}
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span className="truncate max-w-[100px]">{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEventCard;
