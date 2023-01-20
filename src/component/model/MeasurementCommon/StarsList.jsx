import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { MdOutlineExpandMore } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import { PageContext, StarPositionContext } from '../../functional/context';

function StarsList({ disable, writeMemo, setSelectedListState }) {
  const { currentPage } = useContext(PageContext);
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const [dispLimit, setDispLimit] = useState(100);

  useEffect(() => {
    if (dispLimit !== 100) {
      setDispLimit(100);
    }
  }, [currentPage]);

  const location = useLocation();

  const isCOIAS = location.pathname === '/COIAS';
  const isManual = location.pathname === '/ManualMeasurement';

  return (
    <>
      <div className="star-list-title f-ja">
        <p
          style={{
            marginTop: '20px',
            fontWeight: 'bold',
            color: '#5C636A',
            letterSpacing: '1px',
          }}
        >
          天体一覧
        </p>
      </div>
      <Form className="star-list">
        {Object.keys(starPos)
          .sort()
          .map((key) => starPos[key])
          .map((pos, index) => {
            if (index < dispLimit) {
              if (pos.page[currentPage]) {
                if (!pos.isKnown && isCOIAS) {
                  return (
                    <div className="mb-3 f-en" key={pos.name}>
                      <Form.Check
                        type="checkbox"
                        disabled={!disable}
                        checked={pos.isSelected ? pos.isSelected : false}
                        onChange={() => {
                          const newStarPos = JSON.parse(
                            JSON.stringify(starPos),
                          );
                          newStarPos[pos.name].isSelected = !pos.isSelected;
                          setSelectedListState((prevList) => {
                            const prevListCopy = prevList.concat();
                            prevListCopy[index] = !prevListCopy[index];
                            return prevListCopy;
                          });
                          writeMemo(newStarPos);
                          setStarPos(newStarPos);
                        }}
                        inline
                        id={pos.name}
                        label={pos.name}
                      />
                    </div>
                  );
                }
                return (
                  <div className="mb-3 f-en" key={pos.name}>
                    <Form.Check
                      disabled
                      type="checkbox"
                      id={pos.name}
                      label={
                        pos.name === pos.newName || !isManual
                          ? pos.name
                          : pos.newName
                      }
                      checked={false}
                    />
                  </div>
                );
              }
            }
            return null;
          })}
        {dispLimit < Object.keys(starPos).length && dispLimit === 100 && (
          <Button
            onClick={() => {
              setDispLimit(Object.keys(starPos).length);
            }}
          >
            <MdOutlineExpandMore size={20} />
            more
          </Button>
        )}
      </Form>
    </>
  );
}

StarsList.propTypes = {
  disable: PropTypes.bool.isRequired,
  writeMemo: PropTypes.func,
  setSelectedListState: PropTypes.func,
};

StarsList.defaultProps = {
  writeMemo: () => {},
  setSelectedListState: () => {},
};

export default StarsList;
