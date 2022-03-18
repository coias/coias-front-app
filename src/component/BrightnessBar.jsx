import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { ImBrightnessContrast } from 'react-icons/im';
import PropTypes from 'prop-types';

function BrightnessBar({ val, set }) {
  return (
    <div
      style={{
        opacity: 0.5,
        width: '400px',
        height: '50px',
        color: 'white',
        backgroundColor: 'black',
        position: 'absolute',
        bottom: '0px',
        left: '600px',
        borderRadius: '5px',
      }}
    >
      <Form.Group as={Row} sm="auto">
        <Col>
          <Form.Label>
            <ImBrightnessContrast />
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

BrightnessBar.propTypes = {
  val: PropTypes.number.isRequired,
  set: PropTypes.func.isRequired,
};

export default BrightnessBar;
