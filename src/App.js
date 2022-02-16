import React from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import Top from './page/Top';
import COIAS from './page/COIAS';
import Explore_prepare from './page/Explore_prepare';
import MenuBar from './component/MenuBar'
import './style/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Explore from './page/Explore';
import Report from './page/Report';

function App() {
  return (
      <BrowserRouter>
        <MenuBar />
          <Route exact path="/" component={Top} />
          <Route path="/COIAS" component={COIAS} />
          <Route path="/Explore_prepare" component={Explore_prepare} />
          <Route path="/Explore" component={Explore} />
          <Route path="/Report" component={Report} />
      </BrowserRouter>
  );
};

export default App;
