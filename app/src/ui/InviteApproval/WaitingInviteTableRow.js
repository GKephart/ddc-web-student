import React from 'react'
import { InviteApprovalForm } from './InviteApprovalForm'

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

        <InviteApprovalForm
          inviteId={invite.inviteId}
          setInviteApprovalStatus={setInviteApprovalStatus}
        />
      </td>
      </tr>
    </>
  )
}