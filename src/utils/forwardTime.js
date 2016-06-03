export default (from, to) => {
  ['hour', 'minute', 'second', 'millisecond'].forEach(part => {
    to.set(part, from.get(part))
  })

  return to
}
