import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import assign from 'object-assign'

import { getSelectionStart, getSelectionEnd, setCaretPosition } from '../TimeInput'

import parseFormat from './parseFormat'

export default class DateFormatInput extends Component {

  constructor(props) {
    super(props)

    const { positions, matches } = parseFormat(props.dateFormat)

    const defaultValue = matches.map(match => {
      if (typeof match == 'string'){
        return match
      }

      return match.default
    }).join('')

    this.state = {
      positions,
      matches,
      value: props.defaultValue || defaultValue
    }
  }

  render() {
    const props = this.p = assign({}, this.props)

    props.value = this.state.value

    return <input
      {...props}
      value={props.value}
      onKeyDown={this.onKeyDown}
      onChange={this.onChange}
    />
  }

  onChange(event) {
    event.stopPropagation()
  }

  onKeyDown(event) {
    const props = this.p

    const { key } = event
    const range = this.getSelectedRange()
    const selectedValue = this.getSelectedValue(range)
    const value = props.value

    const { positions, matches } = this.state


    console.log("range", range);
    console.log("positions", positions);
    console.log("matches", matches);
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

  setValue(value, callback) {
    this.setState({
      now: Date.now(),
      value
    }, typeof callback == 'function' && callback)

    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  componentDidUpdate() {
    if (this.updateCallback) {
      this.updateCallback()
      this.updateCallback = null
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
    const value = this.p.value

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
