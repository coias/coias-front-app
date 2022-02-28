import React, {
  useCallback,
  useContext,
  useRef
} from "react";
import { Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { MousePositionContext, PageContext } from "../App";

const COIAS = () => {
  const { currentMousePos, setCurrentMousePos } =
    useContext(MousePositionContext);
  const { currentPage, setCurrentPage } = useContext(PageContext);

  const menunames = [
    { id: 1, name: "Blink" },
    { id: 2, name: "Back" },
    { id: 3, name: "Next" },
    { id: 4, name: "Stop" },
    { id: 5, name: "Image" },
    { id: 6, name: "(X,Y)" },
    { id: 7, name: "Close Window" },
  ];

  const onClickNext = () => {
    if (currentPage === 4) setCurrentPage(0);
    else setCurrentPage(currentPage + 1);
  };

  const onClickBack = () => {
    if (currentPage === 0) setCurrentPage(4);
    else setCurrentPage(currentPage - 1);
  };

  const intervalRef = useRef(null);

  const onClickBlinkStart = useCallback(() => {
    if (intervalRef.current !== null) {
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentPage((c) => {
        if (c === 4) return 0;
        else return c + 1;
      });
    }, 100);
  }, []);

  const onClickBlinkStop = useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  return (
    <ul className="coias-ul">
      {menunames.map((item) => {
        if (item.id === 1) {
          return (
            <li key={item.id} style={{ width: "auto" }} className="coias-li">
              <Button
                onClick={() => {
                  onClickBlinkStart();
                }}
                variant="success"
              >
                {item.name}
              </Button>
            </li>
          );
        } else if (item.id === 2) {
          return (
            <li key={item.id} style={{ width: "auto" }} className="coias-li">
              <Button
                onClick={() => {
                  onClickBack();
                }}
                variant="success"
              >
                {item.name}
              </Button>
            </li>
          );
        } else if (item.id === 3) {
          return (
            <li key={item.id} style={{ width: "auto" }} className="coias-li">
              <Button
                onClick={() => {
                  onClickNext();
                }}
                variant="success"
              >
                {item.name}
              </Button>
            </li>
          );
        } else if (item.id === 4) {
          return (
            <li key={item.id} style={{ width: "auto" }} className="coias-li">
              <Button
                onClick={() => {
                  onClickBlinkStop();
                }}
                variant="success"
              >
                {item.name}
              </Button>
            </li>
          );
        } else if (item.id === 5) {
          return (
            <li key={item.id}>
              <input
                type="text"
                placeholder={"No." + String(currentPage + 1)}
                size="10"
                disabled="disabled"
              />
            </li>
          );
        } else if (item.id === 6) {
          return (
            <li key={item.id}>
              <input
                type="text"
                placeholder={currentMousePos.x + "," + currentMousePos.y}
                size="10"
                disabled="disabled"
              />
            </li>
          );
        } else {
          return (
            <li key={item.id} style={{ width: "auto" }} className="coias-li">
              <Button variant="success">{item.name}</Button>
            </li>
          );
        }
      })}
    </ul>
  );
};

export default withRouter(COIAS);
