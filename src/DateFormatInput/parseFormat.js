import assign from 'object-assign'

const FORMATS = {

  YYYY: {
    min: 1900,
    max: 2200,
    default: '2000'
  },

  YY: {
    default: '00'
  },

  M: { min: 1, max: 12, default: '1', maxLen: 2 },
  MM: { min: 1, max: 12, default: '01' },

  D: { min: 1, max: 31, default: '1', maxLen: 2 },
  DD: { min: 1, max: 31, default: '01' },

  H: { min: 0, max: 23, default: '0', maxLen: 2 },
  HH: { min: 0, max: 23, default: '00' },

  h: { min: 1, max: 12, default: '1', maxLen: 2 },
  hh: { min: 1, max: 12, default: '01'},

  a: { default: 'am' },
  A: { default: 'AM'},

  m: { min: 0, max: 59, default: '0', maxLen: 2 },
  mm: { min: 0, max: 59, default: '00' },

  s: { min: 0, max: 59, default: '0' },
  ss: { min: 0, max: 59, default: '00' }
}

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
        //we found a match, with no other suggestion
        matchObject = assign({}, FORMATS[char], {format: char})
        positions[index] = matchObject
        matches.push(matchObject)
      } else {
        matchObject = assign({}, FORMATS[suggestionMatch], { format: suggestionMatch })
        matches.push(matchObject)

        let endIndex = index + suggestionMatch.length
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
