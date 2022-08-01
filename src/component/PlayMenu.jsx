import {
  Navbar,
  Nav,
  Container,
  Col,
  Button,
  ToggleButton,
  ButtonGroup,
  Form,
  Spinner,
} from 'react-bootstrap';
import { FaPlay, FaStop, FaStepForward, FaStepBackward } from 'react-icons/fa';
import { AiFillSetting } from 'react-icons/ai';
import { BiHelpCircle } from 'react-icons/bi';
import React, { useCallback, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PageContext, StarPositionContext } from './context';
import SettingModal from './SettingModal';
import HelpModal from './HelpModal';

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
  isManual,
  disable,
  setDisable,
  setStarModalShow,
  originalStarPos,
  handleClick,
  setIsAutoSave,
  isAutoSave,
  loading,
  handleNavigate,
  setOriginalStarPos,
  setSetting,
}) {
  const { currentPage, setCurrentPage } = useContext(PageContext);
  const [sec, setSec] = useState(0.01);
  const [play, setPlay] = useState(false);
  const [settingModalShow, setSettingModalShow] = useState(false);
  const [helpModalShow, setHelpModalShow] = useState(false);
  const [radioValue, setRadioValue] = useState('1');
  const { starPos, setStarPos } = useContext(StarPositionContext);
  const [index, setIndex] = useState(0);
  // const [subImages, setSubImages] = useState([]);

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
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Col md={3}>
          <Nav>
            <Nav.Item className="text-center d-flex m-1">
              <Button
                variant="light"
                onClick={() => {
                  if (!play) {
                    onClickBlinkStart(imageNames);
                  } else {
                    onClickBlinkStop();
                  }
                }}
              >
                {play ? <FaStop size={30} /> : <FaPlay size={30} />}
              </Button>
            </Nav.Item>
            <Nav.Item className="text-center d-flex m-1">
              <Button
                variant="light"
                onClick={() => {
                  onClickBack();
                }}
              >
                <FaStepBackward size={30} />
              </Button>
            </Nav.Item>
            <Nav.Item className="text-center d-flex m-0">
              <Button
                variant="light"
                onClick={() => {
                  onClickNext();
                }}
              >
                <FaStepForward size={30} />
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
              <Form.Text style={{ margin: 'auto 0' }}>sec</Form.Text>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md={9} className="d-flex">
          <ButtonGroup className="flex-grow-1">
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
                  value={name.name}
                  key={name.name}
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
          <ButtonGroup className="mx-5">
            <Button variant="light" onClick={() => setSettingModalShow(true)}>
              <AiFillSetting size={30} />
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
              <BiHelpCircle size={30} />
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

          {isManual ? (
            <div>
              {loading ? (
                <Spinner size="md" animation="border" />
              ) : (
                <>
                  <Button
                    variant="success"
                    onClick={() => {
                      if (disable) {
                        setStarPos(originalStarPos);
                      } else {
                        document.getElementById('wrapper-coias').focus();
                        handleClick();
                      }
                      setDisable(!disable);
                    }}
                    size="md"
                  >
                    {disable ? 'やり直す' : '再描画'}
                  </Button>
                  <Button
                    variant="danger"
                    size="md"
                    disabled={!disable}
                    onClick={() => handleNavigate()}
                  >
                    手動測定終了
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="align-self-center">
              <Button
                variant="success"
                onClick={() => {
                  if (disable) {
                    setOriginalStarPos(starPos);
                    setStarModalShow(true);
                  } else {
                    setStarPos(originalStarPos);
                  }
                  setDisable(!disable);
                }}
                size="md"
              >
                {disable ? '再描画' : 'やり直す'}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleClick();
                }}
                disabled={disable}
                size="md"
              >
                探索終了
              </Button>
            </div>
          )}
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
  isManual: PropTypes.bool,
  disable: PropTypes.bool,
  setDisable: PropTypes.func,
  setStarModalShow: PropTypes.func,
  originalStarPos: PropTypes.objectOf(PropTypes.object).isRequired,
  handleClick: PropTypes.func,
  setIsAutoSave: PropTypes.func.isRequired,
  handleNavigate: PropTypes.func,
  isAutoSave: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  setOriginalStarPos: PropTypes.func,
  setSetting: PropTypes.func.isRequired,
};

PlayMenu.defaultProps = {
  setDefaultZoomRate: () => {},
  defaultZoomRate: 0,
  isManual: false,
  disable: true,
  setDisable: () => {},
  setStarModalShow: () => {},
  handleClick: () => {},
  loading: false,
  handleNavigate: () => {},
  setOriginalStarPos: () => {},
};

export default PlayMenu;
