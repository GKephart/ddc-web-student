import { createSlice } from '@reduxjs/toolkit'
import { httpConfig } from '../utils/http-config.js'

const slice = createSlice({
  name: 'key',
  initialState: [],
  reducers: {
    getShhKeys: (keys, action) => {
      return action.payload
    },
    deleteSshKey: (keys, action) => {
      return keys.filter(key => key.key !== action.payload.key)
    }
  }
})

export const { getShhKeys, deleteSshKey } = slice.actions

export const fetchSshKeys = () => async (dispatch) => {
  const { data } = await httpConfig.get('/apis/ssh-key-editor/')
  dispatch(getShhKeys(data))
}

export default slice.reducer
