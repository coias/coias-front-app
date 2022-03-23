import {
  Navbar,
  Nav,
  Container,
  Col,
  Button,
  ButtonGroup,
  Form,
} from 'react-bootstrap';

import { CgFormatSlash } from 'react-icons/cg';
import { FaPlay, FaStop, FaStepForward, FaStepBackward } from 'react-icons/fa';
import React, { useCallback, useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { PageContext } from './context';

function PlayMenu({ imageNames }) {
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
            <Nav.Item className="text-center d-flex">
              <Form.Group className="mb-3">
                <Form.Label>再生速度:</Form.Label>
                <Form.Control
                  as="select"
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
            <Nav.Item className="text-center d-flex">
              <Button
                variant="light"
                onClick={() => {
                  onClickBlinkStart();
                }}
              >
                <FaPlay size={30} />
              </Button>
            </Nav.Item>
            <Nav.Item className="text-center d-flex p-0 m-0">
              <Button disabled variant="light">
                <CgFormatSlash size={40} />
              </Button>
            </Nav.Item>
            <Nav.Item className="text-center d-flex">
              <Button
                variant="light"
                onClick={() => {
                  onClickBlinkStop();
                }}
              >
                <FaStop size={30} />
              </Button>
            </Nav.Item>
            <Nav.Item className="text-center d-flex">
              <Button
                variant="light"
                onClick={() => {
                  onClickBack();
                }}
              >
                <FaStepBackward size={30} />
              </Button>
            </Nav.Item>
            <Nav.Item className="text-center d-flex">
              <Button
                variant="light"
                onClick={() => {
                  onClickNext();
                }}
              >
                <FaStepForward size={30} />
              </Button>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md={9}>
          <ButtonGroup aria-label="Basic example">
            {imageNames.map((name, index) => (
              <Button
                key={name}
                variant="light"
                onClick={() => {
                  setCurrentPage(index);
                }}
              >
                {name}
              </Button>
            ))}
          </ButtonGroup>
        </Col>
      </Container>
    </Navbar>
  );
}

PlayMenu.propTypes = {
  imageNames: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PlayMenu;
