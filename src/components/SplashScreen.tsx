import React from 'react';
import { useTheme } from '../context/ThemeContext';

const SplashScreen: React.FC = () => {
  const { isDark } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="animate-fade-in space-y-8">
        {/* Logo Animation */}
        <div className="relative">
          <div className="w-28 h-28 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 relative overflow-hidden">
            {/* Inner components */}
            <div className="absolute inset-0 bg-gradient-to-tr from-red-700/20 to-red-400/30"></div>
            <div className="absolute right-0 bottom-0 w-20 h-20 bg-gradient-to-tl from-red-500 to-transparent rounded-tl-xl"></div>
            
            {/* The "S" letter with 3D effect */}
            <div className="relative z-10 text-white font-extrabold text-5xl transform -skew-x-6 translate-x-1">
              S
              <div className="absolute inset-0 text-red-300/80 blur-[1px] transform translate-x-1 -translate-y-1">S</div>
            </div>
          </div>
          
          {/* Animated dots */}
          <div className="absolute -top-2 -right-2 w-5 h-5">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
          </div>
          <div className="absolute -bottom-2 -left-2 w-5 h-5">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <div className="absolute w-full h-full bg-red-400/50 rounded-full animate-ping delay-700"></div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold text-white dark:text-white mb-4">
            <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">StreamMax</span>
          </h1>
          <p className="text-gray-400 dark:text-gray-300 text-lg">Your Ultimate Streaming Guide</p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center pt-6">
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-red-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-red-500/10 dark:bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 dark:bg-red-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-3/4 left-1/3 w-40 h-40 bg-red-400/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-red-300/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.7s' }}></div>
      </div>
    </div>
  );
};

export default SplashScreen; 