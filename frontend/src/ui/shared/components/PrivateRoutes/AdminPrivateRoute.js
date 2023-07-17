
import React from 'react'
import { useJwtToken } from '../../useJwtToken'
import { IsLoading } from './IsLoading'
import { HandleRedirect } from './HandleRedirect'

/**
 * A higher order component that checks if a user is signed in (auth is set in redux with a valid JWT and the isAdmin state variable is true) as an admin. If the user is signed in as an admin they get redirected to the protected route, else the user is redirected to the login page.
 * @param {Component} childComponent child component called in the body of Private route
 * @returns {JSX.Element} Either the protected component or a React router redirect depending upon if the user is logged in.
 * @constructor
 */
export function AdminPrivateRoute ({ children }) {
  const { authenticatedUser, isLoading } = useJwtToken()

  const isUserAuthenticated = authenticatedUser?.isAdmin ?? false

  if (isLoading === true) {
    return <IsLoading />
  } else if (isUserAuthenticated === false) {
    return <HandleRedirect />
  }

  return children
}
