import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Filter, ChevronRight, ChevronLeft, Play, 
  Star, Calendar, Clock, Info, Tv, TrendingUp,
  ListFilter, Layers, Grid3X3, Bookmark, Clock4
} from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { Movie, Genre } from '../services/tmdb';
import { tmdbService } from '../services/tmdb';
import { TVShow } from '../types/movie';

interface TVShowsProps {
  movies: Movie[];
  genres: Genre[];
  loading: boolean;
}

interface Category {
  id: number;
  name: string;
  shows: TVShow[];
}

const TVShows: React.FC<TVShowsProps> = ({ movies, genres, loading }) => {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [layoutView, setLayoutView] = useState<'grid' | 'list'>('grid');
  const [categories, setCategories] = useState<Category[]>([]);

  const filteredMovies = selectedGenre
    ? movies.filter(movie => movie.genre_ids.includes(selectedGenre))
    : movies;

  // Simulated TV show data
  const featuredShows = movies.slice(0, 5).map(movie => ({
    ...movie,
    seasons: Math.floor(Math.random() * 5) + 1,
    episodes: Math.floor(Math.random() * 24) + 6,
    lastAired: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString().split('T')[0]
  }));

  // Change carousel show every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % featuredShows.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [featuredShows.length]);

  // Navigate to prev/next carousel item
  const navigateCarousel = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCarouselIndex(prev => (prev === 0 ? featuredShows.length - 1 : prev - 1));
    } else {
      setCarouselIndex(prev => (prev + 1) % featuredShows.length);
    }
  };

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        const [popular, topRated, onAir] = await Promise.all([
          tmdbService.getPopularTVShows(),
          tmdbService.getTopRatedTVShows(),
          tmdbService.getOnAirTVShows()
        ]);

        setCategories([
          { id: 1, name: 'Popular Now', shows: popular },
          { id: 2, name: 'Top Rated', shows: topRated },
          { id: 3, name: 'Currently Airing', shows: onAir }
        ]);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      }
    };

    fetchTVShows();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="aspect-[2/3] bg-gray-200" />
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Carousel */}
      <div className="relative h-[60vh] rounded-xl overflow-hidden">
        {featuredShows.map((show, index) => (
          <div 
            key={show.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === carouselIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="relative h-full w-full">
              <img 
                src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
                alt={show.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
                <div className="flex items-center space-x-2 mb-2">
                  <Tv className="w-5 h-5 text-blue-400" />
                  <span className="font-medium text-blue-400">Featured Series</span>
                </div>
                <h1 className="text-4xl font-bold mb-3">{show.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-white/80 mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                    <span>{show.vote_average.toFixed(1)}</span>
                  </div>
                  <span>•</span>
                  <span>{show.seasons} Seasons</span>
                  <span>•</span>
                  <span>{show.episodes} Episodes</span>
                  <span>•</span>
                  <span>Last aired: {show.lastAired}</span>
                </div>
                
                <p className="text-white/70 max-w-2xl mb-6 line-clamp-2">
                  {show.overview}
                </p>
                
                <div className="flex space-x-4">
                  <button 
                    onClick={() => navigate(`/movie/${show.id}`)}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    <Play className="w-5 h-5" fill="currentColor" />
                    <span className="font-medium">Watch Now</span>
                  </button>
                  <button 
                    onClick={() => navigate(`/movie/${show.id}`)}
                    className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-md transition-colors"
                  >
                    <Info className="w-5 h-5" />
                    <span className="font-medium">More Info</span>
                  </button>
                </div>
              </div>
              
              {/* Carousel indicators */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {featuredShows.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      idx === carouselIndex ? 'bg-blue-500' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel controls */}
        <button 
          onClick={() => navigateCarousel('prev')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => navigateCarousel('next')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Tv className="w-6 h-6 mr-2 text-blue-600" />
          <span>TV Shows</span>
        </h2>
        
        <div className="flex items-center space-x-3">
          {/* Layout Toggle */}
          <div className="bg-white rounded-lg shadow-sm flex p-1">
            <button 
              onClick={() => setLayoutView('grid')}
              className={`p-2 rounded-md ${layoutView === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setLayoutView('list')}
              className={`p-2 rounded-md ${layoutView === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Layers className="w-5 h-5" />
            </button>
          </div>
          
          {/* Filter Button */}
          <button className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm text-gray-700 hover:text-gray-900">
            <ListFilter className="w-5 h-5" />
            <span className="text-sm font-medium">Filter</span>
          </button>
        </div>
      </div>

      {/* Genre Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 overflow-hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-100">
          <button
            onClick={() => setSelectedGenre(null)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedGenre === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Shows
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedGenre === genre.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Categories */}
      <div className="space-y-12">
        {categories.map((category) => (
          <section key={category.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold">{category.name}</h3>
              </div>
              <button 
                onClick={() => navigate(`/tv/category/${category.id}`)}
                className="text-gray-600 hover:text-gray-900 flex items-center text-sm font-medium"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {category.shows.map((show) => (
                <div key={show.id} className="group relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 hover:scale-105">
                  <div className="relative aspect-[2/3]">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                      alt={show.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold text-lg mb-2">{show.name}</h3>
                      <div className="flex items-center space-x-2 text-white/80 text-sm mb-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{show.vote_average.toFixed(1)}</span>
                        <span>•</span>
                        <span>{new Date(show.first_air_date).getFullYear()}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => navigate(`/tv/${show.id}`)}
                          className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-0.5"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span className="font-medium">Watch Now</span>
                        </button>
                        <button 
                          onClick={() => navigate(`/tv/${show.id}`)}
                          className="flex items-center space-x-1.5 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20 transform hover:-translate-y-0.5"
                        >
                          <Info className="w-4 h-4" />
                          <span className="font-medium">Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    TV Show
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* All TV Shows (Grid/List View) */}
      {filteredMovies.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="text-xl font-bold">All TV Shows ({filteredMovies.length})</h3>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                <div key={n} className="bg-gray-100 rounded-xl animate-pulse">
                  <div className="aspect-w-2 aspect-h-3 bg-gray-200 rounded-t-xl" />
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : layoutView === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMovies.map((show) => (
                <div 
                  key={show.id} 
                  className="bg-white rounded-xl overflow-hidden border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/movie/${show.id}`)}
                >
                  <div className="relative aspect-w-2 aspect-h-3">
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} 
                      alt={show.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" />
                      {show.vote_average.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm truncate">{show.title}</h4>
                    <p className="text-xs text-gray-500">{new Date(show.release_date).getFullYear()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMovies.map((show) => (
                <div 
                  key={show.id} 
                  className="flex bg-white rounded-xl p-2 border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/movie/${show.id}`)}
                >
                  <div className="w-16 h-24 flex-shrink-0 rounded-md overflow-hidden">
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} 
                      alt={show.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-grow overflow-hidden">
                    <h4 className="font-medium truncate">{show.title}</h4>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" />
                      <span>{show.vote_average.toFixed(1)}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(show.release_date).getFullYear()}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 line-clamp-2">{show.overview}</p>
                  </div>
                  <div className="ml-2 flex items-center">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full">
                      <Play className="w-5 h-5" fill="currentColor" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default TVShows; 