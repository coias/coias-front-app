import React from 'react';
import { Navbar, Nav, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <Navbar className="color-nav" variant="dark">
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
              <div className="p-0 m-0" style={{ color: '#28297E' }}>
                Come On! Impacting ASteroid
              </div>
            </Row>
            <Row>
              <div
                className="p-0 m-0"
                style={{ color: '#28297E', fontSize: '30px' }}
              >
                COIAS
              </div>
            </Row>
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
              color: 'white',
              marginLeft: 13,
            }}
          >
            <h3>探索準備</h3>
          </NavLink>
          <NavLink
            to="/COIAS"
            className={(navData) =>
              navData.isActive ? 'active' : 'not-active'
            }
            style={{ textDecoration: 'none', color: 'white', marginLeft: 35 }}
          >
            <h3>探索/再描画</h3>
          </NavLink>
          <NavLink
            to="/ManualMeasurement"
            className={(navData) =>
              navData.isActive ? 'active' : 'not-active'
            }
            style={{ textDecoration: 'none', color: 'white', marginLeft: 35 }}
          >
            <h3>手動測定</h3>
          </NavLink>
          <NavLink
            to="/Report"
            className={(navData) =>
              navData.isActive ? 'active' : 'not-active'
            }
            style={{ textDecoration: 'none', color: 'white', marginLeft: 35 }}
          >
            <h3>レポート</h3>
          </NavLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
