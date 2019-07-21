import React from 'react';
import Navigation from './elements/Navigation';
import MovieInfo from './elements/MovieInfo';
import MovieInfoBar from './elements/MovieInfoBar';
import Grid from './elements/Grid';
import Actor from './elements/Actor';
import Spinner from './elements/Spinner';

import { useMovieFetch } from './hooks/useMovieFetch';

const Movie = ({ movieId }) => {
  const [movie, loading, error] = useMovieFetch(movieId);

  return (
    <>
      {movie.original_title && (
        <>
          <Navigation movie={movie.original_title} />
          {movie.directors && (
            <MovieInfo movie={movie} directors={movie.directors} />
          )}
          <MovieInfoBar
            time={movie.runtime}
            budget={movie.budget}
            revenue={movie.revenue}
          />
        </>
      )}
      {movie.actors && (
        <Grid header="Actors">
          {movie.actors.map((element, i) => (
            <Actor key={i} actor={element} />
          ))}
        </Grid>
      )}
      {error ? <h1>No movie found</h1> : null}
      {loading && <Spinner />}
    </>
  );
};

export default Movie;
