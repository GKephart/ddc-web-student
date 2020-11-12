import React from "react"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { SignInContent } from './SignIn/SignInContent'
import { Col } from 'react-bootstrap'
import { SignInForm } from './SignIn/SignInForm'

export const Home = () => {
  return (
   <Container>
     <Row>
       <Col md={{span:6, offset:3}}>
       <SignInForm/>
       </Col>
     </Row>
   </Container>
  )
}