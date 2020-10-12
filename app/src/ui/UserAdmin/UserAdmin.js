import React from 'react'

export const UserAdmin = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="h2 py-3">User Admin</h1>
          </div>
        </div>

          <div className="table-responsive py-3">
            <table className=" table table-bordered table-striped">

              <tr>
                <th>Student Id</th>
                <th>Name</th>
                <th>Username</th>
                <th>Delete</th>
              </tr>
              <tr>
                <td>user.id</td>
                <td>user.name</td>
                <td>user.username</td>
                <td>
                  <form>
                    <button type="submit" className="btn btn-danger">D</button>
                  </form>
                </td>
              </tr>
            </table>
          </div>
          <div className="row">
            <div className="col-12">

              <div className="alert alert-warning py-3">
                No users found <span role="img" aria-label="super sad face">😩</span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <form className="form py-3 alert alert-info">
                <h2>Manually Invite User</h2>
                <p>Use this form to manually invite a user. Manually inviting users is <strong>NOT</strong> recommended.
                  Have the student <a href="/prework/signup/">sign up</a> if possible.</p>
                <section className="form-group">
                  <label htmlFor="username">Username</label>
                  <div className="input-group">
                    <input type="text" id="username" name="username" placeholder="myCNM Username"
                           className="form-control"/>
                  </div>
                </section>
                <button className="btn btn-lg btn-info" type="submit">Invite</button>
                &nbsp;
                <button className="btn btn-lg btn-warning" type="reset">Reset</button>
              </form>
            </div>
          </div>
      </div>
    </>
  )
}