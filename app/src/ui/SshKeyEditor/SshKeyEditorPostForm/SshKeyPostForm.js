
import React from 'react';
import {Formik} from "formik";
import * as Yup from "yup";
import {useDispatch} from "react-redux";
import { httpConfig } from '../../../utils/http-config'
import { SshKeyPostFormContent } from './SshKeyPostFormContent'
import { fetchSshKeys} from '../../../store/key'

export const SshKeyPostForm = () => {

  const dispatch = useDispatch()

  const validator = Yup.object().shape({
    // a match parameter should be added to check for a valid ed25519 ssh key.
    key: Yup.string().required("A valid ssh key is required")
  })


  //the initial values object defines what the request payload is.
  const keyObject = {
    key: ""

  };

  const postSshKey = (values, {resetForm, setStatus}) => {
    httpConfig.post("/apis/ssh-key-editor/", values)
      .then(reply => {
        let {message, type} = reply;
        setStatus({message, type});
        if(reply.status === 200 ) {
          resetForm();
          dispatch(fetchSshKeys())
        }
        setStatus({message, type});
      })
      .catch(() => {
        console.error("Error connecting to the server")
      });
  };

  return (
    <>
      <Formik
        initialValues={keyObject}
        onSubmit={postSshKey}
        validationSchema={validator}
      >
        {SshKeyPostFormContent}
      </Formik>
    </>
  )
};