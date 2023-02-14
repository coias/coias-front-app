import PropTypes from 'prop-types';
import React, { useCallback, useContext, useState } from 'react';
import { Button, Col, Nav, Navbar, Offcanvas, Row } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { ModeStatusContext } from '../functional/context';
import ConfirmationModal from './ConfirmationModal';

function Header({ setMenunames, setFileNames }) {
  const { modeStatus, setModeStatus } = useContext(ModeStatusContext);
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/');
  };
  const [show, setShow] = useState(false);
  const checkIsStatusUpdated = useCallback(
    () => !Object.keys(modeStatus).some((key) => modeStatus[key]),
    [modeStatus],
  );

  return (
    <Navbar expand="lg" className="color-nav" style={{ margin: 0, padding: 0 }}>
      <Navbar.Brand>
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
          <Col className="color-nav-title">
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
      <Nav className="nav-disappear">
        <NavLink to="/">
          <h3 className="nav-content">画像選択</h3>
        </NavLink>
        <NavLink
          to="/ExplorePrepare"
          className={(navData) => (navData.isActive ? 'active' : 'not-active')}
          style={{
            opacity: modeStatus.ExplorePrepare ? 1 : 0.3,
          }}
          onClick={
            modeStatus.ExplorePrepare ? () => {} : (e) => e.preventDefault()
          }
        >
          <h3 className="nav-content">探索準備</h3>
        </NavLink>
        <NavLink
          to="/COIAS"
          className={(navData) => (navData.isActive ? 'active' : 'not-active')}
          style={{
            opacity: modeStatus.COIAS ? 1 : 0.3,
          }}
          onClick={modeStatus.COIAS ? () => {} : (e) => e.preventDefault()}
        >
          <h3 className="nav-content">探索/再描画</h3>
        </NavLink>
        <NavLink
          to="/ManualMeasurement"
          className={(navData) => (navData.isActive ? 'active' : 'not-active')}
          style={{
            opacity: modeStatus.Manual ? 1 : 0.3,
          }}
          onClick={modeStatus.Manual ? () => {} : (e) => e.preventDefault()}
        >
          <h3 className="nav-content">手動測定/名前修正</h3>
        </NavLink>
        <NavLink
          to="/Report"
          className={(navData) => (navData.isActive ? 'active' : 'not-active')}
          style={{
            opacity: modeStatus.Report ? 1 : 0.3,
          }}
          onClick={modeStatus.Report ? () => {} : (e) => e.preventDefault()}
        >
          <h3 className="nav-content">レポート</h3>
        </NavLink>
        <NavLink
          to="/FinalCheck"
          className={(navData) => (navData.isActive ? 'active' : 'not-active')}
          style={{
            opacity: modeStatus.FinalCheck ? 1 : 0.3,
          }}
          onClick={modeStatus.FinalCheck ? () => {} : (e) => e.preventDefault()}
        >
          <h3 className="nav-content">最終確認</h3>
        </NavLink>
      </Nav>
      <Button
        onClick={() => {
          setShow(true);
        }}
        variant="light"
        disabled={checkIsStatusUpdated()}
        className="nav-disappear"
      >
        探索終了
      </Button>
      <Navbar.Offcanvas placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <Row>
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
            </Row>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body id="basic-navbar-nav">
          <Nav>
            <NavLink
              to="/"
              className={(navData) =>
                navData.isActive ? 'active' : 'not-active'
              }
            >
              <h3 className="nav-content">探索準備</h3>
            </NavLink>
            <NavLink
              to="/COIAS"
              className={(navData) =>
                navData.isActive ? 'active' : 'not-active'
              }
              style={{
                opacity: modeStatus.COIAS ? 1 : 0.3,
              }}
              onClick={modeStatus.COIAS ? () => {} : (e) => e.preventDefault()}
            >
              <h3 className="nav-content">探索/再描画</h3>
            </NavLink>
            <NavLink
              to="/ManualMeasurement"
              className={(navData) =>
                navData.isActive ? 'active' : 'not-active'
              }
              style={{
                opacity: modeStatus.Manual ? 1 : 0.3,
              }}
              onClick={modeStatus.Manual ? () => {} : (e) => e.preventDefault()}
            >
              <h3 className="nav-content">手動測定/名前修正</h3>
            </NavLink>
            <NavLink
              to="/Report"
              className={(navData) =>
                navData.isActive ? 'active' : 'not-active'
              }
              style={{
                opacity: modeStatus.Report ? 1 : 0.3,
              }}
              onClick={modeStatus.Report ? () => {} : (e) => e.preventDefault()}
            >
              <h3 className="nav-content">レポート</h3>
            </NavLink>
            <NavLink
              to="/FinalCheck"
              className={(navData) =>
                navData.isActive ? 'active' : 'not-active'
              }
              style={{
                opacity: modeStatus.FinalCheck ? 1 : 0.3,
              }}
              onClick={
                modeStatus.FinalCheck ? () => {} : (e) => e.preventDefault()
              }
            >
              <h3 className="nav-content">最終確認</h3>
            </NavLink>
          </Nav>
          <Button
            onClick={() => {
              setShow(true);
            }}
            variant="light"
            disabled={checkIsStatusUpdated()}
          >
            探索終了
          </Button>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
      <ConfirmationModal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        onClickYes={() => {
          setFileNames(['ファイルを選択してください']);
          setModeStatus({
            ExplorePrepare: false,
            COIAS: false,
            Manual: false,
            Report: false,
            FinalCheck: false,
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
  setFileNames: PropTypes.func.isRequired,
};
