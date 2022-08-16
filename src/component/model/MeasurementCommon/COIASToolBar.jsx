import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { AiOutlineReload } from 'react-icons/ai';
import { BiHide } from 'react-icons/bi';
import { FaMousePointer } from 'react-icons/fa';
import CONSTANT from '../../../utils/CONSTANTS';
import { StarPositionContext } from '../../functional/context';
import BrightnessBar from '../../ui/BrightnessBar';
import ContrastBar from '../COIAS/ContrastBar';

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
  contrastVal: PropTypes.number.isRequired,
  brightnessVal: PropTypes.number.isRequired,
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
  contrastVal,
  brightnessVal,
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
          value={{
            color: isSelect
              ? CONSTANT.selectedBtnColor
              : CONSTANT.defaultBtnColor,
          }}
        >
          <FaMousePointer size={CONSTANT.iconSize} />
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
          value={{ color: CONSTANT.defaultBtnColor }}
        >
          <AiOutlineReload size={CONSTANT.iconSize} />
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
          value={{
            color: isHide
              ? CONSTANT.selectedBtnColor
              : CONSTANT.defaultBtnColor,
          }}
        >
          <BiHide size={CONSTANT.iconSize} style={{ marginBottom: '20px' }} />
        </IconContext.Provider>
      </Button>
      <BrightnessBar val={brightnessVal} set={setBrightnessVal} />
      <ContrastBar val={contrastVal} set={setContrastVal} />
    </div>
  );
}

export default COIASToolBar;
