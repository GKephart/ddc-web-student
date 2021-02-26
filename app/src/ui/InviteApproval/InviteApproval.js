import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWaitingInvites } from '../../store/waitingInvites'

import { WaitingInvites } from './WaitingInvites/WaitingInvites'
import { fetchProcessedInvites } from '../../store/processedInvites'
import { ProcessedInvites } from './ProcessedInvites/ProcessedInvites'

export const InviteApproval = () => {

  const waitingInvites = useSelector(state => state.waitingInvites ? state.waitingInvites : []);
  const processedInvites = useSelector(state => state.processedInvites ? state.processedInvites : []);

  const dispatch = useDispatch();

  const initialEffects = () => {
    dispatch(fetchWaitingInvites())
    dispatch(fetchProcessedInvites())
  }
  React.useEffect(initialEffects, [dispatch]);

  return (
    <>
      <main className="container">

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