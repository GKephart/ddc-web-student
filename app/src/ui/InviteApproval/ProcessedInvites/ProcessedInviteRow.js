import React from 'react'

export function ProcessedInviteRow (props) {
  const{action, invite} = props

  return(
    <>
      <tr>
        <td>{action.actionId}</td>
        <td>{invite.inviteId}</td>
        <td>{action.approved}</td>
        <td>{action.actionDate} | date</td>
        <td>{action.actionUser}</td>
        <td>{invite.username}</td>
        <td>{invite.fullName}</td>
        <td>{invite.createDate}</td>
        <td>{invite.browser} (optional)</td>
        <td>{invite.ip} (optional)</td>
      </tr>
    </>
  )
}