import { useState, useContext } from "react";
import { Form } from "react-bootstrap";

const StarsList = (props) => {

  return (
    <Form>
      {props.starPos.map((pos) => {
        if (props.currentPage === parseInt(pos[1])) {
          if (pos[0].startsWith("K")) {
            return (
              <div className="mb-3">
                <Form.Check
                  disabled
                  type="checkbox"
                  id={pos[0]}
                  label={pos[0]}
                />
              </div>
            );
          }
          return (
            <div className="mb-3">
              <Form.Check 
                type="checkbox" 
                defaultChecked={pos[4]}
                onChange={
                  () => {
                    const checked = pos[4] ? false : true;
                    props.starPos.filter(originalPos => (originalPos[0] === pos[0])).map(originalPos => {originalPos[4] = checked});
                    console.log(props.starPos);
                  }
                } 
                id={pos[0]} 
                label={pos[0]} />
            </div>
          );
        }
      })}
    </Form>
  );
};

export default StarsList;
