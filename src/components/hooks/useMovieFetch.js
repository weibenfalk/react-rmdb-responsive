import { useState, useEffect, useCallback } from 'react';
import { API_URL, API_KEY } from '../../config';

export const useMovieFetch = movieId => {
  const [state, setState] = useState({});
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);

  const fetchData = useCallback(async () => {
    seterror(false);
    setloading(true);

    try {
      const endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
      const result = await (await fetch(endpoint)).json();
      if (result.status_code) {
        seterror(true);
      } else {
        const creditsEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
        const creditsResult = await (await fetch(creditsEndpoint)).json();
        const directors = creditsResult.crew.filter(
          member => member.job === 'Director'
        );
        setState({
          ...result,
          actors: creditsResult.cast,
          directors,
        });
      }
    } catch (error) {
      seterror(true);
    }
    setloading(false);
  }, [movieId]);

  useEffect(() => {
    if (localStorage.movieId) {
      setState(JSON.parse(localStorage.movieId));
    } else {
      fetchData();
    }
  }, [fetchData]);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(`${movieId}`, JSON.stringify(state));
  }, [movieId, state]);

  return [state, loading, error];
};
