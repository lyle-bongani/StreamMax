const TMDB_API_KEY = 'YOUR_TMDB_API_KEY'; // Replace with your actual API key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  release_date: string;
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface StreamingService {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export const tmdbService = {
  // Get trending movies
  getTrendingMovies: async (): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.results;
  },

  // Get movie details
  getMovieDetails: async (movieId: number): Promise<Movie> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
    );
    return response.json();
  },

  // Get movie streaming providers
  getMovieProviders: async (movieId: number): Promise<StreamingService[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return Object.values(data.results.US?.flatrate || {});
  },

  // Get genres
  getGenres: async (): Promise<Genre[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.genres;
  },

  // Get image URL
  getImageUrl: (path: string, size: 'w500' | 'original' = 'w500'): string => {
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },

  // Get streaming providers
  getStreamingProviders: async (): Promise<StreamingService[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/watch/providers/movie?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.results;
  }
}; 