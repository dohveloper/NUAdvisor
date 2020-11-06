import React from 'react';
import './Toolbar.css';
import Searchbar from '../Searchbar';
import Filter from '../Filter';

function Toolbar() {
  return (
    <div className="toolbar">
      <div className="toolbar__left">
        <h2 className="toolbar__header">Students</h2>
        <Filter />
        <Filter />
        <Filter />
      </div>
      <div className="toolbar__right">
        <Searchbar />
      </div>
    </div>
  );
}

export default Toolbar;
