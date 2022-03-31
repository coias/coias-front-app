import React from 'react';
import { Navbar, Nav, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
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
            to="/"
            className={(navData) =>
              navData.isActive ? 'not-active-no-hover' : 'not-active-no-hover'
            }
            style={{ textDecoration: 'none', color: 'gray' }}
            onClick={(e) => e.preventDefault() /* do nothing. */}
          >
            <h3 style={{ paddingLeft: 35 }}>再測定</h3>
          </NavLink>
          <NavLink
            to="/Report"
            className={(navData) =>
              navData.isActive ? 'not-active-no-hover' : 'not-active-no-hover'
            }
            style={{ textDecoration: 'none', color: 'gray' }}
            onClick={(e) => e.preventDefault() /* do nothing. */}
          >
            <h3 style={{ paddingLeft: 35 }}>レポート</h3>
          </NavLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
