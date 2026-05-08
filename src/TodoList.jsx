import TodoListItem from './TodoListItem.jsx'

function TodoList({ todoList, onCompleteTodo }) {
  const filteredTodoList = todoList.filter((item) => { return !item.isCompleted })

  return(
    <>
      {
        filteredTodoList.length === 0 ?
          <p>Add todo above to get started</p> :
          <ul>
            {
              filteredTodoList.map((item) => {
                return <TodoListItem key={item.id} todo={item} onCompleteTodo={onCompleteTodo} />
              })
            }
          </ul>
      }
    </>
  )
}

export default TodoList
