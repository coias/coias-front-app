import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';

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
          <NavLink
            to="/"
            className={(navData) => (navData.isActive ? 'active' : '')}
            style={{ textDecoration: 'none', color: 'gray' }}
          >
            <h3 style={{ paddingLeft: 13 }}>探索準備</h3>
          </NavLink>
          <Link to="/COIAS" style={{ textDecoration: 'none', color: 'gray' }}>
            <h3 style={{ paddingLeft: 13 }}>探索/再測定</h3>
          </Link>
          <Link to="/Report" style={{ textDecoration: 'none', color: 'gray' }}>
            <h3 style={{ paddingLeft: 13 }}>レポート</h3>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
