import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { FaHandPaper, FaMousePointer } from 'react-icons/fa';
import { ImZoomIn, ImZoomOut } from 'react-icons/im';
import PanZoom from '../component/PanZoom';
import PlayMenu from '../component/PlayMenu';

function COIAS() {
  const [activate, setActivate] = useState(false);
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
                color={activate ? 'red' : 'black'}
                onClick={() => {
                  setActivate(!activate);
                }}
              />
              <FaMousePointer size={30} />
              <ImZoomIn size={30} />
              <ImZoomOut size={30} />
            </div>
          </Col>
          <Col md={11}>
            <PanZoom />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default withRouter(COIAS);
