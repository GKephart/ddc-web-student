import React from 'react'

export const StudentSignUp = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <main className=" py-3 content-main col-xs-12 col-md-9">
            <h1 className="h2 py-2">Sign Up for A Deep Dive Coding Fullstack Student Account</h1>
            <p>To sign up for the Deep Dive Coding Fullstack Bootcamp student account login with your myCNM username
              and password. You will get an alert in your CNM Email when your account is activated.</p>
            <p>To continue, certify that you are enrolled in the CNM STEMulus Deep Dive Coding class. A program
              administrator will then verify your enrollment and approve your account.</p>
            <hr/>
              <form className="py-3">
                <div className="form-group">

                  <label htmlFor="username">Username</label>
                  <div className="input-group">
                    <div className="input-group-addon">
                      {/*  Font Awesome Goes Here*/}
                    </div>
                    <input type="text" name="username" placeholder="myCNM Username"
                           className="form-control"
                    />
                  </div>

                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>

                  <div className="input-group">
                    <div className="input-group-addon">
                      {/*font awesome goes here*/}
                    </div>
                    <input type="password" name="password" placeholder="myCNM Password"
                           className="form-control"/>
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group">
                    <div className=" form-check">
                      <input className="form-check-input" type="checkbox" name="agree" id="agree" value="true"/>
                      <label className="form-check-label">
                        By checking this box, I certify that I have signed up for the Deep Dive Coding Fullstack
                        Bootcamp.
                      </label>
                    </div>
                  </div>
                </div>
                <hr/>
                <button className="btn btn-lg btn-info" type="submit"> {/* Font Aweosme Goes Here*/} &nbsp;Sign In
                </button>
                <button className="btn btn-lg btn-warning" type="reset">{/* Font Aweosme Goes Here*/} &nbsp;Reset
                </button>
              </form>
              {/*  output area goes here*/}
          </main>
        </div>
      </div>
    </>
  )
}