import React from 'react'

export const SignInComponent = () => {
  return (
    <>
      <form className="py-3">
        <h2>Sign In</h2>
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
        <hr/>
        <button className="btn btn-lg btn-info" type="submit"> {/* Font Aweosme Goes Here*/} &nbsp;Sign In
        </button>
        <button className="btn btn-lg btn-warning" type="reset">{/* Font Aweosme Goes Here*/} &nbsp;Reset
        </button>
      </form>
    {/*  output area goes here*/}
    </>
  )
}