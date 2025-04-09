import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Search, X, Film, Tv, Clock, ArrowRight, Loader2, Star } from 'lucide-react';
import { Movie } from '../services/tmdb';
import { tmdbService } from '../services/tmdb';
import { useTheme } from '../context/ThemeContext';

interface SearchBarProps {
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
}

type SearchCategory = 'movies' | 'tv' | 'all';

const SearchBar: React.FC<SearchBarProps> = ({ onClose, onSelectMovie }) => {
  const { isDark } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<SearchCategory>('all');
  const [showRecent, setShowRecent] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Load recent searches
  useEffect(() => {
    if (query === '' && recentSearches.length > 0) {
      setShowRecent(true);
    } else {
      setShowRecent(false);
    }
  }, [query, recentSearches]);

  // Search effect
  useEffect(() => {
    const searchContent = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        let searchResults: Movie[] = [];
        
        if (category === 'movies' || category === 'all') {
          const movieResults = await tmdbService.searchMovies(query);
          searchResults = [...searchResults, ...movieResults];
        }
        
        if (category === 'tv' || category === 'all') {
          // We could add TV show search here if the API supports it
          // const tvResults = await tmdbService.searchTVShows(query);
          // searchResults = [...searchResults, ...tvResults];
        }
        
        setResults(searchResults);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Error searching content:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchContent, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, category]);

  // Save recent searches to localStorage
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
      if (selectedIndex >= 0 && resultsRef.current) {
        const selectedElement = resultsRef.current.children[selectedIndex + 1];
        if (selectedElement) {
          selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
      if (selectedIndex > 0 && resultsRef.current) {
        const selectedElement = resultsRef.current.children[selectedIndex - 1];
        if (selectedElement) {
          selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      onSelectMovie(results[selectedIndex]);
      saveSearch(query);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    inputRef.current?.focus();
  };

  const saveSearch = (searchTerm: string) => {
    if (searchTerm.trim() && !recentSearches.includes(searchTerm)) {
      const updated = [searchTerm, ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleSelectMovie = (movie: Movie) => {
    saveSearch(query);
    onSelectMovie(movie);
  };

  return (
    <div 
      ref={searchRef}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex flex-col animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="flex flex-col h-full mt-16">
        {/* Search Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search movies and tv shows..."
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white text-gray-900"
                autoFocus
              />
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Categories */}
          <div className="flex items-center space-x-2 mt-3">
            <button
              onClick={() => setCategory('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center space-x-1 ${
                category === 'all' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>All</span>
            </button>
            <button
              onClick={() => setCategory('movies')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center space-x-1 ${
                category === 'movies' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Movies</span>
            </button>
            <button
              onClick={() => setCategory('tv')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center space-x-1 ${
                category === 'tv' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>TV Shows</span>
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                <span className="mt-2 text-sm text-gray-500">Searching...</span>
              </div>
            </div>
          ) : showRecent && recentSearches.length > 0 ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Recent Searches</h3>
                <button 
                  onClick={clearRecentSearches}
                  className="text-xs text-red-600 hover:underline"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(term)}
                    className="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-transparent hover:border-gray-200"
                  >
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-700">{term}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div 
              ref={resultsRef}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
            >
              {results.map((movie, index) => (
                <button
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie)}
                  className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-transparent hover:border-gray-200 ${
                    selectedIndex === index ? 'ring-2 ring-red-600 scale-[1.02]' : ''
                  }`}
                >
                  <div className="relative aspect-[2/3]">
                    <img
                      src={tmdbService.getImageUrl(movie.poster_path, 'w500')}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x750?text=No+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center text-white space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">{movie.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-1 text-gray-900">{movie.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim().length >= 2 ? (
            <div className="flex flex-col items-center justify-center h-40 p-4 text-center">
              <div className="bg-gray-100 rounded-full p-3 mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-700 font-medium">No results found for "{query}"</p>
              <p className="text-sm text-gray-500 mt-1">Try searching for a different term</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 