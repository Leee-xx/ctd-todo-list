import {
	useEffect,
	useReducer
} from 'react'
import { useSearchParams } from 'react-router'
import TodoList from '../features/Todos/TodoList/TodoList.jsx'
import TodoForm from '../features/Todos/TodoForm.jsx'
import SortBy from '../shared/SortBy.jsx'
import FilterInput from '../shared/FilterInput.jsx'
import useDebounce from '../utils/useDebounce.js'
import StatusFilter from '../shared/StatusFilter.jsx'
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS
} from '../reducers/todoReducer.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import useTodosFetch from '../utils/useTodosFetch.js'

function TodosPage() {
  const [state, dispatch] = useReducer(todoReducer, initialTodoState)
  const {
    todoList,
    error,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
    filterError
  } = state

  const { token } = useAuth()
  const [searchParams] = useSearchParams()
  const debouncedFilterTerm = useDebounce(filterTerm, 300)
  const statusFilter = searchParams.get('status') || 'all'

  useEffect(() => {
    async function fetchTodos() {
      dispatch({ type: TODO_ACTIONS.FETCH_START })

      try {
        let params = {
          sortBy,
          sortDirection,
        }
        if (debouncedFilterTerm) {
          params.find = debouncedFilterTerm
        }

        const resp = await useTodosFetch({ token, params })
        if (resp.ok) {
          const data = await resp.json()
          dispatch({
            type: TODO_ACTIONS.FETCH_SUCCESS,
            payload: { todos: data.tasks }
          })
        } else if (resp.status == 401) {
          throw new Error('unauthorized')
        } else if (resp.status == 404 && debouncedFilterTerm) {
          throw new Error(`No todos found with terms matching "${debouncedFilterTerm}"`)
        } else {
          throw new Error(`Unhandled exception: ${resp.status}`)
        }
      } catch (err) {
        if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'asc') {
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              error: `Error filtering or sorting todos: ${err.message}`,
              isFilterError: true
            }
          })
        } else {
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              error: `Error fetching todos: ${err.message}`,
              isFilterError: false
            }
          })
        }
      }
    }

    if (token) {
      fetchTodos()
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm])

  async function addTodo(todoTitle) {
    const tempTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false
    }

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: { tempTodo }
    })

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
        dispatch({
          type: TODO_ACTIONS.ADD_TODO_SUCCESS,
          payload: {
            newTodo: data,
            tempTodo
          }
        })
      } else {
        throw new Error(`Couldn't add todo: ${data?.message}`)
      }
    } catch (err) {
      console.error(err)
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          error: err.message,
          tempTodo
        }
      })
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id)
    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: { todo: editedTodo }
    })

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
        dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS })
      } else {
        const data = await resp.json()
        throw new Error(`Couldn't update todo: ${data?.message}`)
      }
    } catch (err) {
      console.error(err)
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          error: err.message,
          originalTodo
        }
      })
    }
  }

  async function completeTodo(todoId) {
    const completedTodo = {
      ...todoList.find((todo) => todo.id == todoId),
      isCompleted: true
    }

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: { todoId }
    })
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
        dispatch({
          type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
          payload: { todoId }
        })
      } else {
        const data = await resp.json()
        throw new Error(`Couldn't complete todo: ${data?.message}`)
      }
    } catch (err) {
      console.error(err)
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          error: err.message,
          todoId
        }
      })
    }
  }

  const handleFilterChange = (newFilterTerm) => {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: { filterTerm: newFilterTerm }
    })
  }

  return (
    <div>
      { isTodoListLoading && <p>Loading tasks...</p> }
      { error && (
        <div className='error'>
          <p>{error}</p>
          <button onClick={
            () => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })
          }>
            Clear Error
          </button>
        </div>
      ) }
      {
        filterError && (
          <div className='error'>
            <p>{filterError}</p>
            <button onClick={
              () => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })
            }>
              Clear Filter Error
            </button>
            <button onClick={() => {
              dispatch({ type: TODO_ACTIONS.RESET_FILTERS })
            }}>
              Reset Filters
            </button>
          </div>
        )
      }
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={(newSortBy) => {
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy: newSortBy,
              sortDirection
            }
          })
        }}
        onSortDirectionChange={(newSortDirection) => {
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy,
              sortDirection: newSortDirection
            }
          })
        }}
      />
      <StatusFilter />
      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={(newTerm) => handleFilterChange(newTerm)}
      />
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
      />
    </div>
  )
}

export default TodosPage
