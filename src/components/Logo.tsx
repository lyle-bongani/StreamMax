import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logo: React.FC = () => {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  
  // Trigger animation effect on component mount and periodically
  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => setAnimate(false), 700);
    
    // Create a periodic animation every 6 seconds
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 700);
    }, 6000);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);
  
  return (
    <div 
      className="flex items-center space-x-3 cursor-pointer" 
      onClick={() => navigate('/')}
      onMouseEnter={() => setAnimate(true)}
      onMouseLeave={() => setAnimate(false)}
    >
      <div className="relative">
        {/* Main logo shape */}
        <div className={`w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20 relative overflow-hidden transition-all duration-300 ${animate ? 'scale-105' : ''}`}>
          {/* Inner components */}
          <div className="absolute inset-0 bg-gradient-to-tr from-red-700/20 to-red-400/30"></div>
          <div className={`absolute right-0 bottom-0 w-8 h-8 bg-gradient-to-tl from-red-500 to-transparent rounded-tl-xl ${animate ? 'opacity-80' : 'opacity-60'} transition-opacity duration-300`}></div>
          
          {/* Animated background blob */}
          <div className={`absolute w-4 h-4 rounded-full bg-white/10 blur-md ${animate ? 'scale-150 opacity-80' : 'scale-100 opacity-0'} transition-all duration-700 ease-out`}></div>
          
          {/* The "S" letter with 3D effect */}
          <div className={`relative z-10 text-white font-extrabold text-xl transform -skew-x-6 translate-x-0.5 ${animate ? 'scale-110' : ''} transition-transform duration-300`}>
            S
            <div className={`absolute inset-0 text-red-300/80 blur-[1px] transform translate-x-0.5 -translate-y-0.5 ${animate ? 'translate-x-1' : ''} transition-all duration-300`}>S</div>
          </div>
        </div>
        
        {/* Animated dots */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3">
          <div className={`w-2 h-2 bg-red-500 rounded-full animate-pulse scale-75 ${animate ? 'opacity-100' : 'opacity-80'} transition-opacity duration-300`}></div>
          <div className={`absolute w-full h-full bg-red-400/50 rounded-full animate-ping scale-75 ${animate ? 'opacity-80' : 'opacity-50'} transition-opacity duration-300`}></div>
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className="relative">
          <span className={`text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent drop-shadow-sm ${animate ? 'tracking-wide' : 'tracking-normal'} transition-all duration-300`}>
            StreamMax
          </span>
          {/* Underline effect */}
          <div className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-600/80 to-transparent ${animate ? 'w-full' : 'w-3/4'} transition-all duration-500`}></div>
        </div>
        
        {/* Tagline with dark mode support */}
        <span className="text-xs text-gray-500 dark:text-gray-400">Your Ultimate Streaming Guide</span>
      </div>
    </div>
  );
};

export default Logo; 