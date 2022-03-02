import { Col, Row } from "react-bootstrap";
import { withRouter } from "react-router";
import { useContext } from "react";
import { StarPositionContext } from "../App";
import { Scrollbars } from "react-custom-scrollbars";

const Report = () => {
  const { starPos, setStarPos } = useContext(StarPositionContext);

  return (
    <Row xs="auto">
      <Col>
        <h4>レポート:</h4>
      </Col>
      <Col>
        <Scrollbars
          style={{
            width: "100%",
            height: "80vh",
            overflow: "hidden",
            backgroundColor: "black",
            position: "relative",
          }}
        >
          <ul
            style={{
              listStyleType: "none",
              color: "white",
              backgroundColor: "black",
            }}
          >
            {starPos.map((pos) => {
              return <li>{"[ " + pos.toString() + " ]"}</li>;
            })}
          </ul>
        </Scrollbars>
      </Col>
    </Row>
  );
};

export default withRouter(Report);