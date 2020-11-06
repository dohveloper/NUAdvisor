import React from 'react';
import './Searchbar.css';
import { MdSearch } from 'react-icons/md';

function Searchbar(props) {
  return (
    <div className="searchbar">
      <MdSearch className="searchbar__icon" />
      <input className="searchbar__input" type="text" placeholder="NUID, Student Name ..." />
    </div>
  );
}

export default Searchbar;
