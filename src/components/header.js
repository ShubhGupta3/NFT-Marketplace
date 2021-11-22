import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Nav, Container} from 'react-bootstrap';

function Header() {
    return (
      <>
        <Navbar bg="dark" variant="dark">
          <Container>
          <Navbar.Brand href="home">Market</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="create">Create Item</Nav.Link>
            <Nav.Link href="dashboard">Creator Dashboard</Nav.Link>
            <Nav.Link href="assets">My Assets</Nav.Link>
          </Nav>
          </Container>
        </Navbar>
      </>
    );
  }
  
  export default Header;