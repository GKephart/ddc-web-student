import auth from "./auth";
import keys from "./key"

import { configureStore,combineReducers} from '@reduxjs/toolkit'
const reducer = combineReducers({auth, keys})
export default configureStore({reducer});