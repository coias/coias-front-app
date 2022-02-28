import React from "react";
import { withRouter } from "react-router-dom";
import COIAS from "./COIAS";

export const Explore = () => {

  return (
    <div>
      <COIAS />
    </div>
  );
};

export default withRouter(Explore);
