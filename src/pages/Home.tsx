import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Play, Star, Calendar, Clock, Award, BellPlus, Info } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import StreamingServices from '../components/StreamingServices';
import { Movie, Genre } from '../services/tmdb';
import { tmdbService } from '../services/tmdb';

interface HomeProps {
  movies: Movie[];
  genres: Genre[];
  loading: boolean;
}

// Genre background images mapping
const genreBackgrounds: Record<string, string> = {
  'Action': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1925&q=80',
  'Adventure': 'https://images.unsplash.com/photo-1443926818681-717d074a57af?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  'Animation': 'https://images.unsplash.com/photo-1513651180702-6300a5dff835?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  'Comedy': 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
  'Crime': 'https://images.unsplash.com/photo-1605806616949-59450e59f5ae?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  'Documentary': 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
  'Drama': 'https://images.unsplash.com/photo-1493804714600-6edb1cd93080?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  'Family': 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1438&q=80',
  'Fantasy': 'https://images.unsplash.com/photo-1520034475321-cbe63696469a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  'History': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1474&q=80',
  'Horror': 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  'Music': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  'Mystery': 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  'Romance': 'https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80',
  'Science Fiction': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1925&q=80',
  'TV Movie': 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  'Thriller': 'https://images.unsplash.com/photo-1599639668273-8795f50b8206?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
  'War': 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1474&q=80',
  'Western': 'https://images.unsplash.com/photo-1570516645919-d2d0ecb7968b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
};

// Default background for genres without a specific image
const defaultGenreBackground = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1459&q=80';

const Home: React.FC<HomeProps> = ({ movies, genres, loading }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'tv'>('all');
  const [genreMovieCounts, setGenreMovieCounts] = useState<Record<number, number>>({});
  
  // We'll simulate featured movies with the first movie
  const featuredMovie = movies.length > 0 ? movies[0] : null;
  
  // Function to simulate top-rated content
  const getTopRatedMovies = () => {
    return [...movies].sort((a, b) => b.vote_average - a.vote_average).slice(0, 5);
  };

  // Calculate genre counts based on available movies
  useEffect(() => {
    const counts: Record<number, number> = {};
    
    movies.forEach(movie => {
      if (movie.genre_ids) {
        movie.genre_ids.forEach(genreId => {
          counts[genreId] = (counts[genreId] || 0) + 1;
        });
      }
    });
    
    setGenreMovieCounts(counts);
  }, [movies]);

  // Get background image for a genre
  const getGenreBackground = (genreName: string): string => {
    return genreBackgrounds[genreName] || defaultGenreBackground;
  };

  // Simulated coming soon data
  const comingSoonMovies = [
    {
      id: 1001,
      title: "The Matrix Resurrection",
      poster_path: "https://m.media-amazon.com/images/M/MV5BMGJkNDJlZWUtOGM1Ny00YjNkLThiM2QtY2ZjMzQxMTIxNWNmXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
      backdrop_path: "https://musicart.xboxlive.com/7/94ac5000-0000-0000-0000-000000000002/504/image.jpg",
      release_date: "2023-12-15",
      overview: "Return to the world of two realities: one, everyday life; the other, what lies behind it. To find out if his reality is a construct, to truly know himself, Mr. Anderson will have to choose to follow the white rabbit once more."
    },
    {
      id: 1002,
      title: "Dune: Part Two",
      poster_path: "https://m.media-amazon.com/images/M/MV5BODI0YjNhNjUtYjM0My00MTUwLWFlYTMtMWI2NGUzYjlkZTRjXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
      backdrop_path: "https://www.koimoi.com/wp-content/new-galleries/2023/05/dune-part-two-gets-new-release-date-in-2024-001.jpg",
      release_date: "2023-11-20",
      overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family."
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section with Featured Movie */}
      {featuredMovie && (
        <div className="relative h-[70vh] rounded-xl overflow-hidden shadow-xl">
          <img
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
            alt={featuredMovie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-red-600 px-2 py-1 text-xs font-semibold rounded">FEATURED</span>
                <span className="text-sm flex items-center"><Star className="w-4 h-4 text-yellow-400 mr-1" />{featuredMovie.vote_average.toFixed(1)}</span>
                <span className="text-sm flex items-center"><Calendar className="w-4 h-4 mr-1" />{new Date(featuredMovie.release_date).getFullYear()}</span>
              </div>
              <h1 className="text-5xl font-bold mb-4">{featuredMovie.title}</h1>
              <p className="text-lg mb-6 line-clamp-2">{featuredMovie.overview}</p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => navigate(`/movie/${featuredMovie.id}`)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-0.5 font-medium"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Watch Now</span>
                </button>
                <button 
                  onClick={() => navigate(`/movie/${featuredMovie.id}`)}
                  className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20 transform hover:-translate-y-0.5 font-medium"
                >
                  <Info className="w-5 h-5" />
                  <span>More Info</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Continue Watching Section */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Continue Watching</h2>
          <button className="text-gray-600 hover:text-gray-900 flex items-center text-sm font-medium">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[...movies].slice(0, 3).map((movie, index) => (
            <div key={movie.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="relative w-20 h-24 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{movie.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{Math.floor(Math.random() * 90) + 10}% watched</span>
                </div>
                <div className="w-full bg-gray-200 h-1 rounded-full mt-2">
                  <div 
                    className="bg-red-600 h-1 rounded-full" 
                    style={{ width: `${Math.floor(Math.random() * 90) + 10}%` }}
                  ></div>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="p-2 hover:bg-gray-200 rounded-full"
              >
                <Play className="w-5 h-5 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Streaming Services */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Streaming Services</h2>
        <StreamingServices />
      </section>

      {/* Popular Categories Tabs */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Popular Now</h2>
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-full">
            <button 
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'movies' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveTab('movies')}
            >
              Movies
            </button>
            <button 
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'tv' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveTab('tv')}
            >
              TV Shows
            </button>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-[2/3] bg-gray-200" />
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.slice(0, 5).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* Top Rated Section */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Award className="w-6 h-6 text-yellow-500 mr-2" />
            <h2 className="text-2xl font-bold">Top Rated</h2>
          </div>
          <button className="text-gray-600 hover:text-gray-900 flex items-center text-sm font-medium">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {getTopRatedMovies().map((movie) => (
            <MovieCard key={movie.id} movie={movie} showStreamingInfo={false} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {genres.slice(0, 10).map((genre) => (
            <button
              key={genre.id}
              className="relative rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden group h-40"
              onClick={() => navigate(`/movies?genre=${genre.id}`)}
            >
              <img 
                src={getGenreBackground(genre.name)} 
                alt={genre.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent group-hover:via-black/40 transition-colors"></div>
              <div className="absolute inset-0 p-4 flex flex-col justify-end z-10">
                <h3 className="font-bold text-lg text-white">{genre.name}</h3>
                <span className="text-sm text-white/80">{genreMovieCounts[genre.id] || Math.floor(Math.random() * 200) + 50} titles</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BellPlus className="w-6 h-6 text-purple-500 mr-2" />
            <h2 className="text-2xl font-bold">Coming Soon</h2>
          </div>
          <button className="text-gray-600 hover:text-gray-900 flex items-center text-sm font-medium">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="space-y-6">
          {comingSoonMovies.map((movie) => (
            <div key={movie.id} className="flex flex-col md:flex-row gap-4 bg-gray-50 rounded-xl overflow-hidden">
              <div className="w-full md:w-80 h-48 md:h-auto relative">
                <img
                  src={movie.backdrop_path}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback image if the main one fails
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/800x450?text=Coming+Soon';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors">
                  <button className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-colors">
                    <Play className="w-10 h-10" />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 text-xs font-semibold rounded">COMING SOON</span>
                  <span className="text-sm text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(movie.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{movie.overview}</p>
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-1 text-sm font-medium text-red-600 hover:text-red-700">
                    <BellPlus className="w-4 h-4" />
                    <span>Notify Me</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 