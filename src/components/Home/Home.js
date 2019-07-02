import React, { useState, useEffect } from 'react';
import {
  IMAGE_BASE_URL,
  POSTER_SIZE,
  BACKDROP_SIZE,
  API_URL,
  API_KEY,
} from '../../config';
import HeroImage from '../elements/HeroImage/HeroImage';
import SearchBar from '../elements/SearchBar/SearchBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import MovieThumb from '../elements/MovieThumb/MovieThumb';
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn';
import Spinner from '../elements/Spinner/Spinner';
import './Home.css';

import { useFetchMovies } from './customHooks';

const Home = () => {
  // const [{ state, isLoading }, fetchMovies] = useFetchMovies();
  const [state, setState] = useState({ movies: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchMovies = async endpoint => {
    setIsError(false);
    setIsLoading(true);

    // We can use URLSearchParams to get URL params. Very handy!
    // endpoint: `${API_URL}search/movie?api_key=${API_KEY}&query=${searchTerm}&page=${currentPage + 1}`;
    const params = new URLSearchParams(endpoint);
    if (!params.get('page')) {
      setState(prev => ({
        ...prev,
        movies: [],
        searchTerm: params.get('query'),
      }));
    }

    try {
      const result = await (await fetch(endpoint)).json();
      setState(prev => ({
        ...prev,
        movies: [...prev.movies, ...result.results],
        heroImage: prev.heroImage || result.results[0],
        currentPage: result.page,
        totalPages: result.total_pages,
      }));
    } catch (error) {
      setIsError(true);
    }

    setIsLoading(false);
  };

  // Run one time on mount and check if we have the movies in sessionStorage
  useEffect(() => {
    if (sessionStorage.getItem('HomeState')) {
      const persistedState = JSON.parse(sessionStorage.getItem('HomeState'));
      setState({ ...persistedState });
    } else {
      fetchMovies(`${API_URL}movie/popular?api_key=${API_KEY}`);
    }
  }, []);

  // Remember state for the next mount if we´re not in a search view
  useEffect(() => {
    if (!state.searchTerm) {
      sessionStorage.setItem('HomeState', JSON.stringify(state));
    }
  }, [state]);

  const searchItems = searchTerm => {
    let endpoint = `${API_URL}search/movie?api_key=${API_KEY}&query=${searchTerm}`;
    if (!searchTerm) {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}`;
    }
    fetchMovies(endpoint);
  };

  const loadMoreItems = () => {
    const { searchTerm, currentPage } = state;
    let endpoint = `${API_URL}search/movie?api_key=${API_KEY}&query=${searchTerm}&page=${currentPage +
      1}`;
    if (!searchTerm) {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&page=${currentPage +
        1}`;
    }
    fetchMovies(endpoint);
  };

  return (
    <div className="rmdb-home">
      {state.heroImage && !state.searchTerm ? (
        <div>
          <HeroImage
            image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${state.heroImage.backdrop_path}`}
            title={state.heroImage.original_title}
            text={state.heroImage.overview}
          />
        </div>
      ) : null}
      <SearchBar callback={searchItems} />
      <div className="rmdb-home-grid">
        <FourColGrid
          header={state.searchTerm ? 'Search Result' : 'Popular Movies'}
          loading={isLoading}
        >
          {state.movies.map((element, i) => (
            <MovieThumb
              key={i}
              clickable
              image={
                element.poster_path
                  ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}`
                  : './images/no_image.jpg'
              }
              movieId={element.id}
              movieName={element.original_title}
            />
          ))}
        </FourColGrid>
        {isLoading ? <Spinner /> : null}
        {state.currentPage <= state.totalPages && !isLoading ? (
          <LoadMoreBtn text="Load More" onClick={loadMoreItems} />
        ) : null}
      </div>
    </div>
  );
};

export default Home;
