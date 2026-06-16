const TextInputWithLabel = ({
  elementId,
  ref,
  onChange,
  labelText,
  value,
  type = 'text',
  ...rest
}) => {
  return(
    <>
      <label className='input-label' htmlFor={elementId}>{labelText}</label>
      <input
        type={type}
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
