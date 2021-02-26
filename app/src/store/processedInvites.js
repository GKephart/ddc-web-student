import { createSlice } from '@reduxjs/toolkit'
import { httpConfig } from '../utils/http-config'

const slice = createSlice({
  name:"processedInvites",
  initialState: [],
  reducers: {
    setProcessedInvites: (invites, action) => {
      return action.payload
    }
  }
})

export const{setProcessedInvites} = slice.actions

export const fetchProcessedInvites = () => async (dispatch) => {
  const {data} = await httpConfig.get("/apis/sign-up/?class=invite&command=processed")
  dispatch(setProcessedInvites(data))
}

export default slice.reducer