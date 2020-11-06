import React from 'react';
import Toolbar from './Toolbar';
import Table from './Table';
import './Table.css';

function TablePage() {
  return (
    <div className="table__page">
      <Toolbar />
      <Table />
    </div>
  );
}

export default TablePage;
