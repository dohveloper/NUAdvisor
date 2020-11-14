import React, { useContext } from 'react';
import { DataContext } from '../App';
import Toolbar from './Toolbar';
import Table from './Table';
import './Table.css';
import { COLUMNS } from './columns';
import { getClassCombinationsByStudentId } from '../nuadvisor';

const dataToStudentRow = () => {};
function TablePage() {
  const { data } = useContext(DataContext);
  return (
    <div className="table__page">
      <Toolbar />
      <Table columns={COLUMNS} data={[]} />
      {console.log('table data', data)}
    </div>
  );
}

export default TablePage;
