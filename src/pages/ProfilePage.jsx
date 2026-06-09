import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import useTodosFetch from '../utils/useTodosFetch.js'

export default function ProfilePage() {
  //const [todos, setTodos] = useState([])
  const [todoStats, setTodoStats] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { token, email } = useAuth()

  useEffect(() => {
    async function fetchTodos() {
      setLoading(true)

      try {
        const resp = await useTodosFetch({ token })

        if (resp.status === 401) { 
          throw new Error('Unauthorized')
        }
        if (resp.ok) {
          const data = await resp.json()
          const todos = data.tasks
          const total = todos.length
          const completed = todos.filter((todo) => todo.isCompleted).length
          const active = total - completed

          setTodoStats({ total, completed, active })
        } else {
          throw new Error('Failed to fetch todos')
        }
      } catch (error) {
        setError(`Error loading statistics: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (token)
      fetchTodos()
  }, [token])

  return(
    <div>
      <h1>Welcome, {email}</h1>
      {
        error && <p className='error'>{error}</p>
      }
      {
        loading ?
          <p>Loading stats...</p>
          :
          (
            <ul>
              <li><strong>Total tasks:</strong> {todoStats.total}</li>
              <li><strong>Completed count:</strong> {todoStats.completed}</li>
              <li><strong>Completed percentage:</strong> {(todoStats.completed / todoStats.total) * 100}%</li>
              <li><strong>Active count:</strong> {todoStats.active}</li>
              <li><strong>Active percentage:</strong> {(todoStats.active / todoStats.total) * 100}%</li>
            </ul>
          )
      }
    </div>
  )
}
