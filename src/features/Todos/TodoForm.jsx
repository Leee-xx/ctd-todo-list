import { useState, useRef } from 'react'

import Button from 'react-bootstrap/Button'

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
        name="todoTitle"
        placeholder={'Add a new todo item'}
        value={workingTodoTitle}
        onChange={(e) => { setWorkingTodoTitle(e.target.value) } }
        required
      />
      <Button
        type="submit"
        disabled={!isValidTodoTitle(workingTodoTitle)}
        style={{ margin: '10px' }}
      >
        Add Todo
      </Button>
    </form>
  )
}

export default TodoForm
