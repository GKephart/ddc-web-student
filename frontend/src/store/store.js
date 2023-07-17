import auth from './auth.js'
import keys from './key.js'
import waitingInvites from './waitingInvites.js'
import processedInvites from './processedInvites.js'

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import users from './users.js'

const reducer = combineReducers({ auth, keys, waitingInvites, processedInvites, users })

export default configureStore({ reducer })
