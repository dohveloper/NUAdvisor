import React from 'react';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import './Filter.css';
function Filter() {
  return (
    <div>
      <div className="filter__button">
        <span className="filter__buttonText">Filter</span>
        <TiArrowSortedDown className="filter__arrow filter__arrow--down" />
      </div>
    </div>
  );
}

export default Filter;
