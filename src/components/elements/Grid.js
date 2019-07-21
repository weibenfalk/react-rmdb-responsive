import React from 'react';
import PropTypes from 'prop-types';

import { StyledGrid, StyledGridContent } from '../styles/StyledGrid';

const Grid = ({ header, children }) => (
  <StyledGrid>
    <h1>{header}</h1>
    <StyledGridContent>
      {children.map((element, i) => (
        <div key={i} className="grid-element">
          {element}
        </div>
      ))}
    </StyledGridContent>
  </StyledGrid>
);

Grid.propTypes = {
  header: PropTypes.string,
};

export default Grid;
