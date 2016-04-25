export default (moment, [start, end]) => {

  if (!moment){
    return false
  }

  if (start, end){
    return start.isSameOrBefore(moment) && end.isSameOrAfter(moment)
  }

  return false
}
