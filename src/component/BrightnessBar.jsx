import React from 'react';
import { ImBrightnessContrast } from 'react-icons/im';
import PropTypes from 'prop-types';

function BrightnessBar({ val, set }) {
  return (
    <div
      style={{
        opacity: 0.7,
      }}
    >
      <ImBrightnessContrast size={30} />
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
        style={{ marginLeft: '14px' }}
      />
    </div>
  );
}

BrightnessBar.propTypes = {
  val: PropTypes.number.isRequired,
  set: PropTypes.func.isRequired,
};

export default BrightnessBar;
