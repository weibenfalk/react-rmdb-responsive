import React from 'react';
import { Router } from '@reach/router';
import Header from './elements/Header';
import Home from './Home';
import Movie from './Movie';
import NotFound from './elements/NotFound';

const App = () => (
  <>
    <Header />
    <Router>
      <Home path="/" />
      <Movie path="/:movieId" />
      <NotFound default />
    </Router>
  </>
);

export default App;
