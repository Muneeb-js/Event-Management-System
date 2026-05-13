import React from 'react';

const Button = ({ children, variant = "primary", className = "", isLoading, ...props }) => {
  const baseStyles = "w-full py-3 px-4 font-bold rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-white text-purple-600 hover:bg-gray-50 hover:shadow-xl",
    secondary: "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl",
    outline: "bg-transparent border-2 border-white text-white hover:bg-white/10"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
