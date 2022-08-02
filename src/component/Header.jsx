import React from 'react';
import { Navbar, Nav, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function Header() {
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
        {/* <Nav className="me-auto"> */}
        <Nav className=".mt-2">
          <NavLink
            to="/"
            // className={(navData) =>
            //   navData.isActive ? 'active' : 'not-active'
            // }
            style={{
              textDecoration: 'none',
              color: 'white',
              marginLeft: 100,
              textAlign: 'center',
            }}
          >
            <h3
              className={(navData) =>
                navData.isActive ? 'active' : 'not-active'
              }
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
            }}
          >
            <h3
              // className="active-test"
              style={{ fontSize: '22px', margin: 0, marginTop: '20px' }}
            >
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
              textAlign: 'center',
            }}
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
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '22px', margin: 0, marginTop: '20px' }}>
              レポート
            </h3>
          </NavLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
