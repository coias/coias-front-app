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
import { IconContext } from 'react-icons';
import { FaPlay, FaStop, FaStepForward, FaStepBackward } from 'react-icons/fa';
import { AiFillSetting } from 'react-icons/ai';
import { BiHelpCircle } from 'react-icons/bi';
import React, { useCallback, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PageContext, StarPositionContext } from './context';
import SettingModal from './SettingModal';
import HelpModal from './HelpModal';
import btnColor from '../utils/CONSTANTS';

function PlayMenu({
  imageNames,
  setImageURLs,
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
  setOriginalStarPos,
}) {
  const { currentPage, setCurrentPage } = useContext(PageContext);
  const [sec, setSec] = useState(0.01);
  const [play, setPlay] = useState(false);
  const [settingModalShow, setSettingModalShow] = useState(false);
  const [helpModalShow, setHelpModalShow] = useState(false);
  const [radioValue, setRadioValue] = useState('1');
  const { starPos, setStarPos } = useContext(StarPositionContext);

  const onClickNext = () => {
    if (currentPage === imageNames.length - 1) setCurrentPage(0);
    else setCurrentPage(currentPage + 1);
  };

  const onClickBack = () => {
    if (currentPage === 0) setCurrentPage(imageNames.length - 1);
    else setCurrentPage(currentPage - 1);
  };

  const onClickBlinkStart = useCallback(
    (imageURLs) => {
      setPlay(true);
      if (intervalRef.current !== null) {
        return;
      }
      // eslint-disable-next-line no-param-reassign
      intervalRef.current = setInterval(() => {
        // eslint-disable-next-line consistent-return
        setCurrentPage((c) => {
          if (c === imageURLs.length - 1) {
            return 0;
          }
          return c + 1;
        });
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

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Col md={1}>
          <Nav>
            <Nav.Item className="text-center d-flex m-1">
              <Button
                variant="light"
                onClick={() => {
                  if (!play) {
                    onClickBlinkStart();
                  } else {
                    onClickBlinkStop();
                  }
                }}
              >
                <IconContext.Provider
                  // eslint-disable-next-line react/jsx-no-constructed-context-values
                  value={{ color: btnColor.defaulte }}
                >
                  {play ? <FaStop size={30} /> : <FaPlay size={30} />}
                </IconContext.Provider>
              </Button>
            </Nav.Item>
            <Nav.Item className="text-center d-flex m-1">
              <Button
                variant="light"
                onClick={() => {
                  onClickBack();
                }}
              >
                <IconContext.Provider
                  // eslint-disable-next-line react/jsx-no-constructed-context-values
                  value={{ color: btnColor.defaulte }}
                >
                  <FaStepBackward size={30} />
                </IconContext.Provider>
              </Button>
            </Nav.Item>
            <Nav.Item className="text-center d-flex m-0">
              <Button
                variant="light"
                onClick={() => {
                  onClickNext();
                }}
              >
                <IconContext.Provider
                  // eslint-disable-next-line react/jsx-no-constructed-context-values
                  value={{ color: btnColor.defaulte }}
                >
                  <FaStepForward size={30} />
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
              <Form.Text style={{ margin: 'auto 0' }}>sec</Form.Text>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md={9} className="d-flex">
          <ButtonGroup className="flex-grow-1">
            {imageNames
              .filter((img) => img.visible)
              .map((name, index) => (
                <ToggleButton
                  id={`radio-${index}`}
                  type="radio"
                  variant="outline-secondary"
                  name="radio"
                  value={name.name}
                  key={name.name}
                  checked={
                    (radioValue === name.name && currentPage === index) ||
                    currentPage === index
                  }
                  onChange={(e) => {
                    setCurrentPage(index);
                    setRadioValue(e.currentTarget.value);
                  }}
                  bsStyle="default"
                  style={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  {name.name.substr(0, 1)}
                </ToggleButton>
              ))}
          </ButtonGroup>
          <ButtonGroup className="mx-5">
            <Button variant="light" onClick={() => setSettingModalShow(true)}>
              <IconContext.Provider
                // eslint-disable-next-line react/jsx-no-constructed-context-values
                value={{ color: btnColor.defaulte }}
              >
                <AiFillSetting size={30} />
              </IconContext.Provider>
            </Button>
            <SettingModal
              show={settingModalShow}
              onHide={() => {
                setSettingModalShow(false);
                setImageURLs(JSON.parse(JSON.stringify(imageNames)));
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
                value={{ color: btnColor.defaulte }}
              >
                <BiHelpCircle size={30} />
              </IconContext.Provider>
            </Button>
            <HelpModal
              show={helpModalShow}
              onHide={() => {
                setHelpModalShow(false);
                setImageURLs(JSON.parse(JSON.stringify(imageNames)));
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
                <Button
                  variant="success"
                  onClick={() => {
                    if (disable) {
                      setStarPos(originalStarPos);
                    } else {
                      handleClick();
                    }
                    setDisable(!disable);
                  }}
                  size="md"
                >
                  {disable ? 'やり直す' : '再描画'}
                </Button>
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
            </div>
          )}
        </Col>
      </Container>
    </Navbar>
  );
}

PlayMenu.propTypes = {
  imageNames: PropTypes.arrayOf(PropTypes.object).isRequired,
  setImageURLs: PropTypes.func.isRequired,
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
  isAutoSave: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  setOriginalStarPos: PropTypes.func,
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
  setOriginalStarPos: () => {},
};

export default PlayMenu;
