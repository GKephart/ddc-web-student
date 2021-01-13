import React from 'react'

export function WaitingInviteTableRow (props) {
  const dateTime = (milliSeconds) => {
    const date = new Date(milliSeconds)
    return date.toLocaleString()

  }
  const {invite} = props
  return (
    <>
      <tr>
        <td>{invite.inviteId}</td>

        <td>{invite.username}</td>
        <td>{invite.fullName}</td>
        <td>{dateTime(invite.createDate)}</td>
        <td>{invite.browser} (optional)</td>
        <td>{invite.ip} (optional)</td>
        <td>
          <form className="d-inline-flex px-1">
            <button type="submit" className="btn btn-success">A</button>
          </form>
          <form className="d-inline-flex px-1">
            <button className="btn btn-danger">D</button>
          </form>
        </td>
      </tr>
    </>
  )

}