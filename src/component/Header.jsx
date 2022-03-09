import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const Header = function () {
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
          <Nav.Link href="/">
            <h3>探索準備</h3>
          </Nav.Link>
          <Nav.Link href="/COIAS">
            <h3>探索/再測定</h3>
          </Nav.Link>
          <Nav.Link href="/Report">
            <h3>レポート</h3>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
