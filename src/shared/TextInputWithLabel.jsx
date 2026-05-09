const TextInputWithLabel = ({ elementId, ref, onChange, labelText, value }) => {
  return(
    <>
      <label htmlFor={elementId}>{labelText}</label>
      <input
        type='text'
        ref={ref}
        value={value}
        id={elementId}
        onChange={onChange}
      />
    </>
  )

}

export default TextInputWithLabel
