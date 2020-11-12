import React from 'react'
import { SshKeyPostFormContent } from './SshKeyEditorPostForm/SshKeyPostFormContent'
import { SshKeyPostForm } from './SshKeyEditorPostForm/SshKeyPostForm'

export const SshKeyEditor = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-9">
            <h2 className="py-3">SSH Keys For Username Full Name</h2>
            <div className="table-responsive">
              <table className="table table-bordered x table-striped py-3">
                <tr>
                  <th>Bits</th>
                  <th>Fingerprint</th>
                  <th>Comment</th>
                  <th>Delete</th>
                </tr>
                <tr>
                  <td>sshKey.bits</td>
                  <td> sshKey.fingerprint</td>
                  <td>sshKey.comment</td>
                  <td>
                    <form>
                      <button type="submit" className="btn btn-danger">Delete SSh Key</button>
                    </form>
                  </td>
                </tr>
              </table>
            </div>
            <section className="alert alert-warning py-3">
              No SSH keys found.
            </section>
            <hr/>
            <SshKeyPostForm />
          </div>
        </div>
      </div>
    </>
  )
}