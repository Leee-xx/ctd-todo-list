import { useState } from 'react'
import TextInputWithLabel from './shared/TextInputWithLabel.jsx'
import { isValidTodoTitle } from './utils/todoValidation.js'

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false)
  const [workingTitle, setWorkingTitle] = useState(todo.title)

  function handleCancel() {
    setWorkingTitle(todo.title)
    setIsEditing(false)
  }

  function handleEdit(e) {
    setWorkingTitle(e.target.value)
  }

  function handleUpdate(e) {
    if (isEditing) {
      e.preventDefault()
      if (isValidTodoTitle(workingTitle)) {
        onUpdateTodo({ ...todo, title: workingTitle.trim() })
        setIsEditing(false)
      }
    } else {
      return
    }
  }

  return(
    <li>
      {isEditing ? (
        <>
          <TextInputWithLabel value={workingTitle} onChange={handleEdit} />
          <button type='button' onClick={handleCancel}>Cancel</button>
          <button type='button' onClick={handleUpdate}>Update</button>
        </>
      ) : (
        <>
          <input
            type='checkbox'
            checked={todo.isCompleted}
            onChange={() => onCompleteTodo(todo.id)}
          />
          <span onClick={() => setIsEditing(true)}>{todo.title}</span>
        </>
      )}
    </li>
  )
}

export default TodoListItem
