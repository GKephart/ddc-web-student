import React from 'react'
import { dateTime } from '../../../utils/dateTime'

export function ProcessedInviteRow (props) {
  const { action, invite, isDetailedDataDisplayed } = props

  const parseBoolean = (boolean) => {
    return boolean === 1 ? 'true' : 'false'
  }

  return (
    <>
      <tr>
        <td>{invite.fullName}</td>
        <td>{invite.username}</td>
        <td>{parseBoolean(action.approved)}</td>
        <td>{dateTime(action.actionDate)}</td>
        <td>{dateTime(invite.createDate)}</td>
        <td>{action.actionUser}</td>
        {
          isDetailedDataDisplayed === true &&
            <>
              <td>{invite.browser}</td>
              <td>{invite.ip} </td>
              <td>{action.actionId}</td>
              <td>{invite.inviteId}</td>
            </>
        }
      </tr>
    </>
  )
}
