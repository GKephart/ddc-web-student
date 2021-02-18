import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Formik } from 'formik'
import { httpConfig } from '../../utils/http-config'
import { fetchWaitingInvites } from '../../store/invites'
import { useDispatch } from 'react-redux'

export function InviteApprovalForm (props) {
  const {inviteId,setInviteApprovalStatus} = props
  const dispatch = useDispatch()

  const handleSubmit = (values) => {
    const inviteAction = {...values, inviteId}
    httpConfig.post("/apis/sign-up/?class=action", inviteAction)
      .then(reply => {
        let {message, type, status} = reply
        setInviteApprovalStatus({message, type})
        if(status === 200) {
          dispatch(fetchWaitingInvites())
        }
      })
  }

  const action = {
    approved:""
  }

  return(
    <>
      <Formik
        onSubmit={handleSubmit}
        initialValues={action}
      >
      {InviteApprovalFormContent}
      </Formik>
    </>
  )
}

function InviteApprovalFormContent (props) {
  const {
    setFieldValue,
    handleBlur,
    handleSubmit,

  } = props;

  return(
    <>
      <form className="d-inline-flex px-1" onSubmit={handleSubmit}>
        <label className='sr-only' htmlFor="approveStudent">Approve incoming student</label>
        <button
          onBlur={handleBlur}
          className="btn btn-success"
          value={true}
          id="approveStudent"
          onClick={() => {
            setFieldValue("approved", true)
          }}

        >
          <FontAwesomeIcon icon="check"/>
        </button>
        &nbsp;
        <label className='sr-only' htmlFor="denyStudent">Deny incoming student</label>
        <button
          className="btn btn-danger"
          onBlur={handleBlur}
          id="denyStudent"
          value="false"
          onClick={() => {
            setFieldValue("approved", false)
          }}
        >
          <FontAwesomeIcon icon="ban"/>
        </button>
      </form>
    </>
  )
}