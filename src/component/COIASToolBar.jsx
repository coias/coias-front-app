import React, { useContext } from 'react';
// import { IconContext } from 'react-icons';
import { Button, Col } from 'react-bootstrap';
import { FaMousePointer } from 'react-icons/fa';
import { AiOutlineReload } from 'react-icons/ai';
import { BiHide } from 'react-icons/bi';
import PropTypes from 'prop-types';
import ContrastBar from './ContrastBar';
import BrightnessBar from './BrightnessBar';
import { StarPositionContext } from './context';

// eslint-disable-next-line no-use-before-define
COIASToolBar.propTypes = {
  isSelect: PropTypes.bool.isRequired,
  setIsSelect: PropTypes.func.isRequired,
  isReload: PropTypes.bool.isRequired,
  setIsReload: PropTypes.func.isRequired,
  brightnessVal: PropTypes.number.isRequired,
  contrastVal: PropTypes.number.isRequired,
  setBrightnessVal: PropTypes.func.isRequired,
  setContrastVal: PropTypes.func.isRequired,
  isHide: PropTypes.bool.isRequired,
  setIsHide: PropTypes.func.isRequired,
  // MAIN_COLOR: PropTypes.string.isRequired,
};

function COIASToolBar({
  isSelect,
  setIsSelect,
  isReload,
  setIsReload,
  brightnessVal,
  contrastVal,
  setBrightnessVal,
  setContrastVal,
  isHide,
  setIsHide,
  // MAIN_COLOR,
}) {
  const { setStarPos } = useContext(StarPositionContext);
  return (
    <Col
      className="flex-column"
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        padding: 0,
      }}
    >
      <Button
        id="selectButton"
        data-active={isSelect}
        variant={isSelect ? 'danger' : 'light'}
        onClick={() => {
          setIsSelect(!isSelect);
        }}
      >
        <FaMousePointer size={30} />
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
      >
        <AiOutlineReload size={30} />
      </Button>
      <Button
        id="hideButton"
        data-active={isHide}
        variant={isHide ? 'danger' : 'light'}
        onClick={() => {
          setIsHide(!isHide);
        }}
      >
        <BiHide size={30} />
      </Button>
      <BrightnessBar val={brightnessVal} set={setBrightnessVal} />
      <ContrastBar val={contrastVal} set={setContrastVal} />
    </Col>
  );
}

export default COIASToolBar;
