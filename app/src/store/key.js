import { createSlice } from "@reduxjs/toolkit";
import {httpConfig} from "../utils/http-config"

const slice = createSlice({
  name: "key",
  initialState: [],
  reducers: {
    getShhKeys: (keys, action) => {
      console.log(action)
      return action.payload
    }
  }
})

export const {getShhKeys} = slice.actions

export const fetchSshKeys = () => async (dispatch) => {
  const {data} =  await httpConfig.get("/apis/ssh-key-editor/");
  dispatch(getShhKeys([{"bits":256,"fingerprint":"ZJepgSxxGz3T9fv6IckcSw0UrfHJY/b9TU0c7kl54Ws","comment":"gkephart@martys-mbp.admin.ad.cnm.edu (ED25519)","key":"ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDE/G4RlGFUyklsgavq+nPDwvQc5XQhInpvnVvzElo1d gkephart@martys-mbp.admin.ad.cnm.edu"}]));
};

export default slice.reducer