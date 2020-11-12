import React from 'react'

export function SshKeyTableItem ({sshKey}){
  return(
    <>
      <tr>
        <td>{sshKey.bits}</td>
        <td>{sshKey.fingerprint}</td>
        <td>{sshKey.comment}</td>
        <td>
          <form>
            <button type="submit" className="btn btn-danger">Delete SSh Key</button>
          </form>
        </td>
      </tr>
    </>
  )
}