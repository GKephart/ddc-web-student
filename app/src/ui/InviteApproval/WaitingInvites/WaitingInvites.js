import React from 'react'
import { WaitingInviteTableRow } from './WaitingInviteTableRow'

export function WaitingInvites (props) {

  const {waitingInvites} = props

  const [isDetailedDataDisplayed, setIsDetailedDataDisplayed] = React.useState(false)
  const [inviteApprovalStatus, setInviteApprovalStatus] = React.useState(null)

  return(
    <>
      <div className="row">
        <div className="col-12">
          <h1 className="h2 py-3">
            Invite Approval For Incoming Students
          </h1>

          <div className=" form-check">
            <input className="form-check-input" type="checkbox" name="agree" id="agree" value="true"
                   onClick={() => {setIsDetailedDataDisplayed(!isDetailedDataDisplayed)}}/>
            <label className="form-check-label">
              Show more detailed data
            </label>
          </div>
          <h2 className="h3 py-2">Invites Awaiting Action</h2>
        </div>
      </div>

      {waitingInvites.length > 0
        ? <>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
              <tr>

                <th>Invitee Username</th>
                <th>Invitee Full Name</th>
                <th>Invitee Date</th>
                {
                  isDetailedDataDisplayed === true &&
                  <>
                    <th>Invitee Id</th>
                    <th>Invitee Browser</th>
                    <th>Invitee IP Address</th>
                  </>
                }
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              {waitingInvites.map(invite => <WaitingInviteTableRow
                invite={invite}
                isDetailedDataDisplayed={isDetailedDataDisplayed}
                setInviteApprovalStatus={setInviteApprovalStatus}
                key={invite.inviteId}

              />)
              }
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="col-12">
              {
                inviteApprovalStatus !== null && (
                  <>
                    <div className={inviteApprovalStatus.type}>{inviteApprovalStatus.message}</div>
                  </>
                )
              }
            </div>
          </div>
        </>
        : <>
          <div className="row">
            <div className="col-12">
              <div className="alert alert-warning">
                No waiting invites found <span role="img" aria-label="popper emoji">🎉</span>
              </div>
            </div>
          </div>
        </>
      }

    </>
  )
}