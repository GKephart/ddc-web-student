import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBan, faCheck, faEnvelope, faKey, faTrash } from '@fortawesome/free-solid-svg-icons'
import { httpConfig } from '../utils/http-config'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import { StudentPrivateRoute } from './shared/components/PrivateRoutes/StudentPrivateRoute'
import { SshKeyEditor } from './SshKeyEditor/SshKeyEditor'
import { AdminPrivateRoute } from './shared/components/PrivateRoutes/AdminPrivateRoute'
import { InviteApproval } from './InviteApproval/InviteApproval'
import { StudentSignUp } from './StudentSignUp/StudentSignUp'
import { UserAdmin } from './UserAdmin/UserAdmin'
import { Home } from './Home/Home'
import { FourOhFour } from './FourOhFour/FourOhFour'

library.add(faEnvelope, faKey, faTrash, faCheck, faBan );

export const App = ({store}) => {
  httpConfig.get("/apis/earl-grey/")
    .catch(() => {
      console.error("error connecting to the server")
    })
  return (
    <>
      <React.StrictMode>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <StudentPrivateRoute path="/ssh-key-editor">
                <SshKeyEditor />
              </StudentPrivateRoute>
              <AdminPrivateRoute path="/invite-approval">
                <InviteApproval />
              </AdminPrivateRoute>
              <Route exact path="/sign-up" component={StudentSignUp}/>
              <Route exact path="/user-admin" component={UserAdmin}/>


              <Route exact path="/" component={Home}/>
              <Route component={FourOhFour}/>
            </Routes>
          </BrowserRouter>
        </Provider>
      </React.StrictMode>
    </>
  )
};