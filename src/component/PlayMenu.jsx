import {
  Navbar,
  Nav,
  Container,
  Col,
  Button,
  ToggleButton,
  ButtonGroup,
  Form,
} from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { FaPlay, FaStop, FaStepForward, FaStepBackward } from 'react-icons/fa';
import { AiFillSetting } from 'react-icons/ai';
import { BiHelpCircle } from 'react-icons/bi';
import React, { useCallback, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PageContext } from './context';
import SettingModal from './SettingModal';
import HelpModal from './HelpModal';
import CONSTANT from '../utils/CONSTANTS';

function PlayMenu({
  imageNames,
  // setImageURLs,
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
}) {
  const { currentPage, setCurrentPage } = useContext(PageContext);
  const [sec, setSec] = useState(0.01);
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
      let tmpIndex = 0;
      if (intervalRef.current !== null) {
        return;
      }
      // eslint-disable-next-line no-param-reassign
      intervalRef.current = setInterval(() => {
        if (tmpIndex === array.length - 1) {
          tmpIndex = 0;
          setCurrentPage(array[0]);
        } else {
          tmpIndex += 1;
          setCurrentPage(array[tmpIndex]);
        }
      }, sec);
    },
    [sec],
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
  }, [start, next, back]);

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
      <Container fluid>
        <Col md={1}>
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
                <IconContext.Provider
                  // eslint-disable-next-line react/jsx-no-constructed-context-values
                  value={{ color: CONSTANT.defaultBtnColor }}
                >
                  {play ? (
                    <FaStop size={CONSTANT.iconSize} />
                  ) : (
                    <FaPlay size={CONSTANT.iconSize} />
                  )}
                </IconContext.Provider>
              </Button>
            </Nav.Item>
            <Nav.Item className="text-center d-flex m-0">
              <Button
                variant="light"
                onClick={() => {
                  onClickBack();
                }}
              >
                <IconContext.Provider
                  // eslint-disable-next-line react/jsx-no-constructed-context-values
                  value={{ color: CONSTANT.defaultBtnColor }}
                >
                  <FaStepBackward size={CONSTANT.iconSize} />
                </IconContext.Provider>
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
                <IconContext.Provider
                  // eslint-disable-next-line react/jsx-no-constructed-context-values
                  value={{ color: CONSTANT.defaultBtnColor }}
                >
                  <FaStepForward size={CONSTANT.iconSize} />
                </IconContext.Provider>
              </Button>
            </Nav.Item>
            <Nav.Item className="d-flex">
              <Form.Control
                as="select"
                onChange={(v) => {
                  setSec(parseFloat(v.target.value));
                }}
              >
                <option value="10">0.01</option>
                <option value="20">0.02</option>
                <option value="50">0.05</option>
                <option value="100">0.10</option>
                <option value="500">0.50</option>
              </Form.Control>
              <Form.Text style={{ margin: 'auto 0', marginLeft: '5px' }}>
                sec
              </Form.Text>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md={9} className="d-flex">
          <ButtonGroup className="flex-grow-1" style={{ margin: 'auto 0' }}>
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
                  variant="outline-secondary"
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
          <ButtonGroup
            className="justify-content-end"
            style={{ marginLeft: '8rem', marginRight: '10px' }}
          >
            <Button variant="light" onClick={() => setSettingModalShow(true)}>
              <IconContext.Provider
                // eslint-disable-next-line react/jsx-no-constructed-context-values
                value={{ color: CONSTANT.defaultBtnColor }}
              >
                <AiFillSetting size={CONSTANT.iconSize} />
              </IconContext.Provider>
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
            />
            <Button variant="light" onClick={() => setHelpModalShow(true)}>
              <IconContext.Provider
                // eslint-disable-next-line react/jsx-no-constructed-context-values
                value={{ color: CONSTANT.defaultBtnColor }}
              >
                <BiHelpCircle size={CONSTANT.iconSize} />
              </IconContext.Provider>
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
        </Col>
      </Container>
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
};

PlayMenu.defaultProps = {
  setDefaultZoomRate: () => {},
  defaultZoomRate: 0,
};

export default PlayMenu;
