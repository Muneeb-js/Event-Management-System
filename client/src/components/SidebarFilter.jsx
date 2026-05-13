import React from 'react';

const SidebarFilter = ({ filters, onFilterChange, children }) => {
  const departments = ['All Departments', 'Computer Science', 'Fine Arts & Design', 'Political Science'];
  const eventTypes = ['ALL', 'WORKSHOP', 'SOCIAL', 'ACADEMIC'];
  const venues = ['All Venues', 'Main Auditorium', 'Lab 402', 'Botanical Garden', 'University Stadium'];

  const handleDeptChange = (dept) => {
    onFilterChange({ ...filters, department: dept });
  };

  const handleTypeChange = (type) => {
    onFilterChange({ ...filters, category: type });
  };

  const handleVenueChange = (e) => {
    onFilterChange({ ...filters, location: e.target.value });
  };

  const handleDateChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="w-full lg:w-64 flex-shrink-0 space-y-8 pr-4">
      {/* Department Section */}
      <div>
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Department</h3>
        <div className="space-y-3">
          {departments.map((dept) => (
            <label key={dept} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="department"
                  checked={filters.department === dept}
                  onChange={() => handleDeptChange(dept)}
                  className="peer appearance-none w-4 h-4 border border-gray-300 rounded-full checked:bg-gray-900 checked:border-gray-900 cursor-pointer transition-colors"
                />
                <div className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
              </div>
              <span className={`text-sm transition-colors ${filters.department === dept ? 'text-gray-900 font-bold' : 'text-gray-500 group-hover:text-gray-900'}`}>
                {dept}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Event Type Section */}
      <div>
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Event Type</h3>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider transition-colors ${
                filters.category === type
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range Section */}
      <div>
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Date Range</h3>
        <div className="space-y-3">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-gray-50/50"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-gray-50/50"
          />
        </div>
      </div>

      {/* Venue Section */}
      <div>
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Venue</h3>
        <div className="relative">
          <select 
            value={filters.location}
            onChange={handleVenueChange}
            className="w-full appearance-none px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-gray-50/50 text-gray-700 cursor-pointer"
          >
            {venues.map(venue => (
              <option key={venue} value={venue}>{venue}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Slot for TrendingTopicCard or other children */}
      <div className="pt-4">
        {children}
      </div>
    </div>
  );
};

export default SidebarFilter;
