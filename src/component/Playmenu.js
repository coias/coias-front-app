import { Navbar, Nav, Container , Tabs, Tab, Row, Col, Button, ButtonGroup} from "react-bootstrap";
import {
  FaPlay,
  FaStop,
  FaSlash,
  FaStepForward,
  FaStepBackward,
} from "react-icons/fa";
import React, { useCallback, useContext, useRef } from "react";
import { MousePositionContext, PageContext } from "../App";

const PlayMenu = () => {
  const { currentMousePos, setCurrentMousePos } =
    useContext(MousePositionContext);
  const { currentPage, setCurrentPage } = useContext(PageContext);

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
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Col md={3}>
          <Nav>
            <Nav.Item>
              <p>再生速度:0.1sec</p>
            </Nav.Item>
            <Nav.Item>
              <FaPlay
                onClick={() => {
                  onClickBlinkStart();
                }}
                size={30}
              />
            </Nav.Item>
            <Nav.Item>
              <FaSlash size={30} />
            </Nav.Item>
            <Nav.Item>
              <FaStop
                onClick={() => {
                  onClickBlinkStop();
                }}
                size={30}
              />
            </Nav.Item>
            <Nav.Item>
              <FaStepBackward
                onClick={() => {
                  onClickNext();
                }}
                size={30}
              />
            </Nav.Item>
            <Nav.Item>
              <FaStepForward
                onClick={() => {
                  onClickBack();
                }}
                size={30}
              />
            </Nav.Item>
          </Nav>
        </Col>
        <Col md={9}>
          <ButtonGroup aria-label="Basic example">
            <Button
              variant="light"
              onClick={() => {
                setCurrentPage(0);
              }}
            >
              1_disp-coias_nonmask
            </Button>
            <Button
              variant="light"
              onClick={() => {
                setCurrentPage(1);
              }}
            >
              2_disp-coias_nonmask
            </Button>
            <Button
              variant="light"
              onClick={() => {
                setCurrentPage(2);
              }}
            >
              3_disp-coias_nonmask
            </Button>
            <Button
              variant="light"
              onClick={() => {
                setCurrentPage(3);
              }}
            >
              4_disp-coias_nonmask
            </Button>
            <Button
              variant="light"
              onClick={() => {
                setCurrentPage(4);
              }}
            >
              5_disp-coias_nonmask
            </Button>
          </ButtonGroup>
        </Col>
      </Container>
    </Navbar>
  );
};

export default PlayMenu;
