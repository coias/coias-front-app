import React from "react";
import _ from "lodash";
import { Container, Row, Col, Form } from "react-bootstrap";
import { ImBrightnessContrast } from "react-icons/im";

const BrightnessBar = (props) => {
  return (
    <div
      style={{
        opacity: 0.5,
        width: "200px",
        height: "50px",
        color: "white",
        backgroundColor: "black",
        position: "absolute",
        bottom: "0px",
        left: "400px",
      }}
    >
      <Form.Group as={Row} sm="auto">
        <Col>
          <Form.Label>
            <ImBrightnessContrast />
          </Form.Label>
        </Col>
        <Col>
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
