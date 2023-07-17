import { createSlice } from '@reduxjs/toolkit'
import { httpConfig } from '../utils/http-config'

const slice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers: (users, action) => {
      return action.payload
    },
    deleteUser: (users, action) => {

      return users.filter(user => user.id !== action.payload)
    }
  }
})

export const { setUsers, deleteUser } = slice.actions

export const fetchUsers = () => async (dispatch) => {
  const { data } = await httpConfig.get('/apis/user-admin/')
  if(Array.isArray(data) === true) {
    const filteredData = data.filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i)
    console.log(filteredData)
    dispatch(setUsers(filteredData))
  }else {
    dispatch(setUsers([]))
  }
}

export default slice.reducer
