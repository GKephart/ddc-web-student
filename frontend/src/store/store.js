import auth from './auth'
import keys from './key'
import waitingInvites from './waitingInvites'
import processedInvites from './processedInvites'

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import users from './users'

const reducer = combineReducers({ auth, keys, waitingInvites, processedInvites, users })

export default configureStore({ reducer })
