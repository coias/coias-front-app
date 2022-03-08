import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { ImBrightnessContrast } from 'react-icons/im';

const BrightnessBar = (props) => {
  return (
    <div
      style={{
        opacity: 0.5,
        width: "400px",
        height: "50px",
        color: "white",
        backgroundColor: "black",
        position: "absolute",
        bottom: "0px",
        left: "600px",
        borderRadius: "5px",
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
            value={props.val}
            onChange={(e) => props.set(Number(e.target.value))}
          />
        </Col>
      </Form.Group>
    </div>
  );
};

export default BrightnessBar;
