import React from 'react';
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import { FourOhFour } from './ui/FourOhFour/FourOhFour'
import { Home } from './ui/Home/Home'
import { StudentSignUp } from './ui/StudentSignUp/StudentSignUp'
import { SshKeyEditor } from './ui/SshKeyEditor'
import { UserAdmin } from './ui/UserAdmin/UserAdmin'
import { InviteApproval } from './ui/InviteApproval/InviteApproval'

const Routing = () => (
  <>
    <React.StrictMode>
      <BrowserRouter>
        <Switch>
          <Route exact path="/ssh-key-editor" component={SshKeyEditor}/>
          <Route exact path="/sign-up" component={StudentSignUp}/>
          <Route exact path="/user-admin" component={UserAdmin}/>
          <Route exact path="/invite-approval" component={InviteApproval}/>
          <Route exact path="/" component={Home}/>
          <Route component={FourOhFour}/>
        </Switch>
      </BrowserRouter>
    </React.StrictMode>
  </>
);
ReactDOM.render(<Routing/>, document.querySelector('#root'));

