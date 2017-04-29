export const buildUpdateExpression = (values) => {
  const setExps = []
  const removeExps = []
  const attrNames = {}
  let attrValues = {}
  Object.keys(values).forEach((key) => {
    const value = values[key]
    const attrName = `#${key}`
    const attrValue = `:${key}`
    if (value !== '') {
      setExps.push(`${attrName} = ${attrValue}`)
      attrNames[attrName] = key
      attrValues[attrValue] = value
    } else {
      removeExps.push(`${attrName}`)
      attrNames[attrName] = key
    }
  })
  let exps = ''
  if (setExps.length !== 0) {
    exps += `SET ${setExps.join(', ')} `
  }
  if (removeExps.length !== 0) {
    exps += `REMOVE ${removeExps.join(', ')} `
  }
  if (Object.keys(attrValues).length === 0) {
    // empty attrValues fails at the validation
    attrValues = undefined
  }
  return [exps, attrNames, attrValues]
}

export const fillInsufficientProps = (values, props) => {
  Object.keys(values).forEach((key) => {
    if (!props.hasOwnProperty(key)) {
      props[key] = values[key]
    }
  })
}
