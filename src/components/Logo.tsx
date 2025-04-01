import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-800 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-sm transform rotate-45" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary-600 rounded-full border-2 border-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
          StreamMax
        </span>
        <span className="text-xs text-gray-500">Your Ultimate Guide</span>
      </div>
    </div>
  );
};

export default Logo; 