import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ExplorePrepare from './page/ExplorePrepare';
import './style/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import ManualMeasurement from './page/ManualMeasurement';
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
  const [fileNames, setFileNames] = useState(['Please input files']);
  const [menunames, setMenunames] = useState([
    { id: 1, name: 'ファイル', query: '', done: false },
    { id: 2, name: '事前処理', query: 'preprocess', done: false },
    {
      id: 3,
      name: 'ビニングマスク',
      query: 'startsearch2R?binning=',
      done: false,
    },
    {
      id: 4,
      name: '軌道取得（確定番号）',
      query: 'prempsearchC-before',
      done: false,
    },
    {
      id: 5,
      name: '軌道取得（仮符号）',
      query: 'prempsearchC-after',
      done: false,
    },
    { id: 6, name: '自動検出', query: 'astsearch_new', done: false },
    { id: 7, name: '全自動処理', query: 'AstsearchR?binning=', done: false },
  ]);

  const [imageURLs, setImageURLs] = useState([]);
  const [originalStarPos, setOriginalStarPos] = useState({});
  const pageValue = useMemo(
    () => ({ currentPage, setCurrentPage }),
    [currentPage],
  );

  const [currentMousePos, setCurrentMousePos] = useState({ x: 0, y: 0 });
  const mouseValue = useMemo(
    () => ({ currentMousePos, setCurrentMousePos }),
    [currentMousePos],
  );

  const [starPos, setStarPos] = useState({});
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
                <Route
                  path="/"
                  element={
                    <ExplorePrepare
                      fileNames={fileNames}
                      setFileNames={setFileNames}
                      menunames={menunames}
                      setMenunames={setMenunames}
                    />
                  }
                />
                <Route
                  path="/COIAS"
                  element={
                    <COIAS
                      imageURLs={imageURLs}
                      setImageURLs={setImageURLs}
                      originalStarPos={originalStarPos}
                      setOriginalStarPos={setOriginalStarPos}
                    />
                  }
                />
                <Route
                  path="/ManualMeasurement"
                  element={
                    <ManualMeasurement
                      imageURLs={imageURLs}
                      setImageURLs={setImageURLs}
                      originalStarPos={originalStarPos}
                      setOriginalStarPos={setOriginalStarPos}
                    />
                  }
                />
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
