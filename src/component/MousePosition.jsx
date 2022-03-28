import React, { useContext } from 'react';
import { BiCurrentLocation } from 'react-icons/bi';
import { MousePositionContext } from './context';

function MousePosition() {
  const { currentMousePos } = useContext(MousePositionContext);
  return (
    <div
      style={{
        opacity: 0.5,
        width: '200px',
        height: '24px',
        color: 'white',
        backgroundColor: 'black',
        position: 'absolute',
        top: '-24px',
        right: '10px',
        zIndex: 999,
      }}
    >
      <BiCurrentLocation size={24} />
      {`${currentMousePos.x},${currentMousePos.y}`}
    </div>
  );
}

export default MousePosition;
