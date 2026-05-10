import { useState } from 'react'
import TextInputWithLabel from './shared/TextInputWithLabel.jsx'
import { isValidTodoTitle } from './utils/todoValidation.js'
import useEditableTitle from './hooks/useEditableTitle.js'

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const {
    isEditing,
    workingTitle,
    startEditing,
    cancelEdit,
    updateTitle,
    finishEdit
  } = useEditableTitle(todo.title)

  return(
    <li>
      {isEditing ? (
        <>
          <TextInputWithLabel value={workingTitle} onChange={(e) => updateTitle(event.target.value)} />
          <button type='button' onClick={cancelEdit}>Cancel</button>
          <button type='button' onClick={(e) => {
            if (!isEditing) return
            event.preventDefault()
            const finalTitle = finishEdit()
            onUpdateTodo({ ...todo, title: finalTitle })
          }}>Update</button>
        </>
      ) : (
        <>
          <input
            type='checkbox'
            checked={todo.isCompleted}
            onChange={() => onCompleteTodo(todo.id)}
          />
          <span onClick={startEditing}>{todo.title}</span>
        </>
      )}
    </li>
  )
}

export default TodoListItem
