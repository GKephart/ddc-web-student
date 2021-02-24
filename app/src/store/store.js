import auth from "./auth";
import keys from "./key"
import waitingInvites from "./waitingInvites"
import processedInvites from "./processedInvites"

import { configureStore,combineReducers} from '@reduxjs/toolkit'
const reducer = combineReducers({auth, keys, waitingInvites, processedInvites})
export default configureStore({reducer});