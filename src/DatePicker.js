import React from 'react'
import Component from 'react-class'

import assign from 'object-assign'

import MonthView from './MonthView'
import TransitionView from './TransitionView'
import toMoment from './toMoment'
import join from './join'
import Clock from './Clock'

import { Flex } from 'react-flex'

export default class DatePicker extends Component {

  prepareDate(props) {
    return toMoment(props.date, props)
  }

  render() {
    const props = this.p = assign({}, this.props)
    const dateFormat = props.dateFormat.toLowerCase()

    props.date = this.prepareDate(props)
    props.hasTime = props.hasTime || dateFormat.indexOf('k') != -1 || dateFormat.indexOf('h') != -1

    const className = join(
      props.className,
      'react-date-picker__date-picker',
      props.theme && `react-date-picker__date-picker--theme-${props.theme}`
    )

    return <Flex row wrap={false} className={className} style={props.style}>

      <MonthView {...this.props} className={null} style={null} ref={view => { this.view = view }} />

      {props.hasTime && this.renderClock()}
    </Flex>
  }

  onViewKeyDown(...args) {
    this.view.onViewKeyDown(...args)
  }

  renderClock() {
    const props = this.p
    const clock = React.Children
                  .toArray(props.children)
                  .filter(child => child && child.props && child.props.isDatePickerClock)[0]

    const clockProps = {
      time: props.date,
      showMinutesHand: props.dateFormat.indexOf('mm') != -1,
      showSecondsHand: props.dateFormat.indexOf('ss') != -1
    }

    if (clock) {
      return React.cloneElement(clock, clockProps)
    }

    return <Clock {...clockProps} />
  }
}

DatePicker.defaultProps = {
  dateFormat: 'YYYY-MM-DD',

  theme: 'default',

  isDatePicker: true
}

DatePicker.propTypes = {
}
