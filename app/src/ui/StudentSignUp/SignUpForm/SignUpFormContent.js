import React from 'react'
import { Form, FormControl, InputGroup } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FormDebugger } from '../../shared/components/FormDebugger'
import { Field } from 'formik'

export const SignUpFormContent = (props) => {

  const {
    setFieldValue,
    status,
    values,
    errors,
    touched,
    dirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset
  } = props;
  return (
    <>
      <Form className="py-3 mb-3" onSubmit={handleSubmit}>
        <h2 className="py-1"> Sign In</h2>
        <Form.Group>
          <Form.Label>username</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text >
                <FontAwesomeIcon icon="envelope"/>
              </InputGroup.Text>
            </InputGroup.Prepend>

            <FormControl
              placeholder=" CNM Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
              name="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </InputGroup>
          <Form.Text className="text-muted">
            This is the same as your CNM username.
          </Form.Text>
          {
            errors.username && touched.username && (
              <div className="alert alert-danger my-2">
                {errors.username}
              </div>
            )

          }
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text >
                <FontAwesomeIcon icon="key"/>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type="password"
              placeholder="password"
              aria-label="password"
              aria-describedby="basic-addon1"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
          </InputGroup>
          <Form.Text className="text-muted">
            This is the same as your CNM Password.
          </Form.Text>
          {
            errors.password && touched.password && (
              <div className=" my-2 alert alert-danger">
                {errors.password}
              </div>
            )

          }
        </Form.Group>
        <div className="form-group">
          <div className="input-group">
            <div className=" form-check">
              <Form.Check type="checkbox" className="form-check-input" name="toggle"  onClick={() =>{
                setFieldValue("toggle", true)
              }}/>
              <label className="form-check-label">
                By checking this box, I certify that I have signed up for the Deep Dive Coding Fullstack
                Bootcamp.
              </label>
            </div>
          </div>
          {
            errors.toggle && touched.toggle && (
              <div className="alert alert-danger my-2">
                {errors.toggle}
              </div>
            )

          }
        </div>
        <hr/>
        <button className="btn btn-lg btn-info" type="submit">&nbsp;Sign In</button>
        &nbsp;
        <button className="btn btn-lg btn-warning" type="reset"
                onClick={handleReset}>{/* Font Aweosme Goes Here*/} &nbsp;Reset
        </button>
      </Form>
      {status && (<div className={status.type}>{status.message}</div>)}
    </>
  )
}