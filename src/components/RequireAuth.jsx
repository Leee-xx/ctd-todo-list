import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const currentLocation = location.pathname

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location, { replace: true })
    } else {
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
  }, [isAuthenticated])


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
