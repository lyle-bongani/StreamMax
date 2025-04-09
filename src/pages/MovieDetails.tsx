import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Star, Clock, Calendar, Info, X, AlertCircle, Share2, Heart, Bookmark, CheckCircle, Loader } from 'lucide-react';
import { tmdbService, Movie, StreamingService, Genre } from '../services/tmdb';
import MovieCard from '../components/MovieCard';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [streamingServices, setStreamingServices] = useState<StreamingService[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStreamingInfo, setShowStreamingInfo] = useState(false);
  const [selectedService, setSelectedService] = useState<StreamingService | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlist, setIsWatchlist] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [showStillWatching, setShowStillWatching] = useState(false);
  const watchingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;
      try {
        const [movieData, servicesData, genresData] = await Promise.all([
          tmdbService.getMovieDetails(parseInt(id)),
          tmdbService.getMovieProviders(parseInt(id)),
          tmdbService.getGenres()
        ]);
        setMovie(movieData);
        setStreamingServices(servicesData);
        setGenres(genresData);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      if (!id) return;
      try {
        const response = await fetch(
          `${tmdbService.getBaseUrl()}/movie/${id}/similar?api_key=${tmdbService.getApiKey()}`
        );
        const data = await response.json();
        setSimilarMovies(data.results.slice(0, 6));
      } catch (error) {
        console.error('Error fetching similar movies:', error);
      }
    };

    fetchSimilarMovies();
  }, [id]);

  const handleWatchNow = () => {
    if (streamingServices.length > 0) {
      setShowStreamingInfo(true);
    } else {
      alert('This movie is not currently available for streaming. Please check back later.');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleWatchlist = () => {
    setIsWatchlist(!isWatchlist);
  };

  const startWatching = (service: StreamingService) => {
    setSelectedService(service);
    setIsWatching(true);
    setShowStreamingInfo(false);
    
    // Set a timer to show the "Still watching?" prompt after 30 seconds (in a real app this would be much longer)
    watchingTimerRef.current = setTimeout(() => {
      setShowStillWatching(true);
    }, 30000); // 30 seconds for demo purposes
  };
  
  const stopWatching = () => {
    setIsWatching(false);
    if (watchingTimerRef.current) {
      clearTimeout(watchingTimerRef.current);
      watchingTimerRef.current = null;
    }
    setShowStillWatching(false);
  };
  
  const confirmStillWatching = () => {
    setShowStillWatching(false);
    
    // Reset the timer to check again after another period
    watchingTimerRef.current = setTimeout(() => {
      setShowStillWatching(true);
    }, 30000); // 30 seconds for demo purposes
  };
  
  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (watchingTimerRef.current) {
        clearTimeout(watchingTimerRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-xl mb-4" />
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Movie not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-red-600 hover:text-red-700"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  const movieGenres = genres.filter(genre => movie.genre_ids?.includes(genre.id));

  return (
    <div className="min-h-screen bg-gray-100">
      {isWatching ? (
        <div className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-4xl aspect-video bg-gray-900 flex items-center justify-center">
            <img
              src={tmdbService.getImageUrl(movie.backdrop_path, 'original')}
              alt={movie.title}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute top-4 right-4">
              <button 
                onClick={stopWatching}
                className="bg-white/10 hover:bg-white/20 rounded-full p-2 text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-center">
                <h2 className="text-white text-xl font-medium mb-2">
                  Watching {movie.title} on {selectedService?.provider_name}
                </h2>
                <div className="animate-pulse">
                  <Loader className="h-16 w-16 text-red-600 mx-auto animate-spin" />
                </div>
                <p className="text-gray-400 mt-4">
                  This is a simulation. In a real app, the actual streaming content would play here.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      
      {/* Still Watching Prompt */}
      {showStillWatching && (
        <div className="fixed inset-0 bg-black/80 z-45 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 animate-fade-in shadow-xl">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Are you still watching?</h3>
              <p className="text-gray-600 mt-2">
                We've noticed you've been inactive for a while
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={confirmStillWatching}
                className="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Yes, I'm Still Watching
              </button>
              <button
                onClick={stopWatching}
                className="bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Exit Playback
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Backdrop Image */}
      <div className="relative h-96">
        <img
          src={tmdbService.getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Movie Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center space-x-4 text-sm mb-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                {movie.vote_average.toFixed(1)}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(movie.release_date).getFullYear()}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {movie.runtime} min
              </div>
            </div>
            
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {movieGenres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-white/10 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-gray-200 mb-6 line-clamp-3">{movie.overview}</p>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowStreamingInfo(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-0.5 font-medium"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Watch Now</span>
                </button>
                <button 
                  onClick={() => window.open(`https://www.themoviedb.org/movie/${movie.id}`, '_blank')}
                  className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20 transform hover:-translate-y-0.5 font-medium"
                >
                  <Info className="w-5 h-5" />
                  <span>More Info</span>
                </button>
              </div>
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full hover:bg-white/10 transition-all duration-200 transform hover:-translate-y-0.5 ${
                  isFavorite ? 'text-red-500' : 'text-white'
                }`}
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={toggleWatchlist}
                className={`p-2 rounded-full hover:bg-white/10 transition-all duration-200 transform hover:-translate-y-0.5 ${
                  isWatchlist ? 'text-yellow-500' : 'text-white'
                }`}
              >
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 transform hover:-translate-y-0.5 text-white">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Streaming Services */}
        {streamingServices.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Available on</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {streamingServices.map((service) => (
                <button
                  key={service.provider_id}
                  onClick={() => {
                    setSelectedService(service);
                    setShowStreamingInfo(true);
                  }}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 flex items-center space-x-3"
                >
                  <img
                    src={tmdbService.getImageUrl(service.logo_path, 'original')}
                    alt={service.provider_name}
                    className="w-8 h-8 rounded object-contain"
                  />
                  <span className="font-medium">{service.provider_name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Similar Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {similarMovies.map((similarMovie) => (
                <MovieCard
                  key={similarMovie.id}
                  movie={similarMovie}
                  showStreamingInfo={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Streaming Info Modal */}
      {showStreamingInfo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Watch {movie.title}</h3>
              <button
                onClick={() => setShowStreamingInfo(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {selectedService ? (
              <>
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={tmdbService.getImageUrl(selectedService.logo_path, 'original')}
                    alt={selectedService.provider_name}
                    className="w-12 h-12 rounded object-contain"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedService.provider_name}</h4>
                    <p className="text-sm text-gray-600">Available for streaming</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  To watch this movie, you'll need to:
                  <ol className="list-decimal list-inside mt-2 space-y-2">
                    <li>Sign up for {selectedService.provider_name}</li>
                    <li>Subscribe to their service</li>
                    <li>Search for "{movie.title}" on their platform</li>
                  </ol>
                </p>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => startWatching(selectedService)}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-0.5 font-medium"
                  >
                    Watch Now (Simulation)
                  </button>
                  <button
                    onClick={() => window.open(`https://www.${selectedService.provider_name.toLowerCase().replace(/\s+/g, '')}.com`, '_blank')}
                    className="w-full bg-white/10 backdrop-blur-sm text-gray-700 py-3 rounded-lg hover:bg-white/20 transition-all duration-200 border border-gray-200 transform hover:-translate-y-0.5 font-medium"
                  >
                    Visit {selectedService.provider_name}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  This movie is available on multiple streaming services. Please select a service to view more information.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {streamingServices.map((service) => (
                    <button
                      key={service.provider_id}
                      onClick={() => setSelectedService(service)}
                      className="bg-white border border-gray-200 p-3 rounded-lg hover:shadow-md transition-shadow flex flex-col items-center space-y-2"
                    >
                      <img
                        src={tmdbService.getImageUrl(service.logo_path, 'original')}
                        alt={service.provider_name}
                        className="w-10 h-10 rounded object-contain"
                      />
                      <span className="font-medium text-sm text-gray-800">{service.provider_name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails; 