import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';
import MovieCard from './components/MovieCard';
import Onboarding from './components/Onboarding';
import StreamingServices from './components/StreamingServices';
import { Search, Home, Film, Tv, User, ChevronRight, Bell, SlidersHorizontal } from 'lucide-react';
import { tmdbService, Movie, Genre } from './services/tmdb';

function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesData, genresData] = await Promise.all([
          tmdbService.getTrendingMovies(),
          tmdbService.getGenres()
        ]);
        setMovies(moviesData);
        setGenres(genresData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (hasCompletedOnboarding) {
      fetchData();
    }
  }, [hasCompletedOnboarding]);

  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={() => setHasCompletedOnboarding(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo />
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="w-6 h-6 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Search className="w-6 h-6 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <SlidersHorizontal className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-6 text-white mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold mb-2">Welcome to StreamMax</h1>
          <p className="text-sm mb-4">Your personal streaming guide</p>
          <button className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors flex items-center">
            Discover New Content
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Streaming Services Section */}
        <StreamingServices />

        {/* Featured Movies Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Trending Movies</h2>
            <button className="text-red-600 text-sm font-medium flex items-center">
              See All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200" />
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {movies.slice(0, 4).map((movie) => (
                <MovieCard
                  key={movie.id}
                  title={movie.title}
                  genres={movie.genre_ids.map(id => 
                    genres.find(g => g.id === id)?.name || ''
                  ).filter(Boolean)}
                  rating={movie.vote_average}
                  imageUrl={tmdbService.getImageUrl(movie.poster_path)}
                  streamingService="Loading..."
                />
              ))}
            </div>
          )}
        </section>

        {/* Categories Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">Browse by Category</h2>
          <div className="grid grid-cols-3 gap-3">
            {genres.slice(0, 6).map((genre) => (
              <button
                key={genre.id}
                className="bg-white p-3 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-sm font-medium text-gray-700">{genre.name}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center p-2 ${
              activeTab === 'home' ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('movies')}
            className={`flex flex-col items-center p-2 ${
              activeTab === 'movies' ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            <Film className="w-6 h-6" />
            <span className="text-xs mt-1">Movies</span>
          </button>
          <button
            onClick={() => setActiveTab('tv')}
            className={`flex flex-col items-center p-2 ${
              activeTab === 'tv' ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            <Tv className="w-6 h-6" />
            <span className="text-xs mt-1">TV Shows</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center p-2 ${
              activeTab === 'profile' ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
