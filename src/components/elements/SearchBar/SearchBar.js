import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './SearchBar.css';

class SearchBar extends Component {
  state = {
    value: '',
  };

  // Must have this here so we can reset it
  timeout = null;

  doSearch = event => {
    // Has to do this because of event pooling
    // const { value } = event.target;
    // const { callback } = this.props;

    // clearTimeout(this.timeout);

    this.setState({ value: event.target.value });

    // this.timeout = setTimeout( () => {
    //   // Cannot use event.target.value here because of React event pooling
    //   callback(value);
    // }, 500);
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.value !== prevState.value) {
      const { callback } = this.props;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        callback(this.state.value);
      }, 500);
    }
  }

  render() {
    // ES6 Destructuring state
    const { value } = this.state;

    return (
      <div className="rmdb-searchbar">
        <div className="rmdb-searchbar-content">
          <FontAwesome className="rmdb-fa-search" name="search" size="2x" />
          <input
            type="text"
            className="rmdb-searchbar-input"
            placeholder="Search"
            onChange={this.doSearch}
            value={value}
          />
        </div>
      </div>
    );
  }
}

SearchBar.propTypes = {
  callback: PropTypes.func,
};

export default SearchBar;
