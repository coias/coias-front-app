import React, { useContext, useEffect, useState } from 'react';
import { BiCurrentLocation } from 'react-icons/bi';
import PropTypes from 'prop-types';
import { MousePositionContext } from './context';

function MousePosition({ isZoomIn, IMAGE_WIDTH, IMAGE_HEIGHT }) {
  const { currentMousePos } = useContext(MousePositionContext);
  const [prevMousePos, setPrevMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isZoomIn) {
      setPrevMousePos(currentMousePos);
    }
  }, [currentMousePos]);

  const getZoomRate = (IMAGE_SIZE) => {
    let zoomRate;
    if (IMAGE_SIZE > 2100) {
      zoomRate = 2;
    } else if (IMAGE_SIZE > 1050) {
      zoomRate = 4;
    } else {
      zoomRate = 6;
    }
    return zoomRate;
  };
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
      {`${Math.floor(prevMousePos.x / getZoomRate(IMAGE_WIDTH))},${Math.floor(
        prevMousePos.y / getZoomRate(IMAGE_HEIGHT),
      )}`}
    </div>
  );
}

export default MousePosition;

MousePosition.propTypes = {
  isZoomIn: PropTypes.bool.isRequired,
  IMAGE_WIDTH: PropTypes.number.isRequired,
  IMAGE_HEIGHT: PropTypes.number.isRequired,
};
