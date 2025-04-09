import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Star, ChevronRight, Popcorn, Ticket, Award, Calendar, TrendingUp } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { tmdbService, Movie, Genre } from '../services/tmdb';

interface MoviesProps {
  movies: Movie[];
  genres: Genre[];
  loading: boolean;
}

const Movies: React.FC<MoviesProps> = ({ movies, genres, loading }) => {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'showcase'>('showcase');
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);

  // Get top rated movies for featured section
  useEffect(() => {
    if (movies.length > 0) {
      const topRated = [...movies]
        .sort((a, b) => b.vote_average - a.vote_average)
        .slice(0, 5);
      setFeaturedMovies(topRated);
    }
  }, [movies]);

  const filteredMovies = selectedGenre
    ? movies.filter(movie => movie.genre_ids.includes(selectedGenre))
    : movies;

  // Get movie backdrop URL
  const getBackdropUrl = (path: string) => {
    if (!path) return 'https://via.placeholder.com/1280x720?text=No+Image+Available';
    return `https://image.tmdb.org/t/p/w1280${path}`;
  };

  return (
    <div className="space-y-8">
      {/* Cinematic Header with Backdrop */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl mb-8">
        {featuredMovies.length > 0 && (
          <>
            <div className="absolute inset-0">
              <img 
                src={getBackdropUrl(featuredMovies[0].backdrop_path)}
                alt={featuredMovies[0].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              <div className="flex items-center space-x-2 mb-1">
                <Ticket className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Now Showing</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{featuredMovies[0].title}</h1>
              <div className="flex items-center space-x-3 text-white/80 mb-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                  <span>{featuredMovies[0].vote_average.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span>{new Date(featuredMovies[0].release_date).getFullYear()}</span>
              </div>
              <button 
                onClick={() => navigate(`/movie/${featuredMovies[0].id}`)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition duration-200 w-fit"
              >
                View Details
              </button>
            </div>
          </>
        )}
      </div>

      {/* Controls Row */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-bold flex items-center">
          <Popcorn className="w-6 h-6 mr-2 text-red-600" />
          <span>Movie Theater</span>
        </h2>
        
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg overflow-hidden border">
            <button
              onClick={() => setViewMode('showcase')}
              className={`px-4 py-2 flex items-center ${viewMode === 'showcase' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}
            >
              <Calendar className="w-4 h-4 mr-1" />
              <span className="text-sm">Showcase</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 flex items-center ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">All Movies</span>
            </button>
          </div>
          
          {/* Filter Button */}
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg border shadow-sm">
            <Filter className="w-5 h-5" />
            <span className="text-sm">Filter</span>
          </button>
        </div>
      </div>

      {/* Genre Filter - Film Strip Style */}
      <div className="relative py-3">
        <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        <div className="flex gap-3 overflow-x-auto pb-2 px-2 scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-100">
          <button
            onClick={() => setSelectedGenre(null)}
            className={`px-5 py-2 rounded-full whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
              selectedGenre === null
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border'
            }`}
          >
            All Movies
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`px-5 py-2 rounded-full whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                selectedGenre === genre.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'showcase' ? (
        /* Featured Movies Showcase */
        <div className="space-y-8">
          {/* Award Winners */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Award className="w-6 h-6 text-yellow-500 mr-2" />
                <h2 className="text-2xl font-bold">Award Winners</h2>
              </div>
              <button 
                onClick={() => setViewMode('grid')}
                className="text-gray-600 hover:text-gray-900 flex items-center text-sm font-medium"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {featuredMovies.map((movie) => (
                <div key={movie.id} className="flex-shrink-0 w-60" onClick={() => navigate(`/movie/${movie.id}`)}>
                  <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white">
                    <div className="h-80 relative">
                      <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        {movie.vote_average.toFixed(1)}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold truncate">{movie.title}</h3>
                      <p className="text-gray-500 text-sm">{new Date(movie.release_date).getFullYear()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Popular Movies */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Popcorn className="w-6 h-6 text-red-500 mr-2" />
                <h2 className="text-2xl font-bold">Popular Movies</h2>
              </div>
              <button 
                onClick={() => setViewMode('grid')}
                className="text-gray-600 hover:text-gray-900 flex items-center text-sm font-medium"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {movies.slice(0, 8).map((movie) => (
                <div key={movie.id} className="flex-shrink-0 w-60" onClick={() => navigate(`/movie/${movie.id}`)}>
                  <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white">
                    <div className="h-80 relative">
                      <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        {movie.vote_average.toFixed(1)}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold truncate">{movie.title}</h3>
                      <p className="text-gray-500 text-sm">{new Date(movie.release_date).getFullYear()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* All Movies Grid */
        <>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <div key={n} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="aspect-w-2 aspect-h-3 bg-gray-200" />
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-600">Showing {filteredMovies.length} movies</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Movies; 