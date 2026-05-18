import { useState, useEffect } from 'react'
import TodoList from './TodoList/TodoList.jsx'
import TodoForm from './TodoForm.jsx'

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([])
  const [error, setError] = useState('')
  const [isTodoListLoading, setIsTodoListLoading] = useState(false)

  useEffect(() => {
    async function fetchTodos() {
      setIsTodoListLoading(true)

      try {
        const resp = await fetch('/api/tasks', {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include'
        })

        if (resp.ok) {
          const data = await resp.json()
          setTodoList(data.tasks)
        } else if (resp.status == 401) {
          throw new Error('unauthorized')
        } else {
          throw new Error(`Unhandled exception: ${resp.status}`)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsTodoListLoading(false)
      }
    }

    if (token)
      fetchTodos()
  }, [token])

  async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false
    }

    setTodoList(previous => [newTodo, ...previous])

    try {
      const resp = await fetch('/api/tasks/', {
        method: 'POST',
        body: JSON.stringify({ title: todoTitle, isCompleted: false }),
        headers: {
          'X-CSRF-TOKEN': token,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      const data = await resp.json()
      if (resp.ok) {
        setTodoList(prev => prev.map((todo) => {
          if (todo.id === newTodo.id) {
            return data
          } else {
            return todo
          }
        }))
      } else {
        throw new Error(`Couldn't add todo: ${data?.message}`)
      }
    } catch (err) {
      console.error(err)
      setError(err.message)
      setTodoList(prev => prev.filter((item) => item.id !== newTodo.id))
    }
  }

  async function updateTodo(editedTodo) {
    let originalTodo
    const updatedTodoList = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        originalTodo = todo
        return { ...todo, title: editedTodo.title }
      } else {
        return todo
      }
    })

    setTodoList(updatedTodoList)

    try {
      const resp = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: editedTodo.title, isCompleted: editedTodo.isCompleted }),
        headers: {
          'X-CSRF-TOKEN': token,
          'Content-Type': 'application/json'
        },
      })

      const data = await resp.json()
      if (!resp.ok) {
        throw new Error(`Couldn't update todo: ${data?.message}`)
      }
    } catch (err) {
      console.error(err)
      setError(err.message)

      setTodoList(prev => prev.map((todo) => {
          return todo.id === originalTodo.id ? originalTodo : todo
        }
      ))
    }
  }

  async function completeTodo(todoId) {
    let completedTodo
    const newTodoList = todoList.map((todo) => {
      if (todo.id === todoId) {
        return completedTodo = { ...todo, isCompleted: true }
      } else {
        return todo
      }
    })

    setTodoList(newTodoList)
    try {
      const resp = await fetch(`/api/tasks/${todoId}`, {
        method: 'PATCH',
        body: JSON.stringify({ isCompleted: true }),
        headers: {
          'X-CSRF-TOKEN': token,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      const data = await resp.json()
      if (!resp.ok) {
        throw new Error(`Couldn't complete todo: ${data?.message}`)
      }
    } catch (err) {
      console.error(err)
      setError(err.message)
      setTodoList(prev => [{ ...completedTodo, isCompleted: false }, ...prev])
    }
  }

  return (
    <div>
      { isTodoListLoading && <p>Loading tasks...</p> }
      { error && (
        <div>
          <p>Error: {error}</p>
          <button onClick={() => setError('')}>Clear Error</button>
        </div>
      ) }
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} />
    </div>
  )
}

export default TodosPage
