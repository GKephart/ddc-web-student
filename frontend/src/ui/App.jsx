import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBan, faCheck, faEnvelope, faKey, faTrash } from '@fortawesome/free-solid-svg-icons'
import { httpConfig } from '../utils/http-config.js'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'
import { StudentPrivateRoute } from './shared/components/PrivateRoutes/StudentPrivateRoute.jsx'
import { SshKeyEditor } from './SshKeyEditor/SshKeyEditor.jsx'
import { AdminPrivateRoute } from './shared/components/PrivateRoutes/AdminPrivateRoute.jsx'
import { InviteApproval } from './InviteApproval/InviteApproval.jsx'
import { StudentSignUp } from './StudentSignUp/StudentSignUp.jsx'
import { UserAdmin } from './UserAdmin/UserAdmin.jsx'
import { Home } from './Home/Home.jsx'
import { FourOhFour } from './FourOhFour/FourOhFour.jsx'

library.add(faEnvelope, faKey, faTrash, faCheck, faBan, faTrash)

export const App = ({ store }) => {
  httpConfig.get('/apis/earl-grey/')
    .catch(() => {
      console.error('error connecting to the server')
    })
  return (
    <>
      <React.StrictMode>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route
                exact
                path='/ssh-key-editor'
                element={
                  <StudentPrivateRoute>
                    <SshKeyEditor />
                  </StudentPrivateRoute>
                }
              />
              <Route
                path='/admin/user-admin' element={<>

                  <AdminPrivateRoute>
                    <UserAdmin />
                  </AdminPrivateRoute>
                </>}
              />
              <Route
                path='/admin/invite-approval' element={<>

                  <AdminPrivateRoute>
                    <InviteApproval />
                  </AdminPrivateRoute>
                </>}
              />

              <Route
                exact
                path='/sign-up'
                element={<StudentSignUp />}
              />

              <Route exact path='/' element={<Home />} />
              <Route path='*' element={<FourOhFour />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </React.StrictMode>
    </>
  )
}
