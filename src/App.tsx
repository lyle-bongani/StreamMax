import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Home, Film, Tv, User, Search, Bell } from 'lucide-react';
import HomePage from './pages/Home';
import MoviesPage from './pages/Movies';
import TVShowsPage from './pages/TVShows';
import ProfilePage from './pages/Profile';
import MovieDetails from './pages/MovieDetails';
import { tmdbService, Movie, Genre } from './services/tmdb';
import Onboarding from './components/Onboarding';
import SplashScreen from './components/SplashScreen';
import SearchBar from './components/SearchBar';
import Logo from './components/Logo';
import { ArrowLeft } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('/');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the target is not an input or textarea to avoid capturing keystrokes during typing
      const target = e.target as HTMLElement;
      const isInput = 
        target instanceof HTMLInputElement || 
        target instanceof HTMLTextAreaElement || 
        target.isContentEditable;
      
      // "/" key to open search (common in many web apps)
      if (e.key === '/' && !isInput) {
        e.preventDefault();
        setShowSearch(true);
      }
      
      // Escape key to close search
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  // Handle splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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

    if (onboardingComplete) {
      fetchData();
    }
  }, [onboardingComplete]);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  const handleMovieSelect = (movie: Movie) => {
    setShowSearch(false);
    navigate(`/movie/${movie.id}`);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!onboardingComplete) {
    return <Onboarding onComplete={() => setOnboardingComplete(true)} />;
  }

  const showBackButton = location.pathname !== '/' && 
                        location.pathname !== '/movies' && 
                        location.pathname !== '/tv' && 
                        location.pathname !== '/profile';

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 flex items-center space-x-1 relative z-50"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline text-sm ml-1">Search</span>
              <kbd className="hidden sm:flex items-center justify-center ml-2 w-6 h-6 text-xs font-semibold text-gray-500 bg-gray-100 rounded border border-gray-300">/</kbd>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-20 pb-24 min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<HomePage movies={movies} genres={genres} loading={loading} />} />
          <Route path="/movies" element={<MoviesPage movies={movies} genres={genres} loading={loading} />} />
          <Route path="/tv" element={<TVShowsPage movies={movies} genres={genres} loading={loading} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            <button
              onClick={() => navigate('/')}
              className={`flex flex-col items-center space-y-1 ${
                activeTab === '/' ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => navigate('/movies')}
              className={`flex flex-col items-center space-y-1 ${
                activeTab === '/movies' ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Film className="w-6 h-6" />
              <span className="text-xs">Movies</span>
            </button>
            <button
              onClick={() => navigate('/tv')}
              className={`flex flex-col items-center space-y-1 ${
                activeTab === '/tv' ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Tv className="w-6 h-6" />
              <span className="text-xs">TV Shows</span>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className={`flex flex-col items-center space-y-1 ${
                activeTab === '/profile' ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      {showSearch && (
        <SearchBar
          onClose={() => setShowSearch(false)}
          onSelectMovie={handleMovieSelect}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
