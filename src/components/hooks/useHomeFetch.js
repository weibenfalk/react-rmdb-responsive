import { useState, useEffect } from 'react';
import { API_URL, API_KEY } from '../../config';

export const useHomeFetch = () => {
  const [state, setState] = useState({ movies: [], searchTerm: '' });
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);

  const fetchMovies = async endpoint => {
    seterror(false);
    setloading(true);
    // We can use URLSearchParams to get URL params. Very handy!
    const params = new URLSearchParams(endpoint);
    const pageParam = params.get('page');
    const searchParam = params.get('query');
    console.log(endpoint)
    try {
      const result = await (await fetch(endpoint)).json();
      setState(prev => ({
        ...prev,
        movies: pageParam
          ? [...prev.movies, ...result.results]
          : [...result.results],
        heroImage: prev.heroImage || result.results[0],
        currentPage: result.page,
        totalPages: result.total_pages,
        searchTerm: searchParam,
      }));
    } catch (error) {
      seterror(true);
    }
    setloading(false);
  };

  // Run once on mount
  useEffect(() => {
    if (sessionStorage.homeState) {
      setState(JSON.parse(sessionStorage.homeState));
    } else {
      fetchMovies(`${API_URL}movie/popular?api_key=${API_KEY}`);
    }
  }, []);

  // Remember state for the next mount if we're not i a search view
  useEffect(() => {
    if (!state.searchTerm) {
      sessionStorage.setItem('homeState', JSON.stringify(state));
    }
  }, [state]);

  return [{ state, loading, error }, fetchMovies];
};
