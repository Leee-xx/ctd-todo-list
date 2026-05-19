import { useState } from 'react'
import TextInputWithLabel from '../shared/TextInputWithLabel.jsx'

function Logon({ onSetEmail, onSetToken }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [isLoggingOn, setIsLoggingOn] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setIsLoggingOn(true)

    try {
      const resp = await fetch('/api/users/logon', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      const data = await resp.json()
      if (resp.status == 200 && data.name && data.csrfToken) {
        onSetEmail(data.name)
        onSetToken(data.csrfToken)
      } else {
        setAuthError(`Authentication failed: ${data?.message}`)
      }
    } catch (error) {
      setAuthError(`Error: ${error.message}`)
    } finally {
      setIsLoggingOn(false)
    }
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
        id='password'
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
