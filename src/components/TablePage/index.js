import React from 'react';
import Toolbar from './Toolbar';
import Table from './Table';
import './Table.css';
import { COLUMNS } from './columns';
//import { data } from './data.json';

const dataToStudentRow = () => {
  /* purpose: Excel data should be already converted and stored in data.json file.
  You can  
  
  */
};
function TablePage() {
  return (
    <div className="table__page">
      <Toolbar />
      <Table columns={COLUMNS} data={[]} />
    </div>
  );
}

export default TablePage;
