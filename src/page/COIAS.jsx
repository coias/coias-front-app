import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { FaHandPaper, FaMousePointer } from 'react-icons/fa';
import { ImZoomIn, ImZoomOut } from 'react-icons/im';
import PanZoom from '../component/PanZoom';
import PlayMenu from '../component/PlayMenu';

function COIAS() {
  const [activateGrab, setActivateGrab] = useState(false);
  const [activateScroll, setActivateScroll] = useState(false);
  const [zoomIn, setZoomIn] = useState(false);
  const [zoomOut, setZoomOut] = useState(false);

  const findActiveTool = () => {
    if (activateGrab) setActivateGrab(!activateGrab);
    else if (activateScroll) setActivateScroll(!activateScroll);
    else if (zoomIn) setZoomIn(!zoomIn);
    else if (zoomOut) setZoomOut(!zoomOut);
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
                color={activateGrab ? 'red' : 'black'}
                onClick={() => {
                  findActiveTool();
                  setActivateGrab(!activateGrab);
                }}
              />
              <FaMousePointer
                size={30}
                color={activateScroll ? 'red' : 'black'}
                onClick={() => {
                  findActiveTool();
                  setActivateScroll(!activateScroll);
                }}
              />
              <ImZoomIn
                size={30}
                color={zoomIn ? 'red' : 'black'}
                onClick={() => {
                  findActiveTool();
                  setZoomIn(!zoomIn);
                }}
              />
              <ImZoomOut
                size={30}
                color={zoomOut ? 'red' : 'black'}
                onClick={() => {
                  findActiveTool();
                  setZoomOut(!zoomOut);
                }}
              />
            </div>
          </Col>
          <Col md={11}>
            <PanZoom
              activateGrab={activateGrab}
              activateScroll={activateScroll}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default withRouter(COIAS);
