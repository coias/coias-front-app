import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createBrowserHistory } from "history";
import { BrowserRouter as Router } from "react-router-dom";


ReactDOM.render(
  <React.StrictMode>
    <Router history={window.history}>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

export default createBrowserHistory();
