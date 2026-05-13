import React from 'react';

const Input = ({ label, id, type = "text", className = "", ...props }) => {
  return (
    <div className="">
      {label && (
        <label htmlFor={id} className={`block text-sm font-medium mb-1 ${className.includes('text-gray-900') ? 'text-gray-700' : 'text-gray-100'}`}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all ${
           className.includes('bg-') ? '' : 'bg-white/10'
        } ${
           className.includes('border-') ? '' : 'border border-white/20'
        } ${
           className.includes('text-') ? '' : 'text-white'
        } ${
           className.includes('placeholder-') ? '' : 'placeholder-gray-300'
        } ${
           className.includes('focus:ring-') ? '' : 'focus:ring-white/50'
        } focus:border-transparent ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
