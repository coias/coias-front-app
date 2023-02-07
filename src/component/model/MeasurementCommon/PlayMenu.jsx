import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Form,
  Nav,
  Navbar,
  ToggleButton,
} from 'react-bootstrap';
import { AiFillSetting } from 'react-icons/ai';
import { BiHelpCircle, BiHide, BiZoomIn, BiZoomOut } from 'react-icons/bi';
import { FaPlay, FaStepBackward, FaStepForward, FaStop } from 'react-icons/fa';
import CONSTANT from '../../../utils/CONSTANTS';
import { PageContext } from '../../functional/context';
import HelpModal from '../../ui/HelpModal';
import SettingModal from '../../ui/SettingModal';

function PlayMenu({
  imageNames,
  intervalRef,
  setDefaultZoomRate,
  defaultZoomRate,
  start,
  next,
  setNext,
  back,
  setBack,
  setIsAutoSave,
  isAutoSave,
  setSetting,
  scaleArray,
  setScaleArray,
  zoomIn,
  setZoomIn,
  zoomOut,
  setZoomOut,
  wrapperRef,
  disableShowAutoSave,
  isHide,
  setIsHide,
}) {
  const { currentPage, setCurrentPage } = useContext(PageContext);
  const [sec, setSec] = useState(250);
  const [play, setPlay] = useState(false);
  const [settingModalShow, setSettingModalShow] = useState(false);
  const [helpModalShow, setHelpModalShow] = useState(false);
  const [radioValue, setRadioValue] = useState('1');
  const [index, setIndex] = useState(0);

  const onClickNext = () => {
    const array = imageNames
      .filter((item) => item.visible)
      .map((image) =>
        parseInt(
          image.name.substr(0, 1) === '0'
            ? image.name.substr(1, 1) - 1
            : image.name.substr(0, 2) - 1,
          10,
        ),
      );
    const preindex = index;
    if (currentPage === array[array.length - 1]) {
      setIndex(0);
      setCurrentPage(array[0]);
    } else {
      setIndex(preindex + 1);
      setCurrentPage(array[preindex + 1]);
    }
  };

  const onClickBack = () => {
    if (currentPage === 0) setCurrentPage(imageNames.length - 1);
    else setCurrentPage(currentPage - 1);

    const array = imageNames
      .filter((item) => item.visible)
      .map((image) =>
        parseInt(
          image.name.substr(0, 1) === '0'
            ? image.name.substr(1, 1) - 1
            : image.name.substr(0, 2) - 1,
          10,
        ),
      );
    const preindex = index;
    if (preindex === 0) {
      setIndex(array.length - 1);
      setCurrentPage(array[array.length - 1]);
    } else {
      setIndex(preindex - 1);
      setCurrentPage(array[preindex - 1]);
    }
  };

  const onClickBlinkStart = useCallback(
    (tmpImage) => {
      setPlay(true);
      const array = tmpImage
        .filter((item) => item.visible)
        .map((image) =>
          parseInt(
            image.name.substr(0, 1) === '0'
              ? image.name.substr(1, 1) - 1
              : image.name.substr(0, 2) - 1,
            10,
          ),
        );
      let tmpIndex = index;
      if (intervalRef.current !== null) {
        return;
      }
      // eslint-disable-next-line no-param-reassign
      intervalRef.current = setInterval(() => {
        if (tmpIndex === array.length - 1) {
          tmpIndex = 0;
          setIndex(0);
          setCurrentPage(array[0]);
        } else {
          tmpIndex += 1;
          setIndex(tmpIndex);
          setCurrentPage(array[tmpIndex]);
        }
      }, sec);
    },
    [sec, index],
  );

  const onClickBlinkStop = useCallback(() => {
    setPlay(false);
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    // eslint-disable-next-line no-param-reassign
    intervalRef.current = null;
  }, []);

  const onClickZoomIn = () => {
    const scrollYRate =
      wrapperRef.current.scrollTop /
      (wrapperRef.current.scrollHeight - wrapperRef.current.clientHeight);
    const scrollXRate =
      wrapperRef.current.scrollLeft /
      (wrapperRef.current.scrollWidth - wrapperRef.current.clientWidth);

    const currentIndex = scaleArray.findIndex((item) => item.done);
    const arrayCopy = scaleArray.concat();
    if (currentIndex < arrayCopy.length - 1) {
      arrayCopy[currentIndex].done = false;
      arrayCopy[currentIndex + 1].done = true;
      wrapperRef.current.scrollBy(400 * scrollXRate, 400 * scrollYRate);
    }
    setScaleArray(arrayCopy);
  };

  const onClickZoomOut = () => {
    const scrollYRate =
      wrapperRef.current.scrollTop /
      (wrapperRef.current.scrollHeight - wrapperRef.current.clientHeight);
    const scrollXRate =
      wrapperRef.current.scrollLeft /
      (wrapperRef.current.scrollWidth - wrapperRef.current.clientWidth);

    const currentIndex = scaleArray.findIndex((item) => item.done);
    const arrayCopy = scaleArray.concat();
    if (currentIndex > 0) {
      arrayCopy[currentIndex].done = false;
      arrayCopy[currentIndex - 1].done = true;
      wrapperRef.current.scrollBy(-400 * scrollXRate, -400 * scrollYRate);
    }
    setScaleArray(arrayCopy);
  };

  useEffect(() => {
    if (start) onClickBlinkStart(imageNames);
    if (!start) onClickBlinkStop();
    if (next) {
      onClickNext();
      setNext(!next);
    }
    if (!back) {
      onClickBack();
      setBack(!back);
    }
    if (zoomIn) {
      onClickZoomIn();
      setZoomIn(!zoomIn);
    }
    if (zoomOut) {
      onClickZoomOut();
      setZoomOut(!zoomOut);
    }
  }, [start, next, back, zoomIn, zoomOut]);

  const setValid = () => {
    const array = imageNames
      .filter((item) => item.visible)
      .map(
        (image) =>
          parseInt(
            image.name.substr(0, 1) === '0'
              ? image.name.substr(1, 1)
              : image.name.substr(0, 2),
            10,
          ) - 1,
      );
    return array;
  };

  return (
    <Navbar bg="light" className="play-menu">
      <Nav>
        <Nav.Item className="text-center d-flex m-1">
          <Button
            className="blink-button"
            variant="light"
            onClick={() => {
              if (!play) {
                onClickBlinkStart(imageNames);
              } else {
                onClickBlinkStop();
              }
            }}
          >
            {play ? (
              <FaStop size={CONSTANT.iconSize22px} className="icon-color" />
            ) : (
              <FaPlay size={CONSTANT.iconSize22px} className="icon-color" />
            )}
          </Button>
        </Nav.Item>
        <Nav.Item className="text-center d-flex m-0">
          <Button
            variant="light"
            onClick={() => {
              onClickBack();
            }}
          >
            <FaStepBackward
              size={CONSTANT.iconSize22px}
              className="icon-color"
            />
          </Button>
        </Nav.Item>
        <Nav.Item className="text-center d-flex m-0">
          <Button
            variant="light"
            onClick={() => {
              onClickNext();
            }}
            style={{ marginLeft: '-10px' }}
          >
            <FaStepForward
              size={CONSTANT.iconSize22px}
              className="icon-color"
            />
          </Button>
        </Nav.Item>
        <Nav.Item className="d-flex">
          <Form.Control
            as="select"
            defaultValue="250"
            className="select-style f-en"
            onChange={(v) => {
              setSec(parseFloat(v.target.value));
            }}
          >
            <option value="10">0.01</option>
            <option value="20">0.02</option>
            <option value="50">0.05</option>
            <option value="100">0.10</option>
            <option value="250">0.25</option>
            <option value="500">0.50</option>
          </Form.Control>
          <Form.Text
            style={{ margin: 'auto 0', marginLeft: '5px' }}
            className="f-en"
          >
            sec
          </Form.Text>
        </Nav.Item>
        <Nav.Item className="text-center d-flex m-0">
          <Button
            variant="light"
            onClick={() => {
              onClickZoomIn();
            }}
          >
            <BiZoomIn size={CONSTANT.iconSize22px} className="icon-color" />
          </Button>
        </Nav.Item>
        <Nav.Item className="text-center d-flex m-0">
          <Button
            variant="light"
            onClick={() => {
              onClickZoomOut();
            }}
          >
            <BiZoomOut size={CONSTANT.iconSize22px} className="icon-color" />
          </Button>
        </Nav.Item>
        <Nav.Item className="text-center d-flex m-0">
          <Button
            data-active={isHide}
            variant="light"
            onClick={() => {
              setIsHide(!isHide);
            }}
          >
            {isHide ? (
              <BiHide size={CONSTANT.iconSize22px} className="icon-color_off" />
            ) : (
              <BiHide size={CONSTANT.iconSize22px} className="icon-color" />
            )}
          </Button>
        </Nav.Item>
      </Nav>
      <ButtonGroup className="flex-grow-1 f-en" style={{ margin: 'auto 0' }}>
        {imageNames
          .filter((img) => img.visible)
          .map((name) => (
            <ToggleButton
              id={`radio-${
                parseInt(
                  name.name.substr(0, 1) === '0'
                    ? name.name.substr(1, 1)
                    : name.name.substr(0, 2),
                  10,
                ) - 1
              }`}
              type="radio"
              name="radio"
              checked={
                (radioValue === name.name &&
                  currentPage ===
                    parseInt(
                      name.name.substr(0, 1) === '0'
                        ? name.name.substr(1, 1)
                        : name.name.substr(0, 2),
                      10,
                    ) -
                      1) ||
                currentPage ===
                  parseInt(
                    name.name.substr(0, 1) === '0'
                      ? name.name.substr(1, 1)
                      : name.name.substr(0, 2),
                    10,
                  ) -
                    1
              }
              onChange={(e) => {
                setCurrentPage(
                  parseInt(
                    name.name.substr(0, 1) === '0'
                      ? name.name.substr(1, 1)
                      : name.name.substr(0, 2),
                    10,
                  ) - 1,
                );
                setRadioValue(e.currentTarget.value);
              }}
              bsstyle="default"
              style={{ fontWeight: 'bold', textAlign: 'center' }}
            >
              {name.name.substr(0, 1) === '0'
                ? name.name.substr(1, 1)
                : name.name.substr(0, 2)}
            </ToggleButton>
          ))}
      </ButtonGroup>
      <ButtonGroup style={{ marginRight: '10px' }}>
        <Button variant="light" onClick={() => setSettingModalShow(true)}>
          <AiFillSetting size={CONSTANT.iconSize22px} className="icon-color" />
        </Button>
        <SettingModal
          show={settingModalShow}
          onHide={() => {
            setSettingModalShow(false);
            // setImageURLs(JSON.parse(JSON.stringify(imageNames)));
            setSetting(true);
            const array = setValid();
            setCurrentPage(array[0]);
            setIndex(0);
          }}
          title="表示設定"
          imageURLs={imageNames}
          setDefaultZoomRate={setDefaultZoomRate}
          defaultZoomRate={defaultZoomRate}
          setIsAutoSave={setIsAutoSave}
          isAutoSave={isAutoSave}
          disableShowAutoSave={disableShowAutoSave}
        />
        <Button variant="light" onClick={() => setHelpModalShow(true)}>
          <BiHelpCircle size={CONSTANT.iconSize22px} className="icon-color" />
        </Button>
        <HelpModal
          show={helpModalShow}
          onHide={() => {
            setHelpModalShow(false);
          }}
          title="ヘルプ"
          imageURLs={imageNames}
        />
      </ButtonGroup>
    </Navbar>
  );
}

PlayMenu.propTypes = {
  imageNames: PropTypes.arrayOf(PropTypes.object).isRequired,
  // setImageURLs: PropTypes.func.isRequired,
  intervalRef: PropTypes.objectOf(PropTypes.number).isRequired,
  setDefaultZoomRate: PropTypes.func,
  defaultZoomRate: PropTypes.number,
  start: PropTypes.bool.isRequired,
  next: PropTypes.bool.isRequired,
  setNext: PropTypes.func.isRequired,
  back: PropTypes.bool.isRequired,
  setBack: PropTypes.func.isRequired,
  setIsAutoSave: PropTypes.func.isRequired,
  isAutoSave: PropTypes.bool.isRequired,
  setSetting: PropTypes.func.isRequired,
  scaleArray: PropTypes.arrayOf(PropTypes.object).isRequired,
  setScaleArray: PropTypes.func.isRequired,
  zoomIn: PropTypes.bool.isRequired,
  setZoomIn: PropTypes.func.isRequired,
  zoomOut: PropTypes.bool.isRequired,
  setZoomOut: PropTypes.func.isRequired,
  wrapperRef: PropTypes.objectOf(PropTypes.object).isRequired,
  disableShowAutoSave: PropTypes.bool,
  isHide: PropTypes.bool.isRequired,
  setIsHide: PropTypes.func.isRequired,
};

PlayMenu.defaultProps = {
  setDefaultZoomRate: () => {},
  defaultZoomRate: 0,
  disableShowAutoSave: false,
};

export default PlayMenu;
