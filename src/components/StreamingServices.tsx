import React from 'react';
import { Play, Star, Clock, Tv, Film, Plus } from 'lucide-react';

interface StreamingService {
  id: string;
  name: string;
  logo: string;
  color: string;
  contentCount: number;
  imageUrl: string;
}

const streamingServices: StreamingService[] = [
  { 
    id: 'netflix', 
    name: 'Netflix', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/200px-Netflix_2015_logo.svg.png',
    color: 'from-red-600 to-red-800', 
    contentCount: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'disney', 
    name: 'Disney+', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/200px-Disney%2B_logo.svg.png',
    color: 'from-blue-600 to-blue-800', 
    contentCount: 800,
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'hulu', 
    name: 'Hulu', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Hulu_Logo.svg/200px-Hulu_Logo.svg.png',
    color: 'from-green-600 to-green-800', 
    contentCount: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'prime', 
    name: 'Prime Video', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Prime_Video_Logo.svg/200px-Prime_Video_Logo.svg.png',
    color: 'from-blue-400 to-blue-600', 
    contentCount: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'hbo', 
    name: 'HBO Max', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/HBO_Max_Logo.svg/200px-HBO_Max_Logo.svg.png',
    color: 'from-purple-600 to-purple-800', 
    contentCount: 900,
    imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'apple', 
    name: 'Apple TV+', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Apple_TV_Plus_Logo.svg/200px-Apple_TV_Plus_Logo.svg.png',
    color: 'from-gray-600 to-gray-800', 
    contentCount: 300,
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'tubi', 
    name: 'Tubi', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Tubi_logo.svg/200px-Tubi_logo.svg.png',
    color: 'from-orange-500 to-orange-700', 
    contentCount: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'plex', 
    name: 'Plex', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Plex_logo.svg/200px-Plex_logo.svg.png',
    color: 'from-indigo-500 to-indigo-700', 
    contentCount: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
];

const StreamingServices: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Streaming Services</h2>
        <button className="text-red-600 text-sm font-medium flex items-center">
          Manage
          <Plus className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {streamingServices.map((service) => (
          <div
            key={service.id}
            className={`bg-gradient-to-r ${service.color} rounded-xl p-4 text-white shadow-sm active:scale-95 transition-transform relative overflow-hidden`}
          >
            <div className="absolute inset-0 opacity-10">
              <img 
                src={service.imageUrl} 
                alt={service.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <img 
                    src={service.logo} 
                    alt={`${service.name} logo`} 
                    className="h-6 w-auto"
                  />
                </div>
                <button className="p-1 hover:bg-white/10 rounded-full">
                  <Play className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center text-sm text-white/80">
                <Film className="w-4 h-4 mr-1" />
                <span>{service.contentCount.toLocaleString()} titles</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Continue Watching</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${item === 1 ? '1536440136628-849c177e76a1' : item === 2 ? '1574375927938-d5a98e8ffe85' : '1536440136628-849c177e76a1'}?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80`}
                  alt={`Movie ${item}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Movie Title {item}</span>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Tv className="w-3 h-3 mr-1" />
                  <span>Netflix</span>
                  <span className="mx-2">•</span>
                  <span>45% complete</span>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Play className="w-5 h-5 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreamingServices; 