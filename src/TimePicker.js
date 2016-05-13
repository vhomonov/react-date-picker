import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import moment from 'moment'
import assign from 'object-assign'

import toMoment from './toMoment'
import join from './join'
import Clock from './Clock'

import {Flex, Item} from 'react-flex'

export default class TimePicker extends Component {

  constructor(props){
    super(props)

    this.state = {}
  }
  prepareDate(props){
    return toMoment(props.date, props)
  }

  render(){

    const props = this.p = assign({}, this.props)
    props.children = React.Children.toArray(props.children)

    const dateFormat = props.dateFormat.toLowerCase()

    props.date = this.prepareDate(props)
    props.hasTime = props.hasTime || dateFormat.indexOf('k') != -1 || dateFormat.indexOf('h') != -1

    const className = join(
      props.className,
      'react-date-picker__time-picker',
      props.theme && `react-date-picker__time-picker--theme-${props.theme}`
    )

    return <Flex
      inline
      column
      wrap={false}
      {...this.props}
      className={className}>
      {this.renderClock()}
      {this.renderInput()}
    </Flex>
  }

  renderInput(){
    return <input defaultValue="00:00" onChange={this.onTimeChange}/>
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

TimePicker.defaultProps = {
  dateFormat: 'YYYY-MM-DD',

  theme: 'default',

  isTimePicker: true
}

TimePicker.propTypes = {
}
