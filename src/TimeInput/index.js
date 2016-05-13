import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import raf from 'raf'

import moment from 'moment'
import assign from 'object-assign'

import toMoment from '../toMoment'
import join from '../join'
import Clock from '../Clock'

import {Flex, Item} from 'react-flex'

import getSelectionStart from './getSelectionStart'
import getSelectionEnd from './getSelectionEnd'
import setCaretPosition from './setCaretPosition'
import getNewValue from './getNewValue'

export default class TimeInput extends Component {

  constructor(props){
    super(props)

    this.state = {
      value: props.defaultValue || '00:00:00'
    }
  }

  render(){

    const props = this.p = assign({}, this.props)

    props.value = props.value !== undefined?
                    props.value:
                    this.state.value

    return <input
        {...props}
        value={props.value}
        onKeyDown={this.onKeyDown}
        onChange={this.onChange}
      />
  }

  onChange(event){
    event.stopPropagation()
  }

  onKeyDown(event){

    const value = this.p.value

    if (this.props.onKeyDown){
      this.props.onKeyDown(event)
    }

    const range = this.getSelectedRange()
    const separator = this.props.separator || ':'

    const { value: newValue, update, caretPos } = getNewValue({

      range,
      event,

      circular: this.props.circular,
      propagate: this.props.propagate,

      oldValue: value,
      separator,
      incrementNext: this.props.incrementNext
    })

    const updateCaretPos = () => {
      if (caretPos != undefined){
        this.setCaretPosition(caretPos)
      }
    }

    if (update || caretPos){
      event.preventDefault()
    }

    if (update){
      this.setValue(newValue, updateCaretPos)
    } else {
      raf(updateCaretPos)
    }
  }

  getInput(){
    return findDOMNode(this)
  }

  setCaretPosition(pos){
    const dom = this.getInput()
    dom && setCaretPosition(dom, pos)
  }

  setValue(value, callback){

    // console.log('SETTING value', value)

    if (this.props.value === undefined){
      this.setState({
        now: Date.now(),
        value
      }, typeof callback == 'function' && callback)
    } else {
      // raf(() => {
        typeof callback == 'function' && callback()
      // })
      // this.updateCallback = callback
    }

    if (this.props.onChange){
      this.props.onChange(value)
    }
  }

  componentWillReceiveProps(){
    if (this.updateCallback){
      // debugger
      this.updateCallback()
      this.updateCallback = null
    }
  }

  getSelectedRange(){
    const dom = this.getInput()

    return {
      start: getSelectionStart(dom),
      end  : getSelectionEnd(dom)
    }
  }

  getSelectedValue(){
    const range = this.getSelectedRange()
    const value = this.p.value

    return value.substring(range.start, range.end)
  }

  onChange(event){
    const value = event.target.value
  }

  onTimeChange(value){
    const time = value.split(':')

    this.setState({
      minutes: time[0] * 60 + time[1]
    })
  }

  renderClock(){

    const props = this.p
    const clock = props.children
                  .filter(child => child && child.props && child.props.isTimePickerClock)[0]

    const clockProps = {
      time: this.state.minutes || props.date,
      showSecondsHand: true
    }

    if (clock){
      return React.cloneElement(clock, clockProps)
    }

    return <Clock {...clockProps} />
  }
}

TimeInput.defaultProps = {
  theme: 'default',

  circular: true,
  propagate: true,
  incrementNext: true
}

TimeInput.propTypes = {
}
