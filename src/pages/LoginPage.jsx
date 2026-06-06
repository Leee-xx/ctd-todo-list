import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from '../contexts/AuthContext.jsx'
import TextInputWithLabel from '../shared/TextInputWithLabel.jsx'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [isLoggingOn, setIsLoggingOn] = useState(false)

  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/todos'

  useEffect(() => {
    if (isAuthenticated)
      navigate(from, { replace: true })

  }, [isAuthenticated, navigate, from])

  async function handleSubmit(e) {
    e.preventDefault()

    setIsLoggingOn(true)

    const resp = await login(email, password)

    if (!resp.success) {
      setAuthError(resp.error)
    }

    setIsLoggingOn(false)
  }

  return(
    <form onSubmit={handleSubmit}>
      { authError && (<p className='error'>Error: {authError}</p>) }
      <TextInputWithLabel
        labelText='Email:'
        elementId='email'
        name='email'
        value={email}
        onChange={(e) => { setEmail(e.target.value) }}
        required
      />
      <TextInputWithLabel
        labelText='Password:'
        elementId='password'
        name='password'
        value={password}
        onChange={(e) => { setPassword(e.target.value) }}
        required
      />
      <button type='submit' disabled={isLoggingOn}>{isLoggingOn ? "Logging in..." : "Log in"}</button>
    </form>
  )
}
