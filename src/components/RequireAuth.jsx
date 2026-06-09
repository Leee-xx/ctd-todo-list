import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const currentLocation = location.pathname

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login',
        {
          replace: true,
          state: {
            from: {
              pathname: currentLocation
            }
          }
        }
      )
    }
  }, [isAuthenticated, currentLocation, navigate])


  if (!isAuthenticated) {
    return(
      <p>Redirecting...</p>
    )
  }

  return(
    <>
      {children}
    </>
  )
}
