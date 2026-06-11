import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export function AuthProvider({ children }) {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState(window.localStorage.getItem('todoToken') || '')

  const login = async (userEmail, password) => {
    try {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
        credentials: 'include'
      }

      const res = await fetch('/api/users/logon', options)
      const data = await res.json()

      if (res.status === 200 && data.name && data.csrfToken) {
        setEmail(data.name)
        setToken(data.csrfToken)
        window.localStorage.setItem('todoToken', data.csrfToken)
        return { success: true }
      } else {
        return {
          success: false,
          error: `Authentication failed: ${data?.message}`
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `Network error during login: ${error.message}`
      }
    }
  }

  const logout = async () => {
    try {
      if (token) {
        const options = {
          method: 'POST',
          headers: {
            'X-CSRF-TOKEN': token,
          },
        }
        const res = await fetch('/api/users/logoff', options)
        if (res.status === 200) {
          window.localStorage.removeItem('todoToken')
          return { success: true }
        } else {
          return {
            success: false,
            message: `Logout failure: ${res.statusText}`
          }
        }
      }
    } catch (error) {
        const message = `Error logging out: ${error.message}`
        console.error(message)
        return { success: false, error: message }
    } finally {
      setEmail('')
      setToken('')
    }
  }

  const value = {
    email,
    token,
    isAuthenticated: !!token,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
