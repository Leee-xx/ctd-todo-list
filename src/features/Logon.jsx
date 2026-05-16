import { useState } from 'react'
import TextWithInputLabel from '../shared/TextWithInputLabel.jsx'

function Logon({ onSetEmail = () => {}, onSetToken = () => {} }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [isLoggingOn, setIsLoggingOn] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setIsLoggingOn(true)

    try{
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
        onSetEmail()
        onSetToken()
      } else {
        setAuthError(`Authentication failed: ${data?.message}`)
      }
    } catch (error) {
      setAuthError(`Error: ${data?.message}`)
    } finally {
      setIsLoggingOn(false)
    }
  }

  return(
    <form>
      <TextWithInputLabel
        labelText='Email:'
        id='email'
        name='email'
        value={email}
        onChange={(e) => { setEmail(e.target.value) }
      />
      <button type='submit' />Log in</button>
    </form>
  )
}

export default Logon
