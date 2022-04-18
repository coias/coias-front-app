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
import { FaPlay, FaStop, FaStepForward, FaStepBackward } from 'react-icons/fa';
import { AiFillSetting } from 'react-icons/ai';
import { BiHelpCircle } from 'react-icons/bi';
import React, { useCallback, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { PageContext } from './context';
import SettingModal from './SettingModal';
import HelpModal from './HelpModal';

function PlayMenu({ imageNames, setImageURLs, intervalRef }) {
  const { currentPage, setCurrentPage } = useContext(PageContext);
  const [sec, setSec] = useState(0.01);
  const [play, setPlay] = useState(false);
  const [settingModalShow, setSettingModalShow] = useState(false);
  const [helpModalShow, setHelpModalShow] = useState(false);
  const [radioValue, setRadioValue] = useState('1');

  const onClickNext = () => {
    if (currentPage === 4) setCurrentPage(0);
    else setCurrentPage(currentPage + 1);
  };

  const onClickBack = () => {
    if (currentPage === 0) setCurrentPage(4);
    else setCurrentPage(currentPage - 1);
  };

  const onClickBlinkStart = useCallback(() => {
    setPlay(true);
    if (intervalRef.current !== null) {
      return;
    }
    // eslint-disable-next-line no-param-reassign
    intervalRef.current = setInterval(() => {
      setCurrentPage((c) => {
        if (c === 4) return 0;
        return c + 1;
      });
    }, sec);
  }, [sec]);

  const onClickBlinkStop = useCallback(() => {
    setPlay(false);
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    // eslint-disable-next-line no-param-reassign
    intervalRef.current = null;
  }, []);

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
                    onClickBlinkStart();
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
        <Col md={9}>
          <ButtonGroup aria-label="Basic example">
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
                >
                  {name.name}
                </ToggleButton>
              ))}
            <Button
              variant="light"
              onClick={() => setSettingModalShow(true)}
              className="mx-3"
            >
              <AiFillSetting size={30} />
            </Button>
            <SettingModal
              show={settingModalShow}
              onHide={() => {
                setSettingModalShow(false);
                setImageURLs(JSON.parse(JSON.stringify(imageNames)));
              }}
              title="表示設定"
              imageURLs={imageNames}
            />
            <Button variant="light" onClick={() => setHelpModalShow(true)}>
              <BiHelpCircle size={30} />
            </Button>
            <HelpModal
              show={helpModalShow}
              onHide={() => {
                setHelpModalShow(false);
                setImageURLs(JSON.parse(JSON.stringify(imageNames)));
              }}
              title="表示設定"
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
  setImageURLs: PropTypes.func.isRequired,
  intervalRef: PropTypes.func.isRequired,
};

export default PlayMenu;
