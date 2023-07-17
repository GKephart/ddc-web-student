import React from 'react'
import { SignUpForm } from './SignUpForm/SignUpForm'
import { NavBar } from '../shared/components/NavBar/NavBar'

export const StudentSignUp = () => {
  return (
    <>
   <NavBar />
      <div className='container'>
        <div className='row'>
          <main className=' py-3 content-main col-xs-12 col-md-9'>
            <h1 className='h2 py-2'>Sign Up for A Deep Dive Coding Fullstack Student Account</h1>
            <p>To sign up for the Deep Dive Coding Fullstack Bootcamp student account login with your myCNM username
              and password. You will get an alert in your CNM Email when your account is activated.
            </p>
            <p>To continue, certify that you are enrolled in the CNM STEMulus Deep Dive Coding class. A program
              administrator will then verify your enrollment and approve your account.
            </p>
            <hr />
            <SignUpForm />
          </main>
        </div>
      </div>
    </>
  )
}
