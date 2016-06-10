export default (from, to) => {
  ['hour', 'minute', 'second', 'millisecond'].forEach(part => {
    to.set(part, (from.get ? from.get(part) : from[part]))
  })

  return to
}
