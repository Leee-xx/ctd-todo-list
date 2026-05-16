import { useState } from 'react'
import TodoList from './TodoList/TodoList.jsx'
import TodoForm from './TodoForm.jsx'

function TodosPage() {
  const [todoList, setTodoList] = useState([])

  function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false
    }

    setTodoList(previous => [newTodo, ...previous])
  }

  function updateTodo(editedTodo) {
    const updatedTodoList = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...todo, title: editedTodo.title }
      } else {
        return todo
      }
    })

    setTodoList(updatedTodoList)
  }

  function completeTodo(todoId) {
    const newTodoList = todoList.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, isCompleted: true }
      } else {
        return todo
      }
    })

    setTodoList(newTodoList)
  }

  return (
    <div>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} />
    </div>
  )
}

export default TodosPage
