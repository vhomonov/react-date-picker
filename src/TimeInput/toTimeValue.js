export default ({ value, separator = ':' }) => {
  const parts = value.split(separator)

  const hours = parts[0]
  const minutes = parts[1]
  const seconds = parts[2]

  const result = { hours, minutes }

  if (typeof seconds == 'string' && seconds.length){
    result.seconds = seconds
  }

  return result
}
