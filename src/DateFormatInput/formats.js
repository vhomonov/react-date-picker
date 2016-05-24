import leftPad from '../utils/leftPad'
import clamp, { clampHour } from '../utils/clamp'
import times from '../utils/times'

const isValid = (value, format) => {
  value *= 1
  return value >= format.min && value <= format.max
}

const replaceAt = ({ value, index, len = 1, str }) => {
  return value.substring(0, index) + str + value.substring(index + len)
}

const insertAt = ({ value, index, str }) => {
  return value.substring(0, index) + str + value.substring(index)
}


const handlePage = (format, config) => {
  config.dir = config.dir || (config.key == 'PageUp'? 10: -10)

  return handleArrow(format, config)
}

const handlePageLeftPad = (format, config) => {
  config.dir = config.dir || (config.key == 'PageUp'? 10: -10)

  return handleArrowLeftPad(format, config)
}

const handleArrow = (format, { currentValue, key, dir }) => {
  dir = dir || (key == 'ArrowUp'? 1: -1)

  return {
    value: clamp(currentValue * 1 + dir, {
      min: format.min,
      max: format.max,
      circular: false
    }),
    caretPos: true
  }
}

const handleUpdate = (value, format, { range }) => {
  value *= 1

  const index = range.start - format.start

  const len = range.end - range.start + 1
  const pow10 = ('1' + times(3 - len).map(_ => '0').join('')) * 1
  const modLen = value % pow10

  let newValue = clamp(value, { min: format.min, max: format.max, circular: false })

  if (pow10 > 1 && (value % pow10 == 0)){
    //the user is modifying the millenium or century
    newValue += modLen
    //so we try to keep the century
    newValue = clamp(newValue, { min: format.min, max: format.max, circular: false })
  }

  return newValue
}

const handleUnidentified = (format, { key, event, currentValue, range }) => {
  const newChar = String.fromCharCode(event.which)
  let index = range.start - format.start

  const caretPos = { start: range.start + 1 }

  if (newChar * 1 != newChar){
    // console.log("'not number'");
    return {
      value: currentValue,
      caretPos
    }
  }

  let value
  let valid
  do {
    value = replaceAt({ value: currentValue, index, str: newChar })
    valid = isValid(value, format)
    index++

    if (!valid){
      caretPos.start++
    }
  } while (!valid && index <= format.end)

  if (valid){
    value = handleUpdate(value, format, { range })
  } else {
    const defaultValue = format.default
    value = 1 * replaceAt({ value: defaultValue, index: defaultValue.length - 1, str: newChar})

    if (isValid(value, format)){
      caretPos.start = format.start + defaultValue.length
    } else {
      caretPos.start = range.start + 1
      value = currentValue
    }
  }

  return {
    value,
    caretPos
  }
}

const handleUnidentifiedLeftPad = (format, config) => {
  const { value, caretPos } = handleUnidentified(format, config)

  return {
    value: leftPad(value),
    caretPos
  }
}

const handleArrowLeftPad = (format, config) => {
  const { value, caretPos } = handleArrow(format, config)

  return {
    value: leftPad(value),
    caretPos
  }
}

const handleYearUnidentified = handleUnidentified
const handleYearUpdate = handleUpdate

const handleDelete = (format, { range, currentValue, dir }) => {

  dir = dir || 0

  if (range.start <= format.start && range.end >= format.end){
    return {
      value: format.default,
      caretPos: true
    }
  }

  const len = range.end - range.start + 1
  const str = times(len).map(_ => '0').join('')
  const index = range.start - format.start + dir

  let value = replaceAt({ value: currentValue, index, str, len }) * 1

  value = leftPad(handleUpdate(value, format, { range }))

  return {
    value,
    caretPos: { start: range.start + (dir < 0? -1: 1) }
  }
}

const handleBackspace = (format, config) => {
  config.dir = -1
  return handleDelete(format, config)
}

const FORMATS = {

  YYYY: {
    min: 1900,
    max: 2400,
    default: '2000',
    handleDelete,
    handleBackspace,
    handleArrow,
    handlePageUp: handlePage,
    handlePageDown: handlePage,
    handleUnidentified: handleYearUnidentified
  },

  // YY: {
  //   default: '00'
  // },

  // M: { min: 1, max: 12, default: '1', maxLen: 2 },
  MM: {
    min: 1,
    max: 12,
    default: '01',
    handleDelete,
    handleBackspace,
    handleUnidentified: handleUnidentifiedLeftPad,
    handleArrow: handleArrowLeftPad
  },

  // D: { min: 1, max: 31, default: '1', maxLen: 2 },
  DD: {
    min: 1,
    max: 31,
    default: '01',
    handleDelete,
    handleBackspace,
    handleUnidentified: handleUnidentifiedLeftPad,
    handleArrow: handleArrowLeftPad
  },

  // H: {
  //   min: 0, max: 23, default: '0', maxLen: 2,
  //   handleDelete,
  //   handleBackspace,
  //   handleArrow: handleArrowLeftPad,
  //   handlePageUp: handlePageLeftPad,
  //   handlePageDown: handlePageLeftPad
  // },
  HH: {
    min: 0, max: 23, default: '00',
    handleDelete,
    handleBackspace,
    handleUnidentified: handleUnidentifiedLeftPad,
    handleArrow: handleArrowLeftPad,
    handlePageUp: handlePageLeftPad,
    handlePageDown: handlePageLeftPad
  },

  // h: { min: 1, max: 12, default: '1', maxLen: 2,
  //   handleArrow: handleArrowLeftPad,
  //   handlePageUp: handlePageLeftPad,
  //   handlePageDown: handlePageLeftPad
  // },
  hh: { min: 1, max: 12, default: '01',
    handleDelete,
    handleBackspace,
    handleUnidentified: handleUnidentifiedLeftPad,
    handleArrow: handleArrowLeftPad,
    handlePageUp: handlePageLeftPad,
    handlePageDown: handlePageLeftPad
  },

  a: { default: 'am' },
  A: { default: 'AM'},

  // m: { min: 0, max: 59, default: '0', maxLen: 2 },
  mm: { min: 0, max: 59, default: '00',
    handleDelete,
    handleBackspace,
    handleUnidentified: handleUnidentifiedLeftPad,
    handleArrow: handleArrowLeftPad,
    handlePageUp: handlePageLeftPad,
    handlePageDown: handlePageLeftPad
  },

  // s: { min: 0, max: 59, default: '0' },
  ss: {
    min: 0, max: 59, default: '00',
    handleDelete,
    handleBackspace,
    handleUnidentified: handleUnidentifiedLeftPad,
    handleArrow: handleArrowLeftPad,
    handlePageUp: handlePageLeftPad,
    handlePageDown: handlePageLeftPad
  }
}

export default FORMATS
