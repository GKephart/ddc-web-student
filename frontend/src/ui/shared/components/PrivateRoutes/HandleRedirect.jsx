import { Navigate, useLocation } from 'react-router-dom'

export function HandleRedirect () {
  const location = useLocation()
  return (
    <>
      <Navigate to='/' state={{ from: location }} replace />;
    </>

  )
}
