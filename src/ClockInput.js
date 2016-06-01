import React from 'react'
import Component from 'react-class'

import join from './join'

import toMoment from './toMoment'
import Clock from './Clock'
import DateFormatInput from './DateFormatInput'

import throttle from 'lodash.throttle'

import { Flex } from 'react-flex'

export default class ClockInput extends Component {

  constructor(props) {
    super(props)

    const delay = props.throttle || 100
    this.throttleSetValue = delay == -1 ? this.setValue : throttle(this.setValue, delay)

    this.state = {
      value: props.defaultValue || Date.now()
    }
  }

  render() {
    const props = this.props
    const format = props.dateFormat || props.format

    const dateFormat = format.substring(format.toLowerCase().indexOf('hh'))

    this.dateFormat = dateFormat

    this.value = props.value !== undefined ? props.value : this.state.value

    const className = join(
      props.className,
      'react-date-picker__clock-input',
      props.theme && `react-date-picker__clock-input--theme-${props.theme}`
    )

    return <Flex
      column
      {...this.props}
      value={null}
      defaultValue={null}
      className={className}
    >
      {this.renderClock()}
      {this.renderTimeInput()}
    </Flex>
  }

  renderTimeInput() {
    return <DateFormatInput
      tabIndex={0}
      {...this.props}
      ref={(field) => { this.field = field }}
      value={this.value}
      dateFormat={this.dateFormat}
      onChange={this.onChange}
    />
  }

  focus() {
    if (this.field) {
      this.field.focus()
    }
  }

  onChange(value) {
    if (this.props.value === undefined) {
      this.setState({
        value
      })
    }

    if (this.props.onChange) {
      this.throttleSetValue(value)
    }
  }

  setValue(value) {
    if (this.props.value === undefined) {
      this.setState({
        value
      })
    }

    if (this.props.onChange) {
      this.props.onChange(value, this.dateFormat)
    }
  }

  renderClock() {
    const props = this.props
    const clock = React.Children
                  .toArray(props.children)
                  .filter(child => child && child.props && child.props.isDatePickerClock)[0]

    const dateFormat = this.dateFormat
    const time = toMoment(this.value, { dateFormat })

    const clockProps = {
      time,
      showMinutesHand: dateFormat.indexOf('mm') != -1,
      showSecondsHand: dateFormat.indexOf('ss') != -1
    }

    if (clock) {
      return React.cloneElement(clock, clockProps)
    }

    return <Clock {...clockProps} />
  }
}

ClockInput.defaultProps = {
  dateFormat: 'YYYY-MM-DD',

  theme: 'default',

  wrapTime: false,

  onTimeChange: () => {}
}

ClockInput.propTypes = {
}
