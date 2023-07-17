import React from 'react'
import { ProcessedInviteRow } from './ProcessedInviteRow'
import { WaitingInviteTableRow } from '../WaitingInvites/WaitingInviteTableRow'

export function ProcessedInvites (props) {
  const { processedInvites } = props
  const [isDetailedDataDisplayed, setIsDetailedDataDisplayed] = React.useState(false)

  return (
    <>
      <div className='row'>
        <div className='col-12'>
          <h2 className='h3'>Past Invites</h2>
          <div className=' form-check'>
            <input
              className='form-check-input' type='checkbox' name='agree' id='agree' value='true'
              onClick={() => { setIsDetailedDataDisplayed(!isDetailedDataDisplayed) }}
            />
            <label className='form-check-label'>
              Show more detailed data
            </label>
          </div>
          <form className='form py-1'>
            <div className='input-group'>
              <label htmlFor='search' />
              <input
                name='search' type='text' id='search' className='form-control'
                placeholder='Search By Invitee Name&hellip;'
              />

              <button type='submit' className='btn btn-outline-primary'>Search</button>
            </div>
          </form>
        </div>
      </div>

      {
  processedInvites !== undefined
    ? <>
      <div className='table-responsive'>
        <table className='table table-bordered  table-striped'>
          <thead>
            <tr>

              <th>Invitee Full Name</th>
              <th>Invitee Username</th>
              <th>Approved?</th>
              <th>Action Date</th>
              <th>Invitee Date</th>
              <th>Action User</th>
              {
            isDetailedDataDisplayed === true &&
              <>
                <th>Invitee Browser</th>
                <th>Invitee IP Address</th>
                <th>Action Id</th>
                <th>Invite Id</th>
              </>
          }
            </tr>
          </thead>
          <tbody>
            {
          processedInvites.map(({ action, invite }) =>
            <ProcessedInviteRow
              action={action}
              invite={invite}
              key={action.actionId}
              isDetailedDataDisplayed={isDetailedDataDisplayed}
            />
          )
}
          </tbody>
        </table>
      </div>
    </>
    : <>
      <div className='row'>
        <div className='col-12'>
          <div className='alert alert-warning'>
            No processed invites found <span role='img' aria-label='super sad face'>😩</span>
          </div>
        </div>
      </div>
    </>

}

    </>
  )
}
