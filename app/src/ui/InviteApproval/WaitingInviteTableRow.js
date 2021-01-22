import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { httpConfig } from '../../utils/http-config'

export function WaitingInviteTableRow (props) {

  const [approved, setApproved] = useState();

  const {invite, isDetailedDataDisplayed} = props

  const dateTime = (milliSeconds) => {
    const date = new Date(milliSeconds)
    return date.toLocaleString()
  }

  const submitAction = (event) =>{
    event.preventDefault()
    console.log(approved)
  };

  const handleChange = (event) => {
    event.preventDefault()
    console.log(event.currentTarget.value)
    setApproved(event.currentTarget.value)
  }



  return (
    <>
      <tr>
      <td>{invite.username}</td>
      <td>{invite.fullName}</td>
      <td>{dateTime(invite.createDate)}</td>
      {
        isDetailedDataDisplayed === true &&
        <>
          <td>{invite.inviteId}</td>
          <td>{invite.browser}</td>
          <td>{invite.ip}</td>
        </>
      }
      <td>
        <form className="d-inline-flex px-1" onSubmit={submitAction}>
          <button
            className="btn btn-success"
            value={true}
            onClick={handleChange}
          >
            <FontAwesomeIcon icon="check"/>
          </button>
          <button
            className="btn btn-danger"
            value="false"
            onClick={handleChange}
          >
            <FontAwesomeIcon icon="ban"/>
          </button>
        </form>


      </td>
      </tr>
    </>
  )
}