import React from 'react'

export function SshKeyPostFormContent (props) {
  const {
    status,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset
  } = props;

  return (
    <>
      <form className="form py-3" onSubmit={handleSubmit}>
        <h2>Add SSH Key</h2>
        <div className="form-group">
          <label htmlFor="newSshKey">Paste SSH Key Here</label>
          <div className="input-group py-1">
            <textarea
              className="form-control"
              cols="80"
              name="key"
              rows="6"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.key}/>
          </div>
          {errors.key && touched.key && (
            <div className="alert alert-danger">{errors.key}</div>
          )}
        </div>
        <div className="form-group">
          <button className="btn btn-lg btn-info" type="submit">Add SSH Key</button>
          &nbsp;
          <button className="btn btn-lg btn-warning" type="reset" onClick={handleReset}>Reset</button>
        </div>
      </form>
      {status && (<div className={status.type}>{status.message}</div>)}
    </>
  )
}