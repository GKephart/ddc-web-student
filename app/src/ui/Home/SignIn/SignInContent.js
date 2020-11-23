import React from 'react'
import { Form, FormControl, InputGroup } from 'react-bootstrap'
import { FormDebugger } from '../../shared/components/FormDebugger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const SignInContent = (props) => {

  const {
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
      <h2 className="pt-2 text-center"> Sign In</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>username</Form.Label>
          <InputGroup className="mb-3">
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
              <div className="alert alert-danger">
                {errors.username}
              </div>
            )

          }
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <InputGroup className="mb-3">
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
              <div className="alert alert-danger">
                {errors.password}
              </div>
            )

          }
        </Form.Group>

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