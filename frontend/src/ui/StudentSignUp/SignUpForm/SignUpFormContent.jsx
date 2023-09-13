import React from 'react'
import { Form, FormControl, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const SignUpFormContent = (props) => {
  const {
    setFieldValue,
    status,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset
  } = props
  return (
    <>
      <Form className='py-3 mb-3' onSubmit={handleSubmit}>
        <h2 className='py-1 h3'> Sign Up Form</h2>
        <Form.Group>
          <Form.Label>username</Form.Label>
          <InputGroup className='mb-2'>
              <InputGroup.Text>
                <FontAwesomeIcon icon='envelope' />
              </InputGroup.Text>
            <FormControl
              placeholder=' CNM Username'
              aria-label='Username'
              aria-describedby='basic-addon1'
              name='username'
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </InputGroup>
          <Form.Text className='text-muted'>
            This is the same as your CNM username.
          </Form.Text>
          {
            errors.username && touched.username && (
              <div className='alert alert-danger my-2'>
                {errors.username}
              </div>
            )

          }
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <InputGroup className='mb-2'>

              <InputGroup.Text>
                <FontAwesomeIcon icon='key' />
              </InputGroup.Text>
            <FormControl
              type='password'
              placeholder='password'
              aria-label='password'
              aria-describedby='basic-addon1'
              name='password'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
          </InputGroup>
          <Form.Text className='text-muted'>
            This is the same as your CNM Password.
          </Form.Text>
          {
            errors.password && touched.password && (
              <div className=' my-2 alert alert-danger'>
                {errors.password}
              </div>
            )

          }
        </Form.Group>
        <div className='form-group'>
          <div className='input-group'>
              <Form.Check
                name='toggle'
                onClick={() => {
                  setFieldValue('toggle', true)
                }}
                label={" By checking this box, I certify that I have signed up for the Deep Dive Coding Fullstack\n" +
                  "                Bootcamp."}
              />

          </div>
          {
            errors.toggle && touched.toggle && (
              <div className='alert alert-danger my-2'>
                {errors.toggle}
              </div>
            )

          }
        </div>
        <hr />
        <button className='btn btn-lg btn-info' type='submit'>&nbsp;Sign In</button>
        &nbsp;
        <button
          className='btn btn-lg btn-warning' type='reset'
          onClick={handleReset}
        >{/* Font Aweosme Goes Here */} &nbsp;Reset
        </button>
      </Form>
      {status && (<div className={status.type}>{status.message}</div>)}
    </>
  )
}
