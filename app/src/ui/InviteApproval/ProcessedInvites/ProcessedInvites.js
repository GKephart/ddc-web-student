import React from 'react'
import { ProcessedInviteRow } from './ProcessedInviteRow'

export function ProcessedInvites (props) {
  const {processedInvites} = props

  return (
    <>
      <div className="row">
        <div className="col-12">
          <h2 className="h3">Past Invites</h2>
          <form className="form py-1">
            <div className="input-group">
              <label htmlFor="search"/>
              <input name="search" type="text" id="search" className="form-control"
                     placeholder="Search By Invitee Name&hellip;"/>

              <button type="submit" className="btn btn-outline-primary">Search</button>
            </div>
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered  table-striped">
          <thead>
          <tr>
            <th>Action Id</th>
            <th>Invite Id</th>
            <th>Approved?</th>
            <th>Action Date</th>
            <th>Action User</th>
            <th>Invitee Username</th>
            <th>Invitee Full Name</th>
            <th>Invitee Date</th>
            <th>Invitee Browser (optional)</th>
            <th>Invitee IP Address (optional)</th>
          </tr>
          </thead>
          <tbody>
          {
            processedInvites.map(({action, invite}) =>
              <ProcessedInviteRow
                action={action}
                invite={invite}
                key={action.actionId}
              />
            )}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="alert alert-warning">
            No processed invites found <span role="img" aria-label="super sad face">😩</span>
          </div>
        </div>
      </div>
    </>
  )
}