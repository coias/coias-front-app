import React, { useContext } from "react";
import { Container, Row, Col , Nav} from "react-bootstrap";
import { FaHandPaper, FaMousePointer } from "react-icons/fa";
import { ImZoomIn, ImZoomOut } from "react-icons/im";
import { withRouter } from "react-router-dom";
import PanZoom from "../component/PanZoom";
import PlayMenu from "../component/Playmenu";

const COIAS = () => {
  return (
    <div>
      <PlayMenu />
      <Container fluid>
        <Row>
          <Col>
            <Nav className="flex-column">
              <FaHandPaper size={30} />
              <FaMousePointer size={30} />
              <ImZoomIn size={30} />
              <ImZoomOut size={30} />
            </Nav>
          </Col>
          <Col md={11}>
            <PanZoom />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withRouter(COIAS);
