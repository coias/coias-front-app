import React from "react";
import _ from "lodash";
import { Container, Row, Col, Form } from "react-bootstrap";
import { ImContrast, ImBrightnessContrast } from "react-icons/im";

const ContrastBar = (props) => {
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
        left: "0px",
      }}
    >
      <Form.Group as={Row} sm="auto">
        <Col>
          <Form.Label>
            <ImContrast />
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

export default ContrastBar;
