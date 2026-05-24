import { useState, useEffect, useCallback } from 'react'
import TodoList from './TodoList/TodoList.jsx'
import TodoForm from './TodoForm.jsx'
import SortBy from '../../shared/SortBy.jsx'
import FilterInput from '../../shared/FilterInput.jsx'
import useDebounce from '../../utils/useDebounce.js'

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([])
  const [error, setError] = useState('')
  const [isTodoListLoading, setIsTodoListLoading] = useState(false)
  const [sortBy, setSortBy] = useState('creationDate')
  const [sortDirection, setSortDirection] = useState('desc')
  const [filterTerm, setFilterTerm] = useState('')
  const [dataVersion, setDataVersion] = useState(0)
  const [filterError, setFilterError] = useState('')

  const debouncedFilterTerm = useDebounce(filterTerm, 300)

  useEffect(() => {
    async function fetchTodos() {
      setIsTodoListLoading(true)

      try {
        let paramsObj = {
          sortBy,
          sortDirection,
        }
        if (debouncedFilterTerm) {
          paramsObj.find = debouncedFilterTerm
        }

        const params = new URLSearchParams(paramsObj)

        const resp = await fetch(`/api/tasks?${params}`, {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include'
        })

        if (resp.ok) {
          const data = await resp.json()
          setTodoList(data.tasks)
          setFilterError('')
        } else if (resp.status == 401) {
          throw new Error('unauthorized')
        } else {
          throw new Error(`Unhandled exception: ${resp.status}`)
        }
      } catch (err) {
        if (debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc') {
          setFilterError(`Error filtering or sorting todos: ${err.message}`)
        } else {
          setError(`Error fetching todos: ${err.message}`)
        }
      } finally {
        setIsTodoListLoading(false)
      }
    }

    if (token)
      fetchTodos()
  }, [token, sortBy, sortDirection, debouncedFilterTerm])

  async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false
    }

    setTodoList(previous => [newTodo, ...previous])

    try {
      const resp = await fetch('/api/tasks', {
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
          return todo.id === newTodo.id ? data : todo
        }))
        invalidateCache()
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
        credentials: 'include'
      })

      if (resp.ok) {
        invalidateCache()
      } else {
        const data = await resp.json()
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

      if (resp.ok) {
        invalidateCache()
      } else {
        const data = await resp.json()
        throw new Error(`Couldn't complete todo: ${data?.message}`)
      }
    } catch (err) {
      console.error(err)
      setError(err.message)
      setTodoList(prev => prev.map((todo) => {
        return todo.id === completedTodo.id ? { ...todo, isCompleted: false } : todo
      }))
    }
  }

  const handleFilterChange = (newFilterTerm) => {
    setFilterTerm(newFilterTerm)
  }

  const invalidateCache = useCallback(() => {
    setDataVersion(p => p + 1)
  }, [])
  return (
    <div>
      { isTodoListLoading && <p>Loading tasks...</p> }
      { error && (
        <div className='error'>
          <p>{error}</p>
          <button onClick={() => setError('')}>Clear Error</button>
        </div>
      ) }
      {
        filterError && (
          <div className='error'>
            <p>{filterError}</p>
            <button onClick={() => setFilterError('')}>Clear Filter Error</button>
            <button onClick={() => {
              setFilterTerm('')
              setSortBy('creationDate')
              setSortDirection('desc')
              setFilterError('')
            }}>
              Reset Filters
            </button>
          </div>
        )
      }
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />
      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
      />
    </div>
  )
}

export default TodosPage
