import React from 'react';

const FeaturedOpportunityCard = () => {
  return (
    <div className="bg-[#0A2540] relative overflow-hidden flex flex-col md:flex-row items-stretch rounded-md mt-12 mb-8">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      
      {/* Left Content */}
      <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
        <span className="text-[#FFD700] text-[10px] font-bold uppercase tracking-widest mb-4 block">
          Featured Opportunity
        </span>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 pr-4">
          The Alumni Mentorship Circle 2024
        </h2>
        
        <p className="text-white/70 font-serif italic text-[13px] mb-8 max-w-xl">
          Connect with distinguished alumni who have navigated the very path you are walking today. Gain insights from the industry's most influential voices in academia and publishing.
        </p>
        
        <div>
          <button className="bg-[#FFD700] hover:bg-[#F0C800] text-[#0A2540] text-[11px] font-bold uppercase tracking-widest px-8 py-3 rounded-sm transition-colors">
            Apply Now
          </button>
        </div>
      </div>

      {/* Right Image/Graphic */}
      <div className="md:w-1/3 min-h-[250px] relative">
        <div className="absolute inset-4 bg-black/40 border border-white/10 flex items-center justify-center p-6 rounded-sm">
           {/* Placeholder for the "MENTOR MENTEE session" graphic */}
           <div className="text-center opacity-40">
             <div className="font-bold text-white text-3xl tracking-tighter uppercase mb-1">Mentor</div>
             <div className="font-bold text-white text-3xl tracking-tighter uppercase mb-2">Mentee</div>
             <div className="font-serif italic text-white text-lg">session</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedOpportunityCard;
