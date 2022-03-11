import {
  Navbar,
  Nav,
  Container,
  Col,
  Button,
  ButtonGroup,
} from 'react-bootstrap';
import * as fa from 'react-icons/fa';
import { CgFormatSlash } from 'react-icons/cg';
import React, { useCallback, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { PageContext } from './context';

function PlayMenu({ imageNames }) {
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
        return c + 1;
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
              <fa.FaPlay
                onClick={() => {
                  onClickBlinkStart();
                }}
                size={30}
              />
            </Nav.Item>
            <Nav.Item>
              <CgFormatSlash size={30} />
            </Nav.Item>
            <Nav.Item>
              <fa.FaStop
                onClick={() => {
                  onClickBlinkStop();
                }}
                size={30}
              />
            </Nav.Item>
            <Nav.Item>
              <fa.FaStepBackward
                onClick={() => {
                  onClickNext();
                }}
                size={30}
              />
            </Nav.Item>
            <Nav.Item>
              <fa.FaStepForward
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
