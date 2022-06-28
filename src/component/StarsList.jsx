import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { PageContext, StarPositionContext } from './context';

function StarsList({ disable, writeMemo }) {
  const { currentPage } = useContext(PageContext);
  const { starPos, setStarPos } = useContext(StarPositionContext);

  return (
    <Form className="star-list">
      {Object.keys(starPos)
        .sort()
        .map((key) => starPos[key])
        .map((pos) => {
          if (pos.page[currentPage]) {
            if (!pos.isKnown) {
              return (
                <div className="mb-3" key={pos.name}>
                  <Form.Check
                    type="checkbox"
                    disabled={!disable}
                    checked={pos.isSelected}
                    onChange={() => {
                      const newStarPos = JSON.parse(JSON.stringify(starPos));
                      newStarPos[pos.name].isSelected = !pos.isSelected;
                      writeMemo(newStarPos);
                      setStarPos(newStarPos);
                    }}
                    id={pos.name}
                    label={pos.name}
                  />
                </div>
              );
            }
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
          return null;
        })}
    </Form>
  );
}

StarsList.propTypes = {
  disable: PropTypes.bool.isRequired,
  writeMemo: PropTypes.func.isRequired,
};

export default StarsList;
