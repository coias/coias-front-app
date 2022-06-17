import React from 'react';
import { Button, Col } from 'react-bootstrap';
import { FaMousePointer } from 'react-icons/fa';
import { AiOutlineReload } from 'react-icons/ai';
import { BiHide } from 'react-icons/bi';
import PropTypes from 'prop-types';
import ContrastBar from './ContrastBar';
import BrightnessBar from './BrightnessBar';

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
}) {
  return (
    <Col
      className="flex-column"
      style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: '30px',
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
          Array.from(
            document.getElementsByClassName('form-check-input'),
          ).forEach((item) => {
            // eslint-disable-next-line no-param-reassign
            item.checked = false;
          });
          setIsHide(false);
          setIsReload(!isReload);
          setBrightnessVal(150);
          setContrastVal(150);
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
