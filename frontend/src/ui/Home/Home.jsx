import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { Col } from 'react-bootstrap'
import { SignInForm } from './SignIn/SignInForm.jsx'
import { NavBar } from '../shared/components/NavBar/NavBar.jsx'

export const Home = () => {
  return (
    <>
     <NavBar />
      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <SignInForm />
          </Col>
        </Row>
      </Container>
    </>
  )
}
