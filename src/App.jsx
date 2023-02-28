/**
 * DataSelector: 画像選択モード
 * ExparePrepare : 探索準備モード
 * COIAS : 探索/再描画
 * ManualMeasurement : 再測定モード
 * Report : レポートモード
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useMemo, useRef, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  ModeStatusContext,
  MousePositionContext,
  PageContext,
  StarPositionContext,
  PredictedStarPositionContext,
  UserIDContext,
} from './component/functional/context';
import Header from './component/ui/Header';
import COIAS from './page/COIAS';
import ExplorePrepare from './page/ExplorePrepare';
import ManualMeasurement from './page/ManualMeasurement';
import FinalCheck from './page/FinalCheck';
import Report from './page/Report';
import './style/style.scss';
import DataSelector from './page/DataSelector';

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [fileNames, setFileNames] = useState(['ファイルを選択してください']);
  const [fileObservedTimes, setFileObservedTimes] = useState([]);
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
      name: '解析スタート',
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

  const [predictedStarPos, setPredictedStarPos] = useState({});
  const predictedStarValue = useMemo(
    () => ({ predictedStarPos, setPredictedStarPos }),
    [predictedStarPos],
  );

  const [modeStatus, setModeStatus] = useState({
    ExplorePrepare: false,
    COIAS: false,
    Manual: false,
    Report: false,
    FinalCheck: false,
  });
  const modeStatusValue = useMemo(
    () => ({ modeStatus, setModeStatus }),
    [modeStatus],
  );

  const [userId, setUserId] = useState(0);
  const userIdValue = useMemo(() => ({ userId, setUserId }), [userId]);

  const [start, setStart] = useState(false);
  const [next, setNext] = useState(false);
  const [back, setBack] = useState(true);
  const [setting, setSetting] = useState(false);
  const [zoomIn, setZoomIn] = useState(false);
  const [zoomOut, setZoomOut] = useState(false);

  return (
    <BrowserRouter style={{ position: 'relative' }}>
      <UserIDContext.Provider value={userIdValue}>
        <ModeStatusContext.Provider value={modeStatusValue}>
          <Header
            setMenunames={setMenunames}
            setFileNames={setFileNames}
            setFileObservedTimes={setFileObservedTimes}
          />
          <main
            style={{
              position: 'absolute',
              top: 80,
              bottom: 0,
              left: 0,
              right: 0,
              overflow: 'auto',
              backgroundColor: '#F8F9FA',
            }}
          >
            <PageContext.Provider value={pageValue}>
              <MousePositionContext.Provider value={mouseValue}>
                <StarPositionContext.Provider value={starValue}>
                  <PredictedStarPositionContext.Provider
                    value={predictedStarValue}
                  >
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <DataSelector
                            setFileNames={setFileNames}
                            setFileObservedTimes={setFileObservedTimes}
                          />
                        }
                      />
                      <Route
                        path="/ExplorePrepare"
                        element={
                          <ExplorePrepare
                            fileNames={fileNames}
                            fileObservedTimes={fileObservedTimes}
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
                            zoomIn={zoomIn}
                            setZoomIn={setZoomIn}
                            zoomOut={zoomOut}
                            setZoomOut={setZoomOut}
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
                            zoomIn={zoomIn}
                            setZoomIn={setZoomIn}
                            zoomOut={zoomOut}
                            setZoomOut={setZoomOut}
                          />
                        }
                      />
                      <Route
                        path="/Report"
                        element={
                          <Report
                            setMenunames={setMenunames}
                            setFileNames={setFileNames}
                            setFileObservedTimes={setFileObservedTimes}
                          />
                        }
                      />
                      <Route
                        path="/FinalCheck"
                        element={
                          <FinalCheck
                            intervalRef={intervalRef}
                            imageURLs={imageURLs}
                            setImageURLs={setImageURLs}
                            start={start}
                            setStart={setStart}
                            next={next}
                            setNext={setNext}
                            back={back}
                            setBack={setBack}
                            setting={setting}
                            setSetting={setSetting}
                            zoomIn={zoomIn}
                            setZoomIn={setZoomIn}
                            zoomOut={zoomOut}
                            setZoomOut={setZoomOut}
                          />
                        }
                      />
                    </Routes>
                  </PredictedStarPositionContext.Provider>
                </StarPositionContext.Provider>
              </MousePositionContext.Provider>
            </PageContext.Provider>
          </main>
          <footer>
            <div style={{ display: 'none' }}>footer</div>
          </footer>
        </ModeStatusContext.Provider>
      </UserIDContext.Provider>
    </BrowserRouter>
  );
}

export default App;
