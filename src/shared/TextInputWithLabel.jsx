const TextInputWithLabel = ({ elementId, ref, onChange, labelText, value, ...rest }) => {
  return(
    <>
      <label htmlFor={elementId}>{labelText}</label>
      <input
        type='text'
        ref={ref}
        value={value}
        id={elementId}
        onChange={onChange}
        {...rest}
      />
    </>
  )

}

export default TextInputWithLabel
