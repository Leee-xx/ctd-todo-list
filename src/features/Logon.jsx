import { useState } from 'react'
import TextInputWithLabel from '../shared/TextInputWithLabel.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

function Logon() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [isLoggingOn, setIsLoggingOn] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

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

export default Logon
