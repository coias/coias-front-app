import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ManualToolBar from '../component/ManualToolBar/ManualToolBar';

function ManualMeasurement() {
  return (
    <Container fluid>
      <Row>
        <Col sm={3} style={{ background: 'blue' }}>
          <ManualToolBar />
        </Col>
        <Col style={{ background: 'red' }} />
      </Row>
    </Container>
  );
}

export default ManualMeasurement;
