import { useState, useRef } from 'react'
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx'
import { isValidTodoTitle } from '../../utils/todoValidation.js'

const TodoForm = ({ onAddTodo }) => {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('')
  const inputRef = useRef()

  const handleAddTodo = (event) => {
    event.preventDefault();

    if (isValidTodoTitle(workingTodoTitle)) {
      onAddTodo(workingTodoTitle.trim());
      setWorkingTodoTitle('')
    }
    inputRef.current.focus();
  };

  return(
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        ref={inputRef}
        type="text"
        elementId="todoTitle"
        labelText='Todo'
        name="todoTitle"
        placeholder={'Todo text'}
        value={workingTodoTitle}
        onChange={(e) => { setWorkingTodoTitle(e.target.value) } }
        required
      />
      <button type="submit" disabled={!isValidTodoTitle(workingTodoTitle)}>Add Todo</button>
    </form>
  )
}

export default TodoForm
