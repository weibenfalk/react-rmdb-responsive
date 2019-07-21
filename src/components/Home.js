import React from 'react';
import {
  API_URL,
  API_KEY,
  IMAGE_BASE_URL,
  POSTER_SIZE,
  BACKDROP_SIZE,
} from '../config';
import HeroImage from './elements/HeroImage';
import SearchBar from './elements/SearchBar';
import Grid from './elements/Grid';
import MovieThumb from './elements/MovieThumb';
import LoadMoreBtn from './elements/LoadMoreBtn';
import Spinner from './elements/Spinner';

import { useHomeFetch } from './hooks/useHomeFetch';

const Home = () => {
  console.log('rerender');
  const [{ state, loading }, fetchData] = useHomeFetch();

  const searchMovies = search => {
    const endpoint = `${API_URL}${search && 'search/'}movie${
      search ? '' : '/popular'
    }?api_key=${API_KEY}&query=${search}`;

    fetchData(endpoint);
  };

  const loadMoreMovies = () => {
    const endpoint = `${API_URL}${state.searchTerm && 'search/'}movie${
      state.searchTerm ? '' : '/popular'
    }?api_key=${API_KEY}&query=${state.searchTerm}&page=${state.currentPage +
      1}`;

    fetchData(endpoint);
  };

  return (
    <>
      {state.heroImage && !state.searchTerm ? (
        <HeroImage
          image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${state.heroImage.backdrop_path}`}
          title={state.heroImage.original_title}
          text={state.heroImage.overview}
        />
      ) : null}
      <SearchBar callback={searchMovies} />
      {state.heroImage && (
        <Grid header={state.searchTerm ? 'Search Result' : 'Popular Movies'}>
          {state.movies.map(element => (
            <MovieThumb
              key={element.id}
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
        </Grid>
      )}
      {loading && <Spinner />}
      {state.currentPage <= state.totalPages && !loading && (
        <LoadMoreBtn text="Load More" onClick={loadMoreMovies} />
      )}
    </>
  );
};

export default Home;
