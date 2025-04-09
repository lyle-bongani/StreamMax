import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '../services/tmdb';

// Define types for user preferences
export interface UserPreferences {
  notifications: boolean;
  autoplay: boolean;
  subtitles: boolean;
  quality: 'auto' | 'low' | 'medium' | 'high' | '4k';
  language: string;
}

// Define types for connected services
export interface ConnectedService {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  username?: string;
  subscription?: string;
}

// Define user profile interface
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  preferences: UserPreferences;
  watchlist: Movie[];
  watchHistory: Array<{
    movie: Movie;
    timestamp: number;
    progress: number;
  }>;
  connectedServices: ConnectedService[];
}

// Define the context type
interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Omit<UserProfile, 'id'>>) => void;
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
  addToWatchHistory: (movie: Movie, progress: number) => void;
  removeFromWatchHistory: (movieId: number) => void;
  clearWatchHistory: () => void;
  toggleServiceConnection: (serviceId: string) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock connected services data
const initialConnectedServices: ConnectedService[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    icon: 'N',
    connected: true,
    username: 'johndoe@example.com',
    subscription: 'Premium'
  },
  {
    id: 'prime',
    name: 'Prime Video',
    icon: 'P',
    connected: true,
    username: 'johndoe@example.com',
    subscription: 'Standard'
  },
  {
    id: 'disney',
    name: 'Disney+',
    icon: 'D',
    connected: false
  },
  {
    id: 'hulu',
    name: 'Hulu',
    icon: 'H',
    connected: false
  },
  {
    id: 'hbo',
    name: 'HBO Max',
    icon: 'H',
    connected: false
  }
];

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('streammax_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user data:', e);
      }
    } else {
      // Create demo user for testing
      const demoUser: UserProfile = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '',
        bio: 'Movie enthusiast and binge-watcher',
        preferences: {
          notifications: true,
          autoplay: true,
          subtitles: false,
          quality: 'high',
          language: 'en-US'
        },
        watchlist: [],
        watchHistory: [],
        connectedServices: initialConnectedServices
      };
      setUser(demoUser);
      localStorage.setItem('streammax_user', JSON.stringify(demoUser));
    }
    setIsLoading(false);
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('streammax_user', JSON.stringify(user));
    }
  }, [user]);

  // Login function (mock implementation)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll always succeed with the same user
      const loggedInUser: UserProfile = {
        id: '1',
        name: 'John Doe',
        email: email,
        bio: 'Movie enthusiast and binge-watcher',
        preferences: {
          notifications: true,
          autoplay: true,
          subtitles: false,
          quality: 'high',
          language: 'en-US'
        },
        watchlist: [],
        watchHistory: [],
        connectedServices: initialConnectedServices
      };
      
      setUser(loggedInUser);
      localStorage.setItem('streammax_user', JSON.stringify(loggedInUser));
    } catch (err) {
      setError('Failed to login. Please check your credentials and try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('streammax_user');
  };

  // Update profile function
  const updateProfile = (updates: Partial<Omit<UserProfile, 'id'>>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  // Watchlist functions
  const addToWatchlist = (movie: Movie) => {
    if (user) {
      // Check if movie is already in watchlist
      if (!user.watchlist.some(m => m.id === movie.id)) {
        setUser({
          ...user,
          watchlist: [...user.watchlist, movie]
        });
      }
    }
  };

  const removeFromWatchlist = (movieId: number) => {
    if (user) {
      setUser({
        ...user,
        watchlist: user.watchlist.filter(movie => movie.id !== movieId)
      });
    }
  };

  const isInWatchlist = (movieId: number) => {
    return user?.watchlist.some(movie => movie.id === movieId) || false;
  };

  // Watch history functions
  const addToWatchHistory = (movie: Movie, progress: number) => {
    if (user) {
      // Remove existing entry if present
      const filteredHistory = user.watchHistory.filter(
        item => item.movie.id !== movie.id
      );
      
      // Add new entry
      setUser({
        ...user,
        watchHistory: [
          {
            movie,
            timestamp: Date.now(),
            progress
          },
          ...filteredHistory
        ]
      });
    }
  };

  const removeFromWatchHistory = (movieId: number) => {
    if (user) {
      setUser({
        ...user,
        watchHistory: user.watchHistory.filter(item => item.movie.id !== movieId)
      });
    }
  };

  const clearWatchHistory = () => {
    if (user) {
      setUser({
        ...user,
        watchHistory: []
      });
    }
  };

  // Connected services functions
  const toggleServiceConnection = (serviceId: string) => {
    if (user) {
      setUser({
        ...user,
        connectedServices: user.connectedServices.map(service => 
          service.id === serviceId 
            ? { ...service, connected: !service.connected }
            : service
        )
      });
    }
  };

  // Update preferences
  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    if (user) {
      setUser({
        ...user,
        preferences: {
          ...user.preferences,
          ...prefs
        }
      });
    }
  };

  // Create context value object
  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    addToWatchHistory,
    removeFromWatchHistory,
    clearWatchHistory,
    toggleServiceConnection,
    updatePreferences
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 