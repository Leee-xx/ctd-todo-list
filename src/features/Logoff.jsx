import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext.jsx'

import Button from 'react-bootstrap/Button'

export default function Logoff() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [authError, setAuthError] = useState('')
  const navigate = useNavigate()

  const { logout } = useAuth()

  async function handleLogoff(event) {
    event.preventDefault()

    setIsLoggingOut(true)
    setAuthError('')

    const resp = await logout()
    if (resp.success) {
      navigate('/login', { replace: true })
    } else {
      setAuthError(resp.error)
      setIsLoggingOut(false)
    }
  }

  return(
    <form onSubmit={handleLogoff}>
      { authError && (<p className='error'>Error: {authError}</p>) }
      <Button
        type='submit'
        disabled={isLoggingOut}
        variant='outline-danger'
        className='btn-margin'
      >
        Log out
      </Button>
    </form>
  )
}
