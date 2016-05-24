import assign from 'object-assign'
import FORMATS from './formats'

const SUGGESTIONS = {
  Y: ['YYYY', 'YY'],
  M: ['MM'],
  D: ['DD'],
  H: ['HH'],
  h: ['hh'],
  m: ['mm'],
  s: ['ss']
}

export default (format) => {
  let index = 0
  let start = index

  let suggestions
  let suggestionMatch

  const positions = []
  const matches = []

  while (index < format.length) {
    const char = format[index]
    const match = FORMATS[char]
    let matchObject

    suggestionMatch = null
    suggestions = SUGGESTIONS[char]

    if (!match && !suggestions) {
      positions[index] = char
      matches.push(char)
    } else {
      if (suggestions && suggestions.length){
        //it might be a longer match
        suggestionMatch = suggestions.filter(s => {
          return format.substr(index, s.length) == s
        })[0]
      }

      if (!suggestionMatch){
        if (!FORMATS[char]){
            console.warn(`Format ${char} is not supported yet! ${suggestions? "Use one of [" + suggestions.join(',') + "]":""}`)
            positions[index] = char
            matches.push(char)
        } else {
          //we found a match, with no other suggestion
          matchObject = assign({}, FORMATS[char], {format: char, start: index, end: index})
          positions[index] = matchObject
          matches.push(matchObject)
        }
      } else {
        matchObject = assign({}, FORMATS[suggestionMatch], { format: suggestionMatch, start: index })
        matches.push(matchObject)

        let endIndex = index + suggestionMatch.length

        matchObject.end = endIndex - 1
        while (index < endIndex){
          positions[index] = matchObject
          index++
        }
        continue;//to skip incrementing index once more
      }
    }

    index++
  }

  return { positions, matches }
}
