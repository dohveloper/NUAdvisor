import React from 'react';
import Toolbar from './Toolbar';
import Table from './Table';
import ExcelFileUpload from './ExcelFileUpload';

function Home() {
  return (
    <div className="home">
      <Toolbar />
      <Table />
      <ExcelFileUpload />
    </div>
  );
}

export default Home;
