import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { Col } from 'react-bootstrap'
import { SignInForm } from './SignIn/SignInForm'
import { NavBar } from '../shared/components/NavBar/NavBar'

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
