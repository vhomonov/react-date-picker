import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import debounce from 'lodash.debounce'

import assign from 'object-assign'

import { getSelectionStart, getSelectionEnd, setCaretPosition } from '../TimeInput'

import toMoment from '../toMoment';

import toUpperFirst from './toUpperFirst';
import parseFormat from './parseFormat'

const BACKWARDS = {
  Backspace: 1,
  ArrowUp: 1,
  ArrowDown: 1,
  PageUp: 1,
  PageDown: 1
}

export default class DateFormatInput extends Component {

  constructor(props) {
    super(props)

    const { positions, matches } = parseFormat(props.dateFormat)
    const defaultValue = props.defaultValue || Date.now()

    this.debounceSetValue = debounce(this.setValue, 100)

    this.state = {
      positions,
      matches,
      propsValue: props.value !== undefined,
      value: defaultValue
    }

  }

  toMoment(value, dateFormat) {
    const props = this.props

    return toMoment(value, {
      locale: props.locale,
      dateFormat: dateFormat || props.dateFormat
    })
  }

  render() {
    const { props } = this

    const value = this.state.propsValue?
                    props.value:
                    this.state.value

    const displayValue =
      this.displayValue =
        this.toMoment(value).format(props.dateFormat)

    return <input
      {...props}
      value={displayValue}
      onKeyDown={this.onKeyDown}
      onChange={this.onChange}
    />
  }

  onChange(event) {
    event.stopPropagation()
  }

  onKeyDown(event) {
    const { props } = this

    if (props.onKeyDown){
      props.onKeyDown(event)
    }

    const { key } = event
    const range = this.getSelectedRange()
    const selectedValue = this.getSelectedValue(range)
    const value = this.displayValue

    const { positions, matches } = this.state
    const valueStr = value + ''

    let currentPosition = positions[range.start]

    if (typeof currentPosition == 'string'){
      currentPosition = positions[range.start + (key in BACKWARDS? -1: 1)]
    }

    if (!currentPosition){
      currentPosition = positions[range.start - 1]
    }

    let keyName = key

    if (key == 'ArrowUp' || key == 'ArrowDown') {
      keyName = 'Arrow'
    }

    const handlerName = 'handle' + keyName
    let preventDefault

    if (currentPosition && currentPosition[handlerName]){
      const returnValue = currentPosition[handlerName](currentPosition, {
        range,
        selectedValue,
        value,
        positions,
        currentValue: valueStr.substring(currentPosition.start, currentPosition.end + 1),
        matches,
        event,
        key,
        input: this.getInput(),
        setCaretPosition: (...args) => this.setCaretPosition(...args)
      })

      if (returnValue && returnValue.value !== undefined){

        const newValue = valueStr.substring(0, currentPosition.start) +
                          returnValue.value +
                          valueStr.substring(currentPosition.end + 1)

        const updateCaretPos = () => {
          let caretPos = returnValue.caretPos || range

          if (caretPos === true){
            caretPos = { start: currentPosition.start, end: currentPosition.end + 1 }
          }

          this.setCaretPosition(caretPos)
        }

        this.setStateValue(newValue, updateCaretPos)

        preventDefault = true
      }
    }

    if (preventDefault || key == 'Backspace' || key == 'Delete'){//} || key == 'Unidentified'){

      if (!preventDefault){
        this.setCaretPosition({
          start: range.start + (key == 'Backspace'? -1: 1)
        })
      }

      event.preventDefault()
    }
  }

  getInput() {
    return findDOMNode(this)
  }

  setCaretPosition(pos) {
    const dom = this.getInput()
    if (dom) {
      setCaretPosition(dom, pos)
    }
  }

  setStateValue(value, callback){

    if (!this.toMoment(value).isValid()){
      return
    }

    this.setState({
      value,
      propsValue: false
    }, typeof callback == 'function' && callback)

    if (this.props.value !== undefined){
      this.debounceSetValue(value)
    }
  }

  setValue(value, callback) {

    if (this.props.value === undefined){
      this.setState({
        value,
        propsValue: false
      }, typeof callback == 'function' && callback)
    } else {
      this.setState({
        propsValue: true,
        value: undefined
      })
    }

    if (this.props.onChange) {
      this.props.onChange(value, { dateMoment: this.toMoment(value) })
    }
  }

  getSelectedRange() {
    const dom = this.getInput()

    return {
      start: getSelectionStart(dom),
      end: getSelectionEnd(dom)
    }
  }

  getSelectedValue(range) {
    range = range || this.getSelectedRange()
    const value = this.displayValue

    return value.substring(range.start, range.end)
  }
}

DateFormatInput.defaultProps = {
  theme: 'default',

  circular: true,
  propagate: true
}

DateFormatInput.propTypes = {
  format: PropTypes.string,
  value: (props, propName) => {
    if (props[propName] !== undefined) {
      console.warn('Due to performance considerations, TimeInput will only be uncontrolled.')
    }
  }
}
