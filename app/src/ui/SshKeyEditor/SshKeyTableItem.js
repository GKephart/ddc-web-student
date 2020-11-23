import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { httpConfig } from '../../utils/http-config'
import { useDispatch } from 'react-redux'
import { deleteSshKey } from '../../store/key'

export function SshKeyTableItem (props) {
 const {sshKey, setMessage} = props
  const dispatch = useDispatch()
  const deleteKey = (event) => {
    event.preventDefault()
    const {key} = sshKey
    httpConfig.post("./apis/ssh-key-editor/", {key, delete: true})
      .then((reply) => {
        const {status, message} = reply
        if (status === 200) {
          dispatch(deleteSshKey(sshKey))
        }
        setMessage(message)
      })
  }
  return (
    <>
      <tr>
        <td>{sshKey.bits}</td>
        <td>{sshKey.fingerprint}</td>
        <td>{sshKey.comment}</td>
        <td>
          <form>
            <button
              type="submit"
              aria-label="delete ssh key"
              onClick={deleteKey}
              className="btn btn-danger"
            >
              <FontAwesomeIcon icon="trash"/>
            </button>
          </form>
        </td>
      </tr>
    </>
  )
}