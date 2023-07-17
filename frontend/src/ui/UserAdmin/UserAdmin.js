import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUser, fetchUsers } from '../../store/users'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal, Navbar } from 'react-bootstrap'
import { NavBar } from '../shared/components/NavBar/NavBar'
import { httpConfig } from '../../utils/http-config'
import { Formik } from 'formik'
import { object, string } from 'yup'

export const UserAdmin = () => {
  const dispatch = useDispatch()

  const users = useSelector(state => state.users ? state.users : [])
  const initialEffects = () => {
    dispatch(fetchUsers())
  }

  React.useEffect(initialEffects, [dispatch])

  return (
    <>

      <NavBar/>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="h2 py-3">User Admin</h1>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <UserTable users={users}/>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <ManuallyAddUserForm/>

          </div>
        </div>
      </div>
    </>
  )
}

function UserTable (props) {
  const users = props.users

  if (users.length === 0) {
    return (

      <>
        <div className="col-12">
          <div className="alert alert-warning py-3">
            No users found <span role="img" aria-label="super sad face">😩</span>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="table-responsive p-3">
        <h2>Users currently on the server</h2>
        <table className=" table  table-striped">
          <thead>
          <tr>
            <th scope="col">Student Id</th>
            <th>Name</th>
            <th>Username</th>
            <th>Delete</th>
          </tr>
          </thead>
          <tbody>
          {users.map((user, key) => <UserRow key={user.id} user={user}/>)}
          </tbody>
        </table>
      </div>
    </>

  )
}

function UserRow (props) {
  const user = props.user
  return (
    <>
      <tr>
        <td scope="col">{user.id}</td>
        <td scope="col">{user.name}</td>
        <td scope="col">{user.username}</td>
        <td>
          <DeleteUserModal user={user}/>
        </td>
      </tr>
    </>
  )
}

function DeleteUserModal (props) {
  const user = props.user
  const [show, setShow] = useState(false)

  const dispatch = useDispatch()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const [status, setStatus] = useState(null)

  const deleteUserFromServer = () => {
    httpConfig(`/apis/user-admin/?username=${user.username}&delete=true`)
      .then((response) => {

        if (response.status === 200) {

          setTimeout(() => {
            dispatch(deleteUser(user.id))
            handleClose()

          }, 3000)

        }
        setStatus(response)
      })
      .catch(error => {
        console.log(error)
      })

  }

  return (
    <>
      <span>
        <button type="submit" aria-label={`delete
        ${user.username} from the server`} className="btn btn-danger" onClick={handleShow}>
          <FontAwesomeIcon icon="trash"/>
        </button>
      </span>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >

        <Modal.Header closeButton>
          <Modal.Title>Remove {user.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove {user.username} from the student server?

        </Modal.Body>
        <Modal.Footer>
          {status && (<div className={status.type}>{status.message}</div>)}
          <Button
            className={'py-3'}
            variant="secondary"
            onClick={() => {
              deleteUserFromServer()
            }}
          >
            Delete {user.username}
          </Button>

        </Modal.Footer>
      </Modal>
    </>
  )

}

function ManuallyAddUserForm () {
  const dispatch = useDispatch()


  const validator = object().shape({
    username: string().required('a CNM username is required')
  })

  const initialValues = {
    username: ''
  }

  const handleSubmit = (values, { resetForm, setStatus }) => {
    httpConfig.post('/apis/user-admin/', values)
      .then(reply => {
        let { message, type } = reply
        console.log(reply)

        if (reply.status === 200) {
          dispatch(fetchUsers())
          resetForm()
        }
        setStatus(reply)
      })
  }

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validator}>
        {ManuallyAddUserFormContent}
      </Formik>
    </>
  )
}


function ManuallyAddUserFormContent(props) {


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
    } = props

    console.log(status)
    return (
      <>

        <form
          className="form p-3 bg-light border rounded-3"
          onSubmit={handleSubmit}
        >
          <h2>Manually Invite User</h2>
          <p className={'text-danger'}>
            Use this form to manually invite a user. Manually inviting users is <strong>NOT</strong> recommended.
            Have the student <a href="/prework/signup/">sign up</a> if possible.
          </p>

          <div className="form-group py-2-">
            <label htmlFor="username">Username</label>
            <div className="input-group">
              <input
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                id="username"
                name="username"
                placeholder="flastname#"
                className="form-control"
                value={values.username}
              />
            </div>
            {errors.username && touched.username &&
              <>
                <div className="alert alert-danger">
                  {errors.username}
                </div>
              </>
            }
          </div>
          <div className="form-group py-2">
            <button className="btn btn-lg btn-info" type="submit">Invite</button>
            &nbsp;
            <button className="btn btn-lg btn-warning" type="reset">Reset</button>
          </div>
        </form>
        {status && <div className={status.type}>{status.message}</div>}
      </>
    )

  }




