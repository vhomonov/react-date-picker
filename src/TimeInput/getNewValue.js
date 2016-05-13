import toTimeValue from './toTimeValue'
import leftPad from './leftPad'
import { clampHour, clampMinute, clampSecond, clampNamed } from './clamp'

const removeAt = ({ value, index, len = 1 }) => {
  return value.substring(0, index) + value.substring(index + len)
}

const replaceAt = ({ value, index, len = 1, str }) => {
  return value.substring(0, index) + str + value.substring(index + len)
}

const replaceBetween = ({ value, start, end, str }) => {
  return (value.substring(0, start) || '') + str + (value.substring(end) || '')
}

const getValueOnDelete = ({ oldValue, range, key, separator }) => {
  const { start, end } = range

  const selectedValue = oldValue.substring(start, end)

  let value

  if (selectedValue){

    const replacement = selectedValue.split('')
                          .map(c => c == separator? c: 0)
                          .join('')

    value = replaceBetween({ value: oldValue, start, end, str: replacement })

    return {
      value,
      update: value != oldValue,
      caretPos: key == 'Backspace' ? start : end
    }

  } else {

    const back = key == 'Backspace'
    const index = start + (back? -1: 0)
    const caretPos = start + (back? -1: 1)

    const char = oldValue[index]

    value = oldValue

    if (char && char != separator){
      value = replaceAt({ value: oldValue, index, str: 0 })
    }

    return {
      update: value != oldValue,
      value,
      caretPos
    }
  }
}

const ARROWS = {
  ArrowUp: 1,
  ArrowDown: -1,
  PageUp: 10,
  PageDown: -10
}

const TIME_PARTS = [
  { start: 0, end: 2, name: 'hours', max: 23 },
  { start: 3, end: 5, name: 'minutes', max: 59 },
  { start: 6, end: 8, name: 'seconds', max: 59 }
]

const getActiveTimePartIndex = ({ value, separator, range }) => {
  const { start } = range

  let partIndex = 0
  let currentPart

  while (currentPart = TIME_PARTS[partIndex]){

    if (start >= currentPart.start && start <= currentPart.end){
      return partIndex
    }

    partIndex++
  }

  return null
}

const getTimePartAt = (index) => {
  return TIME_PARTS[index]
}

const getActiveTimePart = ({ value, separator, range }) => {

  const index = getActiveTimePartIndex({ value, separator, range })

  return getTimePartAt(index)
}

const getValueOnDirection = ({ oldValue, range, separator, dir, incrementNext, circular, propagate }) => {
  const { start, end } = range

  let value

  const timeParts = toTimeValue({ value: oldValue, separator })
  const activeTimePart = getActiveTimePart({ value: oldValue, separator, range})

  timeParts[activeTimePart.name] = dir + timeParts[activeTimePart.name] * 1

  let { hours, minutes, seconds } = timeParts

  hours *= 1
  minutes *= 1

  if (seconds){
    seconds *= 1
  }

  if (seconds && (seconds > 59 || seconds < 0) && incrementNext){

    if (propagate){
      minutes += seconds > 59? 1: -1
    }
    if (circular){
      seconds %= 60

      if (seconds < 0){
        seconds = 60 + seconds
      }
    }
  }

  if (minutes && (minutes > 59 || minutes < 0) && incrementNext){
    if (propagate){
      hours += minutes > 59? 1: -1
    }

    if (circular){
      minutes %= 60

      if (minutes < 0){
        minutes = 60 + minutes
      }
    }
  }

  hours = leftPad(clampHour(hours * 1, { circular }))
  minutes = leftPad(clampMinute(minutes * 1, { circular }))

  if (seconds != undefined){
    seconds = leftPad(clampSecond(seconds * 1, { circular }))
  }

  value = hours + separator + minutes

  if (seconds){
    value += separator + seconds
  }

  return {
    value,
    caretPos: activeTimePart || range.start,
    update: oldValue != value
  }
}

const getValueOnNumber = ({ oldValue, num, range, separator, circular }) => {
  const activeTimePartIndex = getActiveTimePartIndex({ value: oldValue, separator, range })
  let activeTimePart = getTimePartAt(activeTimePartIndex)

  if (range.start == range.end && activeTimePart.end == range.end){
    activeTimePart = getTimePartAt(activeTimePartIndex + 1)
  }

  if (!activeTimePart){
    return {
      value,
      update: false
    }
  }

  const name = activeTimePart.name
  const timeParts = toTimeValue({ value: oldValue, separator })

  const timePartValue = timeParts[name] + ''

  let caretPos

  if (range.start <= activeTimePart.start){
    const maxFirstChar = (activeTimePart.max + '').charAt(0) * 1

    caretPos = range.start + (num > maxFirstChar?
                        3:
                        range.start < activeTimePart.start?
                          2:
                          1
                      )
    timeParts[name] = num > maxFirstChar?
                                      '0' + num:
                                      num + timeParts[name].charAt(1)
  } else {
    caretPos = range.start + 2
    timeParts[name] = clampNamed(name, replaceAt({ value: timePartValue, index: 1, str: num }) * 1, { circular })
  }

  let { hours, minutes, seconds } = timeParts

  let value = hours + separator + minutes

  if (seconds){
    value += separator + seconds
  }

  return {
    value,
    caretPos,
    update: true//value != oldValue
  }

}

export default function({ oldValue, range, event, separator = ':', incrementNext, circular, propagate }){

  const newChar = String.fromCharCode(event.which)
  const { start, end } = range
  const { key } = event

  if (key == 'Delete' || key == 'Backspace'){
    return getValueOnDelete({
      key,
      oldValue,
      range,
      separator
    })
  }

  const dir = ARROWS[key]

  if (dir){
    return getValueOnDirection({
      dir,
      oldValue,
      range,
      circular,
      propagate,
      separator,
      incrementNext
    })
  }

  if (key == 'Unidentified' && newChar * 1 == newChar){
    return getValueOnNumber({
      num: newChar * 1,
      circular,
      separator,
      oldValue,
      range
    })
  }

  return {
    value: oldValue
  }
}
