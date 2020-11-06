import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Header from './Header';
import ExcelFileUpload from './ExcelFileUpload';

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
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
