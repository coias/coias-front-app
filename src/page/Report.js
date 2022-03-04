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
        <Scrollbars style={{backgroundColor: "black", width:"1000px", height:"1000px"}}>
        <div style={{backgroundColor: "black", width:"1000px", height:"1000px"}}>
            <ul style={{listStyleType:"none", color : "white"}}>
              {starPos.filter(pos => pos[4]).map(pos => {
                return <li>{pos[0] + " , " + pos[1] + " , " + pos[2] + " , " + pos[3]}</li>;
              })}
            </ul>
        </div> 
        </Scrollbars>
           
  
       </Col>
    </Row>
  );
};

export default withRouter(Report);