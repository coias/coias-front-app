import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">
        <img
          alt=""
          src="/icon.png"
          width="60"
          height="60"
          className="d-inline-block align-top"
        />
        Come On!Impacting Asteroid
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link>
            <h3>
              <Link to="/ExplorePrepare">探索準備</Link>
            </h3>
          </Nav.Link>
          <Nav.Link>
            <h3>
              <Link to="/COIAS">探索/再測定</Link>
            </h3>
          </Nav.Link>
          <Nav.Link>
            <h3>
              <Link to="/Report">レポート</Link>
            </h3>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
