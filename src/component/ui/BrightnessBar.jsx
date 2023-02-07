import PropTypes from 'prop-types';
import React from 'react';
import { IconContext } from 'react-icons';
import { ImBrightnessContrast } from 'react-icons/im';
import CONSTANT from '../../utils/CONSTANTS';

function BrightnessBar({ val, set }) {
  return (
    <div className="bright-contrast-bar">
      <IconContext.Provider
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        value={{
          color: 'white',
        }}
      >
        <ImBrightnessContrast
          size={CONSTANT.iconSize22px}
          style={{ margin: 'auto 10px' }}
        />
      </IconContext.Provider>
      <input
        id="ex4"
        type="range"
        min="0"
        max="300"
        data-slider-step="1"
        orient="vertical"
        value={val.toString()}
        onChange={(e) => {
          set(Number(e.target.value));
        }}
      />
    </div>
  );
}

BrightnessBar.propTypes = {
  val: PropTypes.number.isRequired,
  set: PropTypes.func.isRequired,
};

export default BrightnessBar;
