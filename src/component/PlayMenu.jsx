import {
  Navbar,
  Nav,
  Container,
  Col,
  Button,
  ButtonGroup,
  Form,
} from 'react-bootstrap';
import {
  FaPlay,
  FaStop,
  FaSlash,
  FaStepForward,
  FaStepBackward,
} from 'react-icons/fa';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { PageContext } from './context';

function PlayMenu() {
  const { currentPage, setCurrentPage } = useContext(PageContext);
  const [sec, setSec] = useState(0.01);

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
        return c + 1;
      });
    }, sec);
  }, [sec]);

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
              <Form.Group className="mb-3">
                <Form.Label>再生速度:</Form.Label>
                <Form.Control
                  as="select"
                  custom
                  onChange={(v) => {
                    setSec(parseFloat(v.target.value));
                  }}
                >
                  <option value="10">0.01</option>
                  <option value="20">0.02</option>
                  <option value="50">0.05</option>
                  <option value="100">0.10</option>
                </Form.Control>
              </Form.Group>
            </Nav.Item>
            <Nav.Item>
              <Button
                variant="light"
                onClick={() => {
                  onClickBlinkStart();
                }}
              >
                <FaPlay size={30} />
              </Button>
            </Nav.Item>
            <Nav.Item>
              <FaSlash size={30} />
            </Nav.Item>
            <Nav.Item>
              <Button
                variant="light"
                onClick={() => {
                  onClickBlinkStop();
                }}
              >
                <FaStop size={30} />
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Button
                variant="light"
                onClick={() => {
                  onClickNext();
                }}
              >
                <FaStepBackward size={30} />
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Button
                variant="light"
                onClick={() => {
                  onClickBack();
                }}
              >
                <FaStepForward size={30} />
              </Button>
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
}

export default PlayMenu;
