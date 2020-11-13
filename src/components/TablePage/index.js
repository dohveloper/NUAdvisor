import React, { useReducer } from 'react';
import Toolbar from './Toolbar';
import Table from './Table';
import './Table.css';
import { COLUMNS } from './columns';

const dataToStudentRow = () => {};
function TablePage() {
  return (
    <div className="table__page">
      <Toolbar />
      <Table columns={COLUMNS} data={[]} />
    </div>
  );
}

export default TablePage;
