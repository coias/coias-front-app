import React from 'react';
import {
  Container,
  Row,
  Col,
  Nav,
} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import PanZoom from '../component/PanZoom';
import PlayMenu from '../component/PlayMenu';

function COIAS() {
  return (
    <div>
      <PlayMenu />
      <Container fluid>
        <Row>
          <Col md={1}>
            <Nav defaultActiveKey="/home" className="flex-column">
              <Nav.Link href="/home">Active</Nav.Link>
              <Nav.Link eventKey="link-1">Link</Nav.Link>
              <Nav.Link eventKey="link-2">Link</Nav.Link>
              <Nav.Link eventKey="disabled" disabled>
                Disabled
              </Nav.Link>
            </Nav>
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
