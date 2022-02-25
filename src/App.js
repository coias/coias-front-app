import React, { createContext, useState, useMemo } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import COIAS from "./page/COIAS";
import Explore_prepare from "./page/Explore_prepare";
import MenuBar from "./component/MenuBar";
import "./style/style.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Explore from "./page/Explore";
import Report from "./page/Report";
import PanZoom from "./component/PanZoom";

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
    [currentPage]
  );

  const [currentMousePos, setCurrentMousePos] = useState({ x: 0, y: 0 });
  const mouseValue = useMemo(
    () => ({ currentMousePos, setCurrentMousePos }),
    [currentMousePos]
  );

  return (
    <BrowserRouter>
      <MenuBar />
      <PageContext.Provider value={pageValue}>
        <MousePositionContext.Provider value={mouseValue}>
          <Route path="/COIAS" component={COIAS} />
          <Route path="/Explore_prepare" component={Explore_prepare} />
          <Route path="/Explore" component={Explore} />
          <Route path="/Report" component={Report} />
          <PanZoom />
        </MousePositionContext.Provider>
      </PageContext.Provider>
    </BrowserRouter>
  );
}

export default App;
