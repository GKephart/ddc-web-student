import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import logo from "../../imgs/logo.png"
import { Link } from 'react-router-dom'
import { httpConfig } from '../../../../utils/http-config'
import { useDispatch } from 'react-redux'
import { getAuth } from '../../../../store/auth'

export function StudentNavBar () {
  const dispatch = useDispatch()
  return(

    <>
      <Navbar bg="primary" expand="lg" variant="dark">
        <Navbar.Brand> <img src={logo} alt="Deep Dive Coding Fullstack logo"/></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Link to="/" className="nav-link">
             Home
            </Link>
            <Nav.Link onClick={ ()=> {httpConfig.get('/apis/sign-out/').then(reply => {
              if (reply.status === 200) {
                window.localStorage.removeItem('authorization')
                dispatch(getAuth(null))
                window.location = '/'
              }
            })}}>Sign Out</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )

}