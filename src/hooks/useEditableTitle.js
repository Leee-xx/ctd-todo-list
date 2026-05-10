import { useState } from 'react'

export function useEditableTitle(initialTitle) {
  const [isEditing, setIsEditing] = useState(false)
  const [workingTitle, setWorkingTitle] = useState(initialTitle)

  const startEditing = () => {
    setWorkingTtile(initialTitle)
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setWorkingTitle(initialValue)
    setIsEditing(false)
  }

  const updateTitle = (newTitle) => {
    setWorkingTitle(newTitle)
  }

  const finishEdit = () => {
    setIsEditing(false)
    return workingTitle
  }

  return {
    isEditing,
    workingTitle,
    startEditing,
    cancelEdit,
    updateTitle,
    finishEdit
  }
}
