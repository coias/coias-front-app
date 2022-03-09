import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { FaHandPaper, FaMousePointer } from 'react-icons/fa';
import { ImZoomIn, ImZoomOut } from 'react-icons/im';
import PanZoom from '../component/PanZoom';
import PlayMenu from '../component/PlayMenu';

function COIAS() {
  const [isGrab, setIsGrab] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [isZoomOut, setIsZoomOut] = useState(false);

  const findActiveTool = () => {
    if (isGrab) setIsGrab(!isGrab);
    else if (isScroll) setIsScroll(!isScroll);
    else if (isZoomIn) setIsZoomIn(!isZoomIn);
    else if (isZoomOut) setIsZoomOut(!isZoomOut);
  };

  return (
    <div>
      <PlayMenu />
      <Container fluid>
        <Row>
          <Col>
            <div
              className="flex-column"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <FaHandPaper
                size={30}
                color={isGrab ? 'red' : 'black'}
                onClick={() => {
                  findActiveTool();
                  setIsGrab(!isGrab);
                }}
              />
              <FaMousePointer
                size={30}
                color={isScroll ? 'red' : 'black'}
                onClick={() => {
                  findActiveTool();
                  setIsScroll(!isScroll);
                }}
              />
              <ImZoomIn
                size={30}
                color={isZoomIn ? 'red' : 'black'}
                onClick={() => {
                  findActiveTool();
                  setIsZoomIn(!isZoomIn);
                }}
              />
              <ImZoomOut
                size={30}
                color={isZoomOut ? 'red' : 'black'}
                onClick={() => {
                  findActiveTool();
                  setIsZoomOut(!isZoomOut);
                }}
              />
            </div>
          </Col>
          <Col md={11}>
            <PanZoom isGrab={isGrab} isScroll={isScroll} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default withRouter(COIAS);
