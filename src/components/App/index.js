import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TablePage from '../TablePage';
import Header from '../Header';
import ExcelFileUpload from '../ExcelFileUploadPage';

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/file">
            <ExcelFileUpload />
          </Route>
          <Route exact path="/">
            <Header />
            <TablePage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
