import React from 'react';
import { httpConfig } from "../../../utils/http-config"
import { Formik } from "formik";
import * as Yup from "yup";
import { SignUpFormContent } from './SignUpFormContent'

export const SignUpForm = () => {
  const validator = Yup.object().shape({
    username: Yup.string()
      .required('email is required'),
    password: Yup.string()
      .required("Password is required"),
    toggle: Yup.bool().oneOf([true], 'You must verify that you are a current Deep Dive Coding Fullstack student')
  });

  //the initial values object defines what the request payload is.
  const signUp = {
    username: "",
    password: "",
    toggle: false
  };

  const submitSignUp = (values, {resetForm, setStatus}) => {
    const {username, password, toggle} = values

    httpConfig.post("/apis/sign-in/", {username, password})
      .then((reply) => {
        let {status, message, type} = reply;
        setStatus({message, type});
        if (status === 200) {
          httpConfig.post("/apis/sign-up/?class=invite", {toggle})
            .then((reply) => {
              let {status, message, type} = reply;
              if (status === 200) {
                resetForm()
                setStatus({message, type})
              } else {
                setStatus({message, type})
              }
            })
        } else {
          setStatus({message, type});
        }
      });
  };

  return (
    <>
      <Formik
        initialValues={signUp}
        onSubmit={submitSignUp}
        validationSchema={validator}
      >
        {SignUpFormContent}
      </Formik>
    </>
  )
};