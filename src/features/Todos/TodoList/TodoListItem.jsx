import Button from 'react-bootstrap/Button'

import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx'
import { useEditableTitle } from '../../../hooks/useEditableTitle.js'
import { isValidTodoTitle } from '../../../utils/todoValidation.js'

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const {
    isEditing,
    workingTitle,
    startEditing,
    cancelEdit,
    updateTitle,
    finishEdit
  } = useEditableTitle(todo.title)

  function handleUpdate(e) {
    if (!isEditing) return
    e.preventDefault()
    const finalTitle = finishEdit()
    onUpdateTodo({ ...todo, title: finalTitle })
  }

  return(
    <li>
      <form onSubmit={handleUpdate}>
      {isEditing ? (
        <>
          <TextInputWithLabel labelText={'Edit: '} elementId={todo.id} value={workingTitle} onChange={(e) => updateTitle(e.target.value)} />
          <Button
            onClick={handleUpdate}
            className='btn-margin'
            disabled={!isValidTodoTitle(workingTitle)}
          >
            Update
          </Button>
          <Button
            className='btn-margin'
            onClick={cancelEdit}
            variant='secondary'
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <input
            type='checkbox'
            checked={todo.isCompleted}
            onChange={() => onCompleteTodo(todo.id)}
          />
          <span className={`todo-title ${todo.isCompleted ? 'completed' : ''}`} onClick={startEditing}>{todo.title}</span>
        </>
      )}
      </form>
    </li>
  )
}

export default TodoListItem
