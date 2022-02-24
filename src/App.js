import React, { createContext, useState, useMemo } from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import Top from './page/Top';
import COIAS from './page/COIAS';
import Explore_prepare from './page/Explore_prepare';
import MenuBar from './component/MenuBar'
import './style/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Explore from './page/Explore';
import Report from './page/Report';
import Canvas from './component/ImageEditNew';

export const PageContext = createContext({
  currentPage : 0,
  setCurrentPage: () => {},
});

function App() {
	const [currentPage, setCurrentPage] = useState(0);
  const value = useMemo(
    () => ({ currentPage, setCurrentPage }),
    [currentPage]
  );

  return (
      <BrowserRouter>
        <MenuBar />
        <PageContext.Provider value={value}>
          <Route path="/COIAS" component={COIAS} />
          <Route path="/Explore_prepare" component={Explore_prepare} />
          <Route path="/Explore" component={Explore} />
          <Route path="/Report" component={Report} />
          <Canvas canvasWidth={1050} canvasHeight={1050}/>
        </PageContext.Provider>

      </BrowserRouter>
  );
};

export default App;
