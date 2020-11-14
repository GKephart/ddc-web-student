import React from "react"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { Col } from 'react-bootstrap'
import { SignInForm } from './SignIn/SignInForm'
import { UnauthenticatedNavBar } from '../shared/components/NavBar/UnauthenicatedNavBar'

export const Home = () => {
  return (
    <>
      <UnauthenticatedNavBar/>
      <Container>
        <Row>
          <Col md={{span: 6, offset: 3}}>
            <SignInForm/>
          </Col>
        </Row>
      </Container>
    </>
  )
}