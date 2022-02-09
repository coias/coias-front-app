import React from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import Top from './page/Top';
import ImageEdit from './component/imageEdit';
import PageBar from './component/PageBar';
import COIAS from './page/COIAS';
import './style/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserHistory } from "history";

function App() {
  return (
      <BrowserRouter>
        <PageBar />
          <Route exact path="/" component={Top} />
          <Route path="/COIAS" component={COIAS} />
      </BrowserRouter>
  );
};

export default App;
