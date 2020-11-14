import React from 'react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import logo from "../../imgs/logo.png"
import { Link } from 'react-router-dom'

export function UnauthenticatedNavBar () {
  return(
    <>
      <Navbar bg="primary" expand="lg" variant="dark">
        <Navbar.Brand> <img src={logo} alt="Deep Dive Coding Fullstack logo"/></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )

}