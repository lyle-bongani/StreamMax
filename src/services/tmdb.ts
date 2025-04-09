const TMDB_API_KEY = '54252ee38b0dfa1a940c190458d2041b';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  runtime: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface StreamingService {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  runtime: number;
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
    const providers = data.results?.US?.flatrate || [];
    return providers.map((provider: any) => ({
      provider_id: provider.provider_id,
      provider_name: provider.provider_name,
      logo_path: provider.logo_path,
      display_priority: provider.display_priority || 0
    }));
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
  },

  searchMovies: async (query: string): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results;
  },

  getBaseUrl: () => 'https://api.themoviedb.org/3',
  getApiKey: () => '54252ee38b0dfa1a940c190458d2041b',

  getPopularTVShows: async (): Promise<TVShow[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results;
  },

  getTopRatedTVShows: async (): Promise<TVShow[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results;
  },

  getOnAirTVShows: async (): Promise<TVShow[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results;
  },

  getTVShowDetails: async (showId: number): Promise<TVShow> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${showId}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    return response.json();
  },

  getTVShowProviders: async (showId: number): Promise<StreamingService[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${showId}/watch/providers?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    const providers = data.results?.US?.flatrate || [];
    return providers.map((provider: any) => ({
      provider_id: provider.provider_id,
      provider_name: provider.provider_name,
      logo_path: provider.logo_path,
      display_priority: provider.display_priority || 0
    }));
  },

  getSimilarTVShows: async (showId: number): Promise<TVShow[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${showId}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results;
  },
}; 