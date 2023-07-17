import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWaitingInvites } from '../../store/waitingInvites'

import { WaitingInvites } from './WaitingInvites/WaitingInvites'
import { fetchProcessedInvites } from '../../store/processedInvites'
import { ProcessedInvites } from './ProcessedInvites/ProcessedInvites'
import { NavBar } from '../shared/components/NavBar/NavBar'

export const InviteApproval = () => {
  const waitingInvites = useSelector(state => state.waitingInvites ? state.waitingInvites : [])
  const processedInvites = useSelector(state => state.processedInvites ? state.processedInvites : [])

  const dispatch = useDispatch()

  const initialEffects = () => {
    dispatch(fetchWaitingInvites())
    dispatch(fetchProcessedInvites())
  }
  React.useEffect(initialEffects, [dispatch])

  return (
    <>
      <NavBar />
      <main className='container'>
        <div className='row'>
          <div className='col-12'>
            <h1 className='h2 py-3'>
              Invite Approval For Incoming Students
            </h1>
          </div>
        </div>
        <WaitingInvites
          waitingInvites={waitingInvites}
        />
        <ProcessedInvites
          processedInvites={processedInvites}
        />
      </main>

    </>
  )
}
