import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWaitingInvites } from '../../store/invites'
import { WaitingInviteTableRow } from './WaitingInviteTableRow'

export const InviteApproval = () => {
  const waitingInvites = useSelector(state => state.invites ? state.invites : []);
  const dispatch = useDispatch();
  const initialEffects = () => {
    dispatch(fetchWaitingInvites())
  }
  React.useEffect(initialEffects, [dispatch]);
  console.log(waitingInvites)


  return (
    <>
      <main className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="h2 py-3">
              Invite Approval For Incoming Students
            </h1>

            <div className=" form-check">
              <input className="form-check-input" type="checkbox" name="agree" id="agree" value="true"/> &nbsp;
              <label className="form-check-label">
                Show more detailed data
              </label>
            </div>
            <h2 className="h3 py-2">Invites Awaiting Action</h2>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
            <tr>
              <th>Invitee Id</th>
              <th>Invitee Username</th>
              <th>Invitee Full Name</th>
              <th>Invitee Date</th>
              <th>Invitee Browser (optional)</th>
              <th>Invitee IP Address (optional)</th>
              <th>Approve/Decline Invite</th>
            </tr>
            </thead>
            <tbody>
            {waitingInvites.map(invite => <WaitingInviteTableRow invite={invite} />)}
            </tbody>
          </table>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="alert alert-warning">
              No waiting invites found <span role="img" aria-label="popper emoji">🎉</span>
            </div>
          </div>
        </div>

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
            <tr>
              <td>action.actionId</td>
              <td>action.inviteId</td>
              <td>action.approved | boolean</td>
              <td>action.actionDate | date</td>
              <td>action.actionUser</td>
              <td>action.invite.username</td>
              <td>action.invite.fullName</td>
              <td>action.invite.createDate | date</td>
              <td>action.invite.browser (optional)</td>
              <td>action.invite.ip (optional)</td>
            </tr>
            </tbody>
          </table>
        </div>
        {/*output area goes here*/}

        <div className="row">
          <div className="col-12">
            <div className="alert alert-warning">
              No processed invites found <span role="img" aria-label="super sad face">😩</span>
            </div>
          </div>
        </div>
      </main>

    </>
  )
}