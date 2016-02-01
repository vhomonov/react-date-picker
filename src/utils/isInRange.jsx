module.exports = function(moment, [start, end]){
  if (start, end){
    return moment.isBetween(start, end)
  }

  if (!start && !end){
    return false
  }

  if (!end){
    //there's no end
    return moment.isAfter(start)
  }

  //there's no start
  return moment.isBefore(end)
}
