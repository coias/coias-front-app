import React from "react";
import { withRouter } from "react-router-dom";
import COIAS from "./COIAS";

export const Explore = () => {
  const menunames = [
    { id: 1, name: "Blink" },
    { id: 2, name: "Back" },
    { id: 3, name: "Next" },
    { id: 4, name: "Mark" },
    { id: 5, name: "リスト" },
    { id: 6, name: "Image" },
    { id: 7, name: "(X,Y)" },
    { id: 8, name: "再描画" },
  ];

  return (
    <div>
      <COIAS />
    </div>
  );
};

export default withRouter(Explore);
