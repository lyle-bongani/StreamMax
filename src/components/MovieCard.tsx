import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Info } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { Movie, StreamingService } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  showStreamingInfo?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, showStreamingInfo = true }) => {
  const navigate = useNavigate();
  const [streamingServices, setStreamingServices] = React.useState<StreamingService[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStreamingServices = async () => {
      try {
        const services = await tmdbService.getMovieProviders(movie.id);
        setStreamingServices(services);
      } catch (error) {
        console.error('Error fetching streaming services:', error);
      } finally {
        setLoading(false);
      }
    };

    if (showStreamingInfo) {
      fetchStreamingServices();
    }
  }, [movie.id, showStreamingInfo]);

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 hover:scale-105">
      <div className="relative aspect-[2/3]">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-semibold text-lg mb-2">{movie.title}</h3>
          <div className="flex items-center space-x-2 text-white/80 text-sm mb-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{movie.vote_average.toFixed(1)}</span>
            <span>•</span>
            <span>{new Date(movie.release_date).getFullYear()}</span>
          </div>
          {showStreamingInfo && (
            <div className="flex items-center space-x-2 mb-4">
              {loading ? (
                <div className="animate-pulse flex space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-6 h-6 bg-gray-700 rounded-full" />
                  ))}
                </div>
              ) : (
                streamingServices.slice(0, 3).map((service) => (
                  <img
                    key={service.provider_id}
                    src={`https://image.tmdb.org/t/p/original${service.logo_path}`}
                    alt={service.provider_name}
                    className="w-6 h-6 rounded-full"
                  />
                ))
              )}
            </div>
          )}
          <div className="flex space-x-2">
            <button 
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-current" />
              <span className="font-medium">Watch Now</span>
            </button>
            <button 
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20 transform hover:-translate-y-0.5"
            >
              <Info className="w-4 h-4" />
              <span className="font-medium">Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard; 