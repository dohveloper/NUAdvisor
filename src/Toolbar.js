import React from 'react';
import './Toolbar.css';
import Searchbar from './Searchbar';
import Filter from './Filter';

function Toolbar() {
  return (
    <div className="toolbar">
      <h2>Students</h2>
      <Filter />
      <Filter />
      <Filter />
      <Searchbar />
    </div>
  );
}

export default Toolbar;
