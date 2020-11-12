import React from 'react';
import {httpConfig} from "../../../utils/http-config";
import {Formik} from "formik";
import * as Yup from "yup";
import { SignInContent } from './SignInContent'
import { useDispatch } from 'react-redux'
import  jwtDecode from 'jwt-decode'
import { getAuth } from '../../../store/auth'

export const SignInForm = () => {

   const dispatch = useDispatch()

  const validator = Yup.object().shape({
    username: Yup.string()
      .required('email is required'),
   password: Yup.string()
      .required("Password is required")
  });


  //the initial values object defines what the request payload is.
  const signIn = {
    username: "",
   password: "",
  };

  const submitSignIn = (values, {resetForm, setStatus}) => {
    httpConfig.post("/apis/sign-in/", values)
      .then(reply => {
        let {message, type} = reply;
        setStatus({message, type});
        if(reply.status === 200 && reply.headers["authorization"]) {

          window.localStorage.removeItem("authorization");
          window.localStorage.setItem("authorization", reply.headers["authorization"]);
          resetForm();
          let jwtToken = jwtDecode(reply.headers["authorization"])
          dispatch(getAuth(jwtToken))
        }
        setStatus({message, type});
      });
  };

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
};