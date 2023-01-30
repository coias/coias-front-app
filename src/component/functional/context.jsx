import { createContext } from 'react';

export const PageContext = createContext({
  currentPage: 0,
  setCurrentPage: () => {},
});

export const MousePositionContext = createContext({
  currentMousePos: { x: 0, y: 0 },
  setCurrentMousePos: () => {},
});

export const StarPositionContext = createContext({
  starPos: {},
  setStarPos: () => {},
});

export const PredictedStarPositionContext = createContext({
  predictedStarPos: {},
  setPredictedStarPos: () => {},
});

export const ModeStatusContext = createContext({
  modeStatus: {
    ExplorePrepare: false,
    COIAS: false,
    Manual: false,
    Report: false,
    FinalCheck: false,
  },
  setModeStatus: () => {},
});
