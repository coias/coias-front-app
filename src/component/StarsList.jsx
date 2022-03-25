import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import { PageContext, StarPositionContext } from './context';

function StarsList() {
  const { currentPage } = useContext(PageContext);
  const { starPos, setStarPos } = useContext(StarPositionContext);
  return (
    <Form>
      {Object.keys(starPos)
        .sort()
        .map((key) => starPos[key])
        .map((pos) => {
          if (pos.page[currentPage]) {
            if (pos.name.startsWith('K')) {
              return (
                <div className="mb-3" key={pos.name}>
                  <Form.Check
                    disabled
                    type="checkbox"
                    id={pos.name}
                    label={pos.name}
                  />
                </div>
              );
            }
            return (
              <div className="mb-3" key={pos.name}>
                <Form.Check
                  type="checkbox"
                  defaultChecked={pos.isSelected}
                  onChange={() => {
                    const newStarPos = JSON.parse(JSON.stringify(starPos));
                    newStarPos[pos.name].isSelected = !pos.isSelected;
                    setStarPos(newStarPos);
                  }}
                  id={pos.name}
                  label={pos.name}
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
