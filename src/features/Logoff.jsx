import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Logoff() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [authError, setAuthError] = useState('')

  const { logout } = useAuth()

  async function handleLogoff(event) {
    event.preventDefault()
    const resp = await logout()
    if (!resp.sucess) {
      setAuthError(resp.error)
    }

    console.log(resp)
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
