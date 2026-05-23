function FilterInput({ filterTerm, onFilterChange }) {
  return(
    <div>
      <label htmlFor={'filterInput'}>Search todos: </label>
      <input
        id={'filterInput'}
        type='text'
        value={filterTerm}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder='Search title by...'
      />
    </div>
  )
}

export default FilterInput
