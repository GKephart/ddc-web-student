import React from 'react'
import { SshKeyPostFormContent } from './SshKeyEditorPostForm/SshKeyPostFormContent'
import { SshKeyPostForm } from './SshKeyEditorPostForm/SshKeyPostForm'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSshKeys } from '../../store/key'
import { SshKeyTableItem } from './SshKeyTableItem'

export const SshKeyEditor = () => {
  const keys = useSelector(state => state.keys ? state.keys : []);

  const dispatch = useDispatch();
  const initialEffects = () => {
    dispatch(fetchSshKeys());
  };

  const inputs = [];
  React.useEffect(initialEffects, inputs);

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
                {keys.map((key) => <SshKeyTableItem sshKey={key} key={key.bits}/> )}
              </table>
            </div>
            <section className="alert alert-warning py-3">

            </section>
            <hr/>
            <SshKeyPostForm />
          </div>
        </div>
      </div>
    </>
  )
}