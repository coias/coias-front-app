/**
 * ExparePrepare : 探索準備モード
 * COIAS : 探索/再描画
 * ManualMeasurement : 再測定モード
 * Report : レポートモード
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useMemo, useRef, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  MousePositionContext,
  PageContext,
  StarPositionContext,
  ModeStatusContext,
} from './component/context';
import Header from './component/Header';
import COIAS from './page/COIAS';
import ExplorePrepare from './page/ExplorePrepare';
import ManualMeasurement from './page/ManualMeasurement';
import Report from './page/Report';
import './style/style.scss';

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [fileNames, setFileNames] = useState(['Please input files']);
  const intervalRef = useRef(null);
  const [isAuto, setIsAuto] = useState(true);
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
    {
      id: 7,
      name: '全自動処理 (2×2)',
      query: 'AstsearchR?binning=',
      done: false,
    },
  ]);

  const [imageURLs, setImageURLs] = useState([]);
  const [subImageURLs, setSubImageURLs] = useState([]);
  const [originalStarPos, setOriginalStarPos] = useState({});
  const [leadStarNumber, setLeadStarNumber] = useState(0);
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

  const [modeStatus, setModeStatus] = useState({
    COIAS: false,
    Manual: false,
    Report: false,
  });
  const modeStatusValue = useMemo(
    () => ({ modeStatus, setModeStatus }),
    [modeStatus],
  );

  const [start, setStart] = useState(false);
  const [next, setNext] = useState(false);
  const [back, setBack] = useState(true);
  const [setting, setSetting] = useState(false);

  return (
    <BrowserRouter style={{ position: 'relative' }}>
      <ModeStatusContext.Provider value={modeStatusValue}>
        <Header setMenunames={setMenunames} />
        <main
          style={{
            position: 'absolute',
            top: 80,
            bottom: 0,
            left: 0,
            right: 0,
            overflow: 'hidden',
            backgroundColor: '#F8F9FA',
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
                        isAuto={isAuto}
                        setIsAuto={setIsAuto}
                      />
                    }
                  />
                  <Route
                    path="/COIAS"
                    element={
                      <COIAS
                        intervalRef={intervalRef}
                        imageURLs={imageURLs}
                        setImageURLs={setImageURLs}
                        subImageURLs={subImageURLs}
                        setSubImageURLs={setSubImageURLs}
                        originalStarPos={originalStarPos}
                        setOriginalStarPos={setOriginalStarPos}
                        start={start}
                        setStart={setStart}
                        next={next}
                        setNext={setNext}
                        back={back}
                        setBack={setBack}
                        setting={setting}
                        setSetting={setSetting}
                      />
                    }
                  />
                  <Route
                    path="/ManualMeasurement"
                    element={
                      <ManualMeasurement
                        intervalRef={intervalRef}
                        imageURLs={imageURLs}
                        setImageURLs={setImageURLs}
                        originalStarPos={originalStarPos}
                        setOriginalStarPos={setOriginalStarPos}
                        start={start}
                        setStart={setStart}
                        next={next}
                        setNext={setNext}
                        back={back}
                        setBack={setBack}
                        leadStarNumber={leadStarNumber}
                        setLeadStarNumber={setLeadStarNumber}
                        setting={setting}
                        setSetting={setSetting}
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
      </ModeStatusContext.Provider>
    </BrowserRouter>
  );
}

export default App;
