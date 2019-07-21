import React from 'react';
import PropTypes from 'prop-types';

import { StyledLoadMoreBtn } from '../styles/StyledLoadMoreBtn';

const LoadMoreBtn = ({ text, onClick }) => (
  <StyledLoadMoreBtn type="button" onClick={onClick}>
    {text}
  </StyledLoadMoreBtn>
);

LoadMoreBtn.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
};

export default LoadMoreBtn;
