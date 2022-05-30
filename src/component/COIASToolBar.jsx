import React from 'react';
import { Button } from 'react-bootstrap';
import { FaHandPaper, FaMousePointer } from 'react-icons/fa';
import { AiOutlineReload } from 'react-icons/ai';
import { BiHide } from 'react-icons/bi';
import PropTypes from 'prop-types';
import ContrastBar from './ContrastBar';
import BrightnessBar from './BrightnessBar';

// eslint-disable-next-line no-use-before-define
COIASToolBar.propTypes = {
  isGrab: PropTypes.bool.isRequired,
  setIsGrab: PropTypes.func.isRequired,
  isSelect: PropTypes.bool.isRequired,
  setIsSelect: PropTypes.func.isRequired,
  isReload: PropTypes.bool.isRequired,
  setIsReload: PropTypes.func.isRequired,
  brightnessVal: PropTypes.number.isRequired,
  contrastVal: PropTypes.number.isRequired,
  setBrightnessVal: PropTypes.func.isRequired,
  setContrastVal: PropTypes.func.isRequired,
  isRectangle: PropTypes.bool.isRequired,
  setIsRectangel: PropTypes.func.isRequired,
  isText: PropTypes.bool.isRequired,
  setIsText: PropTypes.func.isRequired,
};

function COIASToolBar({
  isGrab,
  setIsGrab,
  isSelect,
  setIsSelect,
  isReload,
  setIsReload,
  brightnessVal,
  contrastVal,
  setBrightnessVal,
  setContrastVal,
  isRectangle,
  setIsRectangel,
  isText,
  setIsText,
}) {
  return (
    <div
      className="flex-column"
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '50px',
        marginLeft: '30px',
        marginTop: '30px',
      }}
    >
      <Button
        id="grabButton"
        data-active={isGrab}
        variant={isGrab ? 'danger' : 'light'}
        onClick={() => {
          setIsSelect(false);
          setIsGrab(!isGrab);
        }}
      >
        <FaHandPaper size={30} />
      </Button>
      <Button
        id="selectButton"
        data-active={isSelect}
        variant={isSelect ? 'danger' : 'light'}
        onClick={() => {
          setIsGrab(false);
          setIsSelect(!isSelect);
        }}
      >
        <FaMousePointer size={30} />
      </Button>
      <Button
        id="reloadButton"
        variant="light"
        onClick={() => {
          setIsGrab(false);
          setIsSelect(false);
          Array.from(
            document.getElementsByClassName('form-check-input'),
          ).forEach((item) => {
            // eslint-disable-next-line no-param-reassign
            item.checked = false;
          });
          setIsGrab(true);
          setIsRectangel(false);
          setIsText(false);
          setIsReload(!isReload);
          setBrightnessVal(150);
          setContrastVal(150);
        }}
      >
        <AiOutlineReload size={30} />
      </Button>
      <Button
        id="rectangleButton"
        data-active={isRectangle}
        variant={isRectangle ? 'danger' : 'light'}
        onClick={() => {
          setIsRectangel(!isRectangle);
        }}
      >
        <BiHide size={30} />
      </Button>
      <Button
        id="textleButton"
        data-active={isText}
        variant={isText ? 'danger' : 'light'}
        onClick={() => {
          setIsText(!isText);
        }}
      >
        <BiHide size={30} />
      </Button>
      <BrightnessBar val={brightnessVal} set={setBrightnessVal} />
      <ContrastBar val={contrastVal} set={setContrastVal} />
    </div>
  );
}

export default COIASToolBar;
