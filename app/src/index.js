import React from 'react';
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import { FourOhFour } from './ui/FourOhFour/FourOhFour'
import { Home } from './ui/Home/Home'
import { StudentSignUp } from './ui/StudentSignUp/StudentSignUp'
import { SshKeyEditor } from './ui/SshKeyEditor/SshKeyEditor'
import { UserAdmin } from './ui/UserAdmin/UserAdmin'
import { InviteApproval } from './ui/InviteApproval/InviteApproval'
import { httpConfig } from './utils/http-config'
import store from "./store/store"
import { Provider } from 'react-redux'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope, faKey, faTrash } from '@fortawesome/free-solid-svg-icons'
import { PrivateRoute } from './ui/shared/components/PrivateRoute'

library.add(faEnvelope, faKey, faTrash);




const Routing = (store) => {
  httpConfig.get("/apis/earl-grey/")
    .catch(() => {
    console.error("error connecting to the server")
  })
  return (
  <>
    <React.StrictMode>
      <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <PrivateRoute path="/ssh-key-editor">
              <SshKeyEditor />
          </PrivateRoute>
          <Route exact path="/sign-up" component={StudentSignUp}/>
          <Route exact path="/user-admin" component={UserAdmin}/>
          <Route exact path="/invite-approval" component={InviteApproval}/>
          <Route exact path="/" component={Home}/>
          <Route component={FourOhFour}/>
        </Switch>
      </BrowserRouter>
      </Provider>
    </React.StrictMode>
  </>
  )
};
ReactDOM.render(Routing(store), document.querySelector('#root'));

