import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx'
import { useEditableTitle } from '../../hooks/useEditableTitle.js'
import { isValidTodoTitle } from '../../utils/todoValidation.js'

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
      <form onSubmit={onUpdateTodo}>
      {isEditing ? (
        <>
          <TextInputWithLabel labelText={''} value={workingTitle} onChange={(e) => updateTitle(e.target.value)} />
          <button type='button' onClick={cancelEdit}>Cancel</button>
          <button
            type='button'
            onClick={(e) => {
                if (!isEditing) return
                e.preventDefault()
                const finalTitle = finishEdit()
                onUpdateTodo({ ...todo, title: finalTitle })
            }}
            disabled={!isValidTodoTitle(workingTitle)}
          >
            Update
          </button>
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
      </form>
    </li>
  )
}

export default TodoListItem
