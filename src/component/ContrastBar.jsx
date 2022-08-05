import React from 'react';
import { ImContrast } from 'react-icons/im';
import PropTypes from 'prop-types';

function ContrastBar({ val, set }) {
  return (
    <div
      style={{
        opacity: 0.7,
      }}
    >
      <ImContrast size={23} />
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
        style={{ marginLeft: '19px' }}
      />
    </div>
  );
}

ContrastBar.propTypes = {
  val: PropTypes.number.isRequired,
  set: PropTypes.func.isRequired,
};

export default ContrastBar;
