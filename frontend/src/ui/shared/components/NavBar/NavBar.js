import { Nav, Navbar } from 'react-bootstrap'
import logo from '../../imgs/logo.png'
import { Link } from 'react-router-dom'
import React from 'react'
import { useDispatch } from 'react-redux'
import { httpConfig } from '../../../../utils/http-config'
import { getAuth } from '../../../../store/auth'
import { useJwtToken } from '../../useJwtToken'


export function NavBar () {
  const {authenticatedUser, isLoading} = useJwtToken()

  if(isLoading === true) {
  return   <></>
  }

  if(authenticatedUser?.isAdmin === true) {
    return <AdminNavBar/>

  }

  return <StudentNavBar authenticatedUser={ authenticatedUser}/>


}

export function StudentNavBar (props) {

  const authenticatedUser = props.authenticatedUser
  return (

    <>
      <Navbar bg='primary' expand='lg' variant='dark'>
        <Navbar.Brand> <img src={logo} alt='Deep Dive Coding Fullstack logo' /></Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>
            <Link to='/' className='nav-link'>
              Home
            </Link>
            {authenticatedUser ? <SignOutButton /> : <></>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}


export function AdminNavBar () {
  return (

    <>
      <Navbar bg='primary' expand='lg' variant='dark'>
        <Navbar.Brand> <img src={logo} alt='Deep Dive Coding Fullstack logo' /></Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>
            <Link to='/' className='nav-link'>
              Home
            </Link>
            <Link to='/admin/user-admin' className='nav-link'>
              User Admin
            </Link>
            <Link to='/admin/invite-approval' className='nav-link'>
              Invite Approval
            </Link>
            <Link to="/ssh-key-editor" className="nav-link">SSH Key Editor</Link>
            <SignOutButton />

          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export function SignOutButton() {

  const dispatch = useDispatch()

  return(
    <Nav.Link
      onClick={() => {
        httpConfig.get('/apis/sign-out/').then(reply => {
          if (reply.status === 200) {
            window.localStorage.removeItem('authorization')
            dispatch(getAuth(null))
            window.location = '/'
          }
        })
      }}
    >Sign Out
    </Nav.Link>
  )
}
