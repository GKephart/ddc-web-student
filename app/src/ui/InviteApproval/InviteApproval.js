import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWaitingInvites } from '../../store/waitingInvites'

import { WaitingInvites } from './WaitingInvites/WaitingInvites'

export const InviteApproval = () => {

  const waitingInvites = useSelector(state => state.waitingInvites ? state.waitingInvites : []);
  const processedInvites = useSelector(state => state.processedInvites ? state.processedInvites : []);

  const dispatch = useDispatch();

  const initialEffects = () => {
    dispatch(fetchWaitingInvites())
  }
  React.useEffect(initialEffects, [dispatch]);

  return (
    <>
      <main className="container">

        <WaitingInvites
          waitingInvites={waitingInvites}
        />

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