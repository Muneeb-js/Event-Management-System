import React from 'react';
import { Link } from 'react-router-dom';

const RecommendedEventCard = ({ event }) => {
  const category = event?.category || 'ACADEMIC SEMINAR';
  const title = event?.title || 'Revisiting Hegemony: Post-Colonial Narratives';
  const description = event?.description || 'A deep dive into the historical structures of power and their modern implications in literary theory.';
  const image = event?.coverImage || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2070&auto=format&fit=crop';
  
  const dateObj = event?.date ? new Date(event.date) : new Date('2023-10-12');
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  const timeStr = event?.time || '4:00 PM';

  return (
    <div className="flex flex-col bg-white border border-gray-100 shadow-sm rounded-md overflow-hidden group hover:shadow-md transition-all">
      {/* Image Container */}
      <div className="h-40 w-full overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-[#B8860B] text-[9px] font-bold uppercase tracking-widest mb-2 block">
          {category}
        </span>
        
        <h3 className="font-bold text-[#0A2540] text-[15px] leading-tight mb-2">
          {title}
        </h3>
        
        <p className="text-gray-500 text-[11px] font-serif italic mb-6 line-clamp-3">
          {description}
        </p>
        
        {/* Footer */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#0A2540] uppercase tracking-widest">
            {dateStr} • {timeStr}
          </span>
          <button className="bg-[#0A2540] hover:bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm transition-colors">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendedEventCard;
