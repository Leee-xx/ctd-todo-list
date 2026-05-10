import { useState } from 'react'
import './App.css'
import TodoList from './features/TodoList/TodoList.jsx'
import TodoForm from './features/TodoList/TodoForm.jsx'

function App() {
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
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} />
    </div>
  )
}

export default App
