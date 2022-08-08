import React from 'react';
import { ImContrast } from 'react-icons/im';
import PropTypes from 'prop-types';

function ContrastBar({ val, set }) {
  return (
    <div className="bright-contrast-bar">
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
        style={{ marginTop: '10px' }}
      />
    </div>
  );
}

ContrastBar.propTypes = {
  val: PropTypes.number.isRequired,
  set: PropTypes.func.isRequired,
};

export default ContrastBar;
