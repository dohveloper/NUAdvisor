import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TablePage from '../TablePage';
import Header from '../Header';
import ExcelFileUpload from '../ExcelFileUploadPage';
export const DataContext = React.createContext();

function App() {
  const [data, setData] = useState(null);
  const updateData = value => {
    setData(value);
  };
  const contextValue = { data, updateData };
  return (
    <div className="app">
      <DataContext.Provider value={contextValue}>
        <Router>
          <Switch>
            <Route exact path="/">
              <ExcelFileUpload />
            </Route>
            <Route exact path="/students">
              <Header />
              <TablePage />
            </Route>
          </Switch>
        </Router>
      </DataContext.Provider>
    </div>
  );
}

export default App;
