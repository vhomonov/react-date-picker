import React from 'react'
import Component from 'react-class'

import assign from 'object-assign'

import MonthView, { NAV_KEYS } from './MonthView'
import toMoment from './toMoment'
import join from './join'
import ClockInput from './ClockInput'

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

    const timeFormat = dateFormat.substring(dateFormat.toLowerCase().indexOf('hh'))

    props.timeFormat = timeFormat

    const className = join(
      props.className,
      'react-date-picker__date-picker',
      props.theme && `react-date-picker__date-picker--theme-${props.theme}`
    )

    const monthView = <MonthView
      {...this.props}
      className={null}
      style={null}
      ref={view => { this.view = view }}
      renderChildren={this.renderChildren}
    />

    return <Flex row wrap={false} className={className} style={props.style}>
      {monthView}
    </Flex>
  }

  renderChildren([navBar, inner, footer]) {
    const props = this.p
    const timePart = props.hasTime && this.renderTimePart()

    const children = [
      navBar,
      <Flex justifyContent="center" wrap={this.props.wrap || this.props.wrapTime}>
        <Flex flex column wrap={false} alignItems="stretch" children={inner} />
        {timePart}
      </Flex>,
      footer
    ]

    return <Flex
      column
      wrap={false}
      alignItems="stretch"
      children={children}
    />
  }

  focus() {
    if (this.view) {
      this.view.focus()
    }
  }

  onViewKeyDown(...args) {
    this.view.onViewKeyDown(...args)
  }

  renderTimePart() {
    return <ClockInput
      dateFormat={this.p.dateFormat}
      defaultValue={this.p.date}
      onChange={this.onTimeChange}
    />
  }

  onTimeChange(value, timeFormat) {
    this.props.onTimeChange(value, timeFormat)
  }
}

DatePicker.defaultProps = {
  dateFormat: 'YYYY-MM-DD',

  theme: 'default',

  isDatePicker: true,
  wrapTime: false,

  onTimeChange: () => {}
}

DatePicker.propTypes = {
}

export {
  NAV_KEYS
}
