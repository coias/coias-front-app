import React from 'react';
import { ImContrast } from 'react-icons/im';
import PropTypes from 'prop-types';

function ContrastBar({ val, set }) {
  return (
    <div
      style={{
        opacity: 0.5,
        width: '35px',
        height: '40%',
        color: 'white',
        backgroundColor: 'black',
        borderRadius: '5px',
        textAlign: 'center',
      }}
    >
      <ImContrast size={30} />
      <input
        id="ex4"
        type="range"
        min="0"
        max="300"
        data-slider-step="1"
        value={val.toString()}
        onChange={(e) => {
          set(Number(e.target.value));
        }}
        data-slider-orientation="vertical"
      />
    </div>
  );
}

ContrastBar.propTypes = {
  val: PropTypes.number.isRequired,
  set: PropTypes.func.isRequired,
};

export default ContrastBar;
