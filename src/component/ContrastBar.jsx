import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { ImContrast } from 'react-icons/im';
import PropTypes from 'prop-types';

function ContrastBar({ val, set }) {
  return (
    <div
      style={{
        opacity: 0.5,
        width: '400px',
        color: 'white',
        backgroundColor: 'black',
        borderRadius: '5px',
      }}
    >
      <Form.Group as={Row} sm="auto">
        <Col>
          <Form.Label>
            <ImContrast />
          </Form.Label>
        </Col>
        <Col sm={10}>
          <Form.Range
            max={300}
            value={val}
            onChange={(e) => set(Number(e.target.value))}
          />
        </Col>
      </Form.Group>
    </div>
  );
}

ContrastBar.propTypes = {
  val: PropTypes.number.isRequired,
  set: PropTypes.func.isRequired,
};

export default ContrastBar;
