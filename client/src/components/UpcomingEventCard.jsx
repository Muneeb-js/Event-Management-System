import React from 'react';
import { Link } from 'react-router-dom';

const UpcomingEventCard = ({ event }) => {
  const category = event?.category || 'COMP. SCIENCE';
  const title = event?.title || 'Blockchain Foundations';
  const description = event?.description || 'A deep dive into decentralized ledger technologies and their socio-economic impact.';
  const image = event?.coverImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop';
  
  const dateObj = event?.date ? new Date(event.date) : new Date();
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  const timeStr = event?.time || '2:00 PM';
  
  const location = event?.location || 'ROOM 203B';

  return (
    <div className="flex flex-col group bg-white hover:bg-gray-50/50 transition-colors duration-300">
      {/* Image Container */}
      <div className="relative h-40 w-full overflow-hidden mb-4">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        {/* Category Text on Image */}
        <div className="absolute bottom-3 left-3 text-white text-[10px] font-bold uppercase tracking-widest">
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow px-1">
        {/* Date & Time */}
        <div className="text-[#B8860B] text-[9px] font-bold uppercase tracking-widest mb-2">
          {dateStr} • {timeStr}
        </div>
        
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-[17px] leading-tight mb-2 group-hover:text-[#B8860B] transition-colors">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-500 text-sm font-serif italic mb-6 line-clamp-2">
          {description}
        </p>
        
        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {location}
          </span>
          <Link 
            to={event?._id ? `/events/${event._id}` : '#'} 
            className="text-[10px] font-bold text-gray-900 uppercase tracking-widest hover:text-[#B8860B] transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventCard;
