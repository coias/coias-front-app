import React, { useContext } from 'react';
import { IconContext } from 'react-icons';
import { Button } from 'react-bootstrap';
import { FaMousePointer } from 'react-icons/fa';
import { AiOutlineReload } from 'react-icons/ai';
import { BiHide } from 'react-icons/bi';
import PropTypes from 'prop-types';
import { StarPositionContext } from './context';
import btnColor from '../utils/CONSTANTS';

// eslint-disable-next-line no-use-before-define
COIASToolBar.propTypes = {
  isSelect: PropTypes.bool.isRequired,
  setIsSelect: PropTypes.func.isRequired,
  isReload: PropTypes.bool.isRequired,
  setIsReload: PropTypes.func.isRequired,
  setBrightnessVal: PropTypes.func.isRequired,
  setContrastVal: PropTypes.func.isRequired,
  isHide: PropTypes.bool.isRequired,
  setIsHide: PropTypes.func.isRequired,
};

function COIASToolBar({
  isSelect,
  setIsSelect,
  isReload,
  setIsReload,
  setBrightnessVal,
  setContrastVal,
  isHide,
  setIsHide,
}) {
  const { setStarPos } = useContext(StarPositionContext);
  return (
    <div className="coias-tool-bar">
      <Button
        id="selectButton"
        data-active={isSelect}
        variant="light"
        onClick={() => {
          setIsSelect(!isSelect);
        }}
        className="tool-btn"
      >
        <IconContext.Provider
          // eslint-disable-next-line react/jsx-no-constructed-context-values
          value={{ color: isSelect ? btnColor.selected : btnColor.defaulte }}
        >
          <FaMousePointer size={30} />
        </IconContext.Provider>
      </Button>
      <Button
        id="reloadButton"
        variant="light"
        onClick={() => {
          setIsSelect(false);
          setIsHide(false);
          setIsReload(!isReload);
          setBrightnessVal(150);
          setContrastVal(150);
          setStarPos((prevStarPos) => {
            const newStarPos = prevStarPos;
            Object.keys(prevStarPos).forEach((key) => {
              newStarPos[key].isSelected = false;
            });
            return newStarPos;
          });
        }}
        className="tool-btn"
      >
        <IconContext.Provider
          // eslint-disable-next-line react/jsx-no-constructed-context-values
          value={{ color: btnColor.defaulte }}
        >
          <AiOutlineReload size={30} />
        </IconContext.Provider>
      </Button>
      <Button
        id="hideButton"
        data-active={isHide}
        variant="light"
        onClick={() => {
          setIsHide(!isHide);
        }}
        className="tool-btn"
      >
        <IconContext.Provider
          // eslint-disable-next-line react/jsx-no-constructed-context-values
          value={{ color: isHide ? btnColor.selected : btnColor.defaulte }}
        >
          <BiHide size={30} />
        </IconContext.Provider>
      </Button>
    </div>
  );
}

export default COIASToolBar;
