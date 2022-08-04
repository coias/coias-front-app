import React, { useContext, useState, useCallback } from 'react';
import { Navbar, Nav, Row, Col, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ConfirmationModal from './ConfirmationModal';
import { ModeStatusContext } from './context';

function Header({ setMenunames }) {
  const { modeStatus, setModeStatus } = useContext(ModeStatusContext);
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/');
  };
  const [show, setShow] = useState(false);
  const checkIsStatusUpdated = useCallback(
    () =>
      !Object.keys(modeStatus).some((key) => {
        console.log(modeStatus[key]);
        return modeStatus[key];
      }),
    [modeStatus],
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <Navbar
      className="color-nav"
      variant="dark"
      style={{ padding: 0, paddingTop: '5px' }}
    >
      <Navbar.Brand className="px-3">
        <Row>
          <Col>
            <img
              alt=""
              src="/icon.png"
              width="60"
              height="60"
              className="d-inline-block align-top"
            />
          </Col>
          <Col>
            <Row>
              <div
                className="p-0 m-0"
                style={{ color: '#28297E', fontSize: '15px' }}
              >
                Come On! Impacting ASteroid
              </div>
            </Row>
            <Row>
              <div
                className="p-0 m-0"
                style={{ color: '#28297E', fontSize: '25px' }}
              >
                COIAS
              </div>
            </Row>
          </Col>
        </Row>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className=".mt-2">
          <NavLink
            to="/"
            className={(navData) =>
              navData.isActive ? 'active' : 'not-active'
            }
            style={{
              textDecoration: 'none',
              color: 'white',
              marginLeft: 50,
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                fontSize: '22px',
                margin: 0,
                marginTop: '20px',
              }}
            >
              探索準備
            </h3>
          </NavLink>
          <NavLink
            to="/COIAS"
            className={(navData) =>
              navData.isActive ? 'active' : 'not-active'
            }
            style={{
              textDecoration: 'none',
              color: 'white',
              marginLeft: 80,
              textAlign: 'center',
              opacity: modeStatus.COIAS ? 1 : 0.3,
            }}
            onClick={modeStatus.COIAS ? () => {} : (e) => e.preventDefault()}
          >
            <h3 style={{ fontSize: '22px', margin: 0, marginTop: '20px' }}>
              探索/再描画
            </h3>
          </NavLink>
          <NavLink
            to="/ManualMeasurement"
            className={(navData) =>
              navData.isActive ? 'active' : 'not-active'
            }
            style={{
              textDecoration: 'none',
              color: 'white',
              marginLeft: 80,
              opacity: modeStatus.Manual ? 1 : 0.3,
            }}
            onClick={modeStatus.Manual ? () => {} : (e) => e.preventDefault()}
          >
            <h3 style={{ fontSize: '22px', margin: 0, marginTop: '20px' }}>
              手動測定
            </h3>
          </NavLink>
          <NavLink
            to="/Report"
            className={(navData) =>
              navData.isActive ? 'active' : 'not-active'
            }
            style={{
              textDecoration: 'none',
              color: 'white',
              marginLeft: 80,
              opacity: modeStatus.Report ? 1 : 0.3,
            }}
            onClick={modeStatus.Report ? () => {} : (e) => e.preventDefault()}
          >
            <h3 style={{ fontSize: '22px', margin: 0, marginTop: '20px' }}>
              レポート
            </h3>
          </NavLink>
        </Nav>
      </Navbar.Collapse>
      <Button
        onClick={() => {
          setShow(true);
        }}
        variant="light"
        style={{
          marginRight: 30,
          color: 'white',
          background: 'none',
          padding: '7px 25px',
        }}
        disabled={checkIsStatusUpdated()}
      >
        Clear
      </Button>
      <ConfirmationModal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        onClickYes={() => {
          setModeStatus({
            COIAS: false,
            Manual: false,
            Report: false,
          });
          handleNavigate();
          setShow(false);
          setMenunames((prevMenunames) =>
            prevMenunames.map((items) => {
              const objCopy = { ...items };
              objCopy.done = false;
              return objCopy;
            }),
          );
        }}
        confirmMessage="状態を全てクリアしますか？"
      />
    </Navbar>
  );
}

export default Header;

Header.propTypes = {
  setMenunames: PropTypes.func.isRequired,
};
