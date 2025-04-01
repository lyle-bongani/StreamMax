import React from 'react';
import { Star, Play } from 'lucide-react';

interface MovieCardProps {
  title: string;
  genres: string[];
  rating: number;
  imageUrl?: string;
  streamingService: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, genres, rating, imageUrl, streamingService }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden active:scale-95 transition-transform">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative group">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="object-cover w-full h-full"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
            <span className="text-4xl">🎬</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all">
            <Play className="w-12 h-12 text-white" />
          </button>
        </div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          {rating.toFixed(1)}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 line-clamp-1">{genres.join(', ')}</p>
          <span className="text-xs font-medium text-red-600">{streamingService}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard; 