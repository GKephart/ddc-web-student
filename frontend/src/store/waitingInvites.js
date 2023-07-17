import { createSlice } from '@reduxjs/toolkit'
import { httpConfig } from '../utils/http-config'

const slice = createSlice({
  name: 'waitingInvites',
  initialState: [],
  reducers: {
    setWaitingInvites: (invites, action) => {
      return action.payload
    }
  }
})

export const { setWaitingInvites } = slice.actions

export const fetchWaitingInvites = () => async (dispatch) => {
  const { data } = await httpConfig.get('/apis/sign-up/?class=invite&command=waiting')
  dispatch(setWaitingInvites(data))
}

export default slice.reducer
