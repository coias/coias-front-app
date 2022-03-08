import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import { PageContext, StarPositionContext } from './context';

function StarsList() {
  const { currentPage } = useContext(PageContext);
  const { starPos, setStarPos } = useContext(StarPositionContext);
  return (
    <Form>
      {starPos.map((pos) => {
        if (currentPage === parseInt(pos[1], 10)) {
          if (pos[0].startsWith('K')) {
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
                onChange={() => {
                  const checked = !pos[4];
                  const newStarPos = starPos.map((originalPos) => {
                    if (originalPos[0] === pos[0]) {
                      const newOriginalPos = [];
                      newOriginalPos.push(originalPos[0]);
                      newOriginalPos.push(originalPos[1]);
                      newOriginalPos.push(originalPos[2]);
                      newOriginalPos.push(originalPos[3]);
                      newOriginalPos.push(checked);
                      return newOriginalPos;
                    }
                    return originalPos;
                  });
                  setStarPos(newStarPos);
                  // console.log(props.starPos);
                }}
                id={pos[0]}
                label={pos[0]}
              />
            </div>
          );
        }
        return null;
      })}
    </Form>
  );
}

export default StarsList;
