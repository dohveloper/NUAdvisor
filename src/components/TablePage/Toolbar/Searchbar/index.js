import React from 'react';
import './Searchbar.css';
import { MdSearch } from 'react-icons/md';

function Searchbar({ filter, setFilter }) {
  return (
    <div className="searchbar">
      <MdSearch className="searchbar__icon" />
      <input className="searchbar__input" value={filter || ''} onChange={e => setFilter(e.target.value)} type="text" placeholder="NUID, Student Name ..." />
    </div>
  );
}

export default Searchbar;
