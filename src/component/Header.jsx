import React from 'react';
import { Navbar, Nav, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { MdOutlineLockOpen, MdOutlineLock } from 'react-icons/md';

function Header() {
  const isLocked = true;
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <Navbar bg="dark" variant="dark">
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
            <div style={{ color: 'white' }}>
              Come On!
              <br />
              Impacting Asteroid
            </div>
          </Col>
        </Row>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <NavLink
            to="/"
            className={(navData) =>
              navData.isActive ? 'active' : 'not-active'
            }
            style={{
              textDecoration: 'none',
              color: 'gray',
            }}
          >
            <h3 style={{ paddingLeft: 13 }}>探索準備</h3>
          </NavLink>
          <NavLink
            to="/COIAS"
            className={(navData) =>
              navData.isActive ? 'active' : 'not-active'
            }
            style={{ textDecoration: 'none', color: 'gray' }}
          >
            <h3 style={{ paddingLeft: 35 }}>探索/再描画</h3>
          </NavLink>
          <NavLink
            to="/ManualMeasurement"
            className={(navData) =>
              navData.isActive ? 'active' : 'not-active'
            }
            style={{ textDecoration: 'none', color: 'gray' }}
          >
            <h3 style={{ paddingLeft: 35 }}>手動測定</h3>
          </NavLink>
          <NavLink
            to="/Report"
            className={(navData) =>
              navData.isActive ? 'active' : 'not-active'
            }
            style={{ textDecoration: 'none', color: 'gray' }}
            onClick={(e) => e.preventDefault() /* do nothing. */}
          >
            <div className="d-flex" style={{ paddingLeft: 35 }}>
              <h3 style={{ position: 'absolute' }}>レポート</h3>
              {isLocked ? (
                <MdOutlineLock
                  size={26}
                  style={{ position: 'relative', top: -15, left: 100 }}
                />
              ) : (
                <MdOutlineLockOpen
                  size={26}
                  style={{ position: 'relative', top: -15, left: 100 }}
                />
              )}
            </div>
          </NavLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
