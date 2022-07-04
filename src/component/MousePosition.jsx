import React, { useContext, useEffect, useState } from 'react';
import { BiCurrentLocation } from 'react-icons/bi';
import PropTypes from 'prop-types';
import { MousePositionContext } from './context';

function MousePosition({ isZoomIn }) {
  const { currentMousePos } = useContext(MousePositionContext);
  const [prevMousePos, setPrevMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isZoomIn) {
      setPrevMousePos(currentMousePos);
    }
  }, [currentMousePos]);

  return (
    <div
      style={{
        opacity: 0.5,
        width: '200px',
        height: '24px',
        color: 'white',
        backgroundColor: 'black',
        position: 'absolute',
        top: '0px',
        right: '10px',
        zIndex: 999,
      }}
    >
      <BiCurrentLocation size={24} />
      {`${prevMousePos.x / 2},${prevMousePos.y / 2}`}
    </div>
  );
}

export default MousePosition;

MousePosition.propTypes = {
  isZoomIn: PropTypes.bool.isRequired,
};
