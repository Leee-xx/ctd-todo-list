import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Logoff() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [authError, setAuthError] = useState('')

  const { logout } = useAuth()

  async function handleLogoff(event) {
    event.preventDefault()
    setIsLoggingOut(true)
    const resp = await logout()
    if (!resp.success) {
      setAuthError(resp.error)
    }

    setIsLoggingOut(false)
  }

  return(
    <form onSubmit={handleLogoff}>
      { authError && (<p className='error'>Error: {authError}</p>) }
      <button disabled={isLoggingOut}>
        Log out
      </button>
    </form>
  )
}
