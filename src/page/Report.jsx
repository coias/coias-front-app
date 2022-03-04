import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { withRouter } from 'react-router';

function Report() {
  return (
    <div>
      <Row xs="auto">
        <Col>
          <h4>レポート:</h4>
        </Col>
        <Col>
          <div
            style={{
              backgroundColor: 'black',
              width: '1000px',
              height: '1000px',
            }}
          >
            <ul style={{ listStyleType: 'none', color: 'white' }}>
              <li>1_disp-coias-nonmask.png</li>
              <li>2_disp-coias-nonmask.png</li>
              <li>3_disp-coias-nonmask.png</li>
              <li>4_disp-coias-nonmask.png</li>
              <li>5_disp-coias-nonmask.png</li>
            </ul>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default withRouter(Report);
