import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ExplorePrepare from './page/ExplorePrepare';
import './style/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Report from './page/Report';
import Header from './component/Header';
import COIAS from './page/COIAS';
import {
  PageContext,
  MousePositionContext,
  StarPositionContext,
} from './component/context';

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

  const [starPos, setStarPos] = useState([]);
  const starValue = useMemo(() => ({ starPos, setStarPos }), [starPos]);
  return (
    <BrowserRouter style={{ position: 'relative' }}>
      <Header />
      <main
        style={{
          position: 'absolute',
          top: 86,
          bottom: 0,
          left: 0,
          right: 0,
          overflow: 'scroll',
        }}
      >
        <PageContext.Provider value={pageValue}>
          <MousePositionContext.Provider value={mouseValue}>
            <StarPositionContext.Provider value={starValue}>
              <Routes>
                <Route path="/" element={<ExplorePrepare />} />
                <Route path="/COIAS" element={<COIAS />} />
                <Route path="/Report" element={<Report />} />
              </Routes>
            </StarPositionContext.Provider>
          </MousePositionContext.Provider>
        </PageContext.Provider>
      </main>
      <footer>
        <div style={{ display: 'none' }}>footer</div>
      </footer>
    </BrowserRouter>
  );
}

export default App;
