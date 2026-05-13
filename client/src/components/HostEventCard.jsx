import React from 'react';
import { Link } from 'react-router-dom';

const HostEventCard = () => {
  return (
    <div className="flex flex-col h-full bg-[#0A2540] p-8 text-white relative overflow-hidden group">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Icon */}
      <div className="mb-6 text-[#FFD700]">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
        </svg>
      </div>

      <h3 className="font-bold text-2xl leading-tight mb-4 pr-4">
        Host Your Own Event?
      </h3>
      
      <p className="text-white/80 font-serif italic text-sm mb-8">
        The editorial board is now accepting proposals for Spring semester conferences and social initiatives.
      </p>

      <div className="mt-auto">
        <Link 
          to="/create-event"
          className="inline-block w-full text-center bg-[#FFD700] hover:bg-[#F0C800] text-[#0A2540] font-bold uppercase tracking-widest text-xs py-4 px-6 transition-colors"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default HostEventCard;
