import React, { createContext, useState, useMemo } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import ExplorePrepare from './page/ExplorePrepare';
import './style/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Report from './page/Report';
import Header from './component/Header';
import COIAS from './page/COIAS';

export const PageContext = createContext({
  currentPage: 0,
  setCurrentPage: () => {},
});

export const MousePositionContext = createContext({
  currentMousePos: { x: 0, y: 0 },
  setCurrentMousePos: () => {},
});

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageValue = useMemo(
    () => ({ currentPage, setCurrentPage }),
    [currentPage],
  );

  const [currentMousePos, setCurrentMousePos] = useState({ x: 0, y: 0 });
  const mouseValue = useMemo(
    () => ({ currentMousePos, setCurrentMousePos }),
    [currentMousePos],
  );

  return (
    <BrowserRouter>
      <Header />
      <PageContext.Provider value={pageValue}>
        <MousePositionContext.Provider value={mouseValue}>
          <Route path="/COIAS" component={COIAS} />
          <Route path="/ExplorePrepare" component={ExplorePrepare} />
          <Route path="/Report" component={Report} />
        </MousePositionContext.Provider>
      </PageContext.Provider>
    </BrowserRouter>
  );
}

export default App;
