export default (moment, configOrRange) => {

  let range = configOrRange
  let inclusive = true

  if (typeof configOrRange == 'object'){
    range = configOrRange.range

    if (configOrRange.inclusive !== undefined){
      inclusive = !!configOrRange.inclusive
    }
  }

  const start = range[0]
  const end = range.length >= 2 && range[range.length - 1]

  if (!moment){
    return false
  }

  if (start && end){
    return inclusive?
      start.isSameOrBefore(moment) && end.isSameOrAfter(moment):
      start.isBefore(moment) && end.isAfter(moment)
  }

  return false
}
