import { useState, useRef } from 'react'

const TodoForm = ({ onAddTodo }) => {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('')
  const inputRef = useRef()

  const handleAddTodo = (event) => {
    event.preventDefault();

    const trimmedTodoTitle = workingTodoTitle.trim()
    if (trimmedTodoTitle) {
      onAddTodo(trimmedTodoTitle);
      setWorkingTodoTitle('')
    }
    inputRef.current.focus();
  };

  return(
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        ref={inputRef}
        type="text"
        id="todoTitle"
        name="todoTitle"
        placeholder={'Todo text'}
        value={workingTodoTitle}
        onChange={(e) => { setWorkingTodoTitle(e.target.value) } }
        required
      />
      <button type="submit" disabled={workingTodoTitle.trim() === ''}>Add Todo</button>
    </form>
  )
}

export default TodoForm
