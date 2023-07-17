import React from 'react'
import { httpConfig } from '../../../utils/http-config'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { SignInContent } from './SignInContent'
import { useDispatch } from 'react-redux'
import jwtDecode from 'jwt-decode'
import { getAuth } from '../../../store/auth'
import { useNavigate } from 'react-router-dom'

export const SignInForm = () => {
  const history = useNavigate()
  const dispatch = useDispatch()

  const validator = Yup.object().shape({
    username: Yup.string()
      .required('username is required'),
    password: Yup.string()
      .required('Password is required')
  })

  // the initial values object defines what the request payload is.
  const signIn = {
    username: '',
    password: ''
  }

  const submitSignIn = (values, { resetForm, setStatus }) => {
    httpConfig.post('/apis/sign-in/', values)
      .then(reply => {
        const { message, type } = reply
        setStatus({ message, type })
        if (reply.status === 200 && reply.headers.authorization) {
          window.localStorage.removeItem('authorization')
          window.localStorage.setItem('authorization', reply.headers.authorization)
          resetForm()
          const jwtToken = jwtDecode(reply.headers.authorization)
          dispatch(getAuth(jwtToken))
          setTimeout(() => {
            history('/ssh-key-editor')
          }, 750)
        }
        setStatus({ message, type })
      })
  }

  return (
    <>
      <Formik
        initialValues={signIn}
        onSubmit={submitSignIn}
        validationSchema={validator}
      >
        {SignInContent}
      </Formik>
    </>
  )
}
