import React from 'react'
import {WaitingInviteApprovalForm} from './WaitingInviteApprovalForm'

export function WaitingInviteTableRow (props) {

  const {invite, isDetailedDataDisplayed, setInviteApprovalStatus} = props

  const dateTime = (milliSeconds) => {
    const date = new Date(milliSeconds)
    return date.toLocaleString()
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
      <td className="align-content-center">

        <WaitingInviteApprovalForm
          inviteId={invite.inviteId}
          setInviteApprovalStatus={setInviteApprovalStatus}
        />
      </td>
      </tr>
    </>
  )
}