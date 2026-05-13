import React from 'react';

const TrendingTopicCard = () => {
  return (
    <div className="mt-8">
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Trending Now</h3>
      <div className="bg-[#0A2540] rounded-lg p-5 relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1">
        {/* Decorative subtle background angle */}
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rotate-45 transform origin-bottom-right rounded-3xl"></div>
        
        <div className="relative z-10">
          <span className="inline-block px-2 py-0.5 bg-[#FFD700] text-[#0A2540] text-[9px] font-bold uppercase tracking-wider rounded-sm mb-3">
            Hot Topic
          </span>
          <h4 className="text-white font-bold text-base leading-snug mb-2">
            AI Ethics in Modern Journalism
          </h4>
          <p className="text-white/70 text-xs italic font-serif">
            Join 400+ students this Friday
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrendingTopicCard;
