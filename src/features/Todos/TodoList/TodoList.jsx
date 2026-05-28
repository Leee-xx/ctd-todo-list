import { useMemo } from 'react'
import TodoListItem from './TodoListItem.jsx'

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, dataVersion }) {
  const filteredTodoList = useMemo(() => {
    return {
      version: dataVersion,
      todos: todoList.filter((item) => { return !item.isCompleted })
    }
  }, [todoList, dataVersion])

  return(
    <>
      {
        filteredTodoList.todos.length === 0 ?
          <p>Add todo above to get started</p> :
          <ul>
            {
              filteredTodoList.todos.map((item) => {
                return <TodoListItem key={item.id} todo={item} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo} />
              })
            }
          </ul>
      }
    </>
  )
}

export default TodoList
