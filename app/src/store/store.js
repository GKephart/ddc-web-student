import auth from "./auth";
import keys from "./key"
import invites from "./invites"

import { configureStore,combineReducers} from '@reduxjs/toolkit'
const reducer = combineReducers({auth, keys, invites})
export default configureStore({reducer});