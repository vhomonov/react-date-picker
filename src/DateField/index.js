import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'
import assign from 'object-assign'

import { Flex } from 'react-flex'
import Input from 'react-field'
import DateFormatInput from '../DateFormatInput'

import InlineBlock from 'react-inline-block'

import { CLEAR_ICON } from './icons'
import moment from 'moment'
import join from '../join'
import toMoment from '../toMoment'
import DatePicker from '../DatePicker'

const getPicker = (props) => {
  return React.Children.toArray(props.children)
    .filter(c => c && c.props && c.props.isDatePicker)[0]
    || <DatePicker />
}

const FIND_INPUT = c => c && (c.type === 'input' || (c.props && c.isDateInput))

const ARROW_KEYS = {
  ArrowUp: 1,
  ArrowDown: 1,
  ArrowLeft: 1,
  ArrowRight: 1
}

const joinFunctions = (a, b) => {
  if (a && b) {
    return (...args) => {
      a(...args)
      b(...args)
    }
  }

  return a || b
}

const preventDefault = (event) => {
  event.preventDefault()
}

export default class DateField extends Component {

  constructor(props) {
    super(props)

    this.state = {
      value: props.defaultValue === undefined ? '' : props.defaultValue,
      expanded: props.defaultExpanded || false,
      focused: false
    }
  }

  render() {
    const props = this.prepareProps(this.props)
    // const tabIndex = this.isFocused() ? -1 : (this.props.tabIndex || 0)

    return <Flex
      inline
      row
      wrap={false}
      value={null}
      date={null}
      text={null}
      {...props}
    >
      {this.renderInput()}
      {this.renderClearIcon()}
      {this.renderCalendarIcon()}

      {this.renderPicker()}
    </Flex>
  }

  renderInput() {
    const props = this.p
    const inputProps = this.prepareInputProps(props)

    let input

    if (props.renderInput) {
      input = props.renderInput(inputProps)
    }

    if (input === undefined) {
      input = props.children.filter(FIND_INPUT)[0]

      const FieldInput = props.pattern ? DateFormatInput : Input

      input = input ?
        React.cloneElement(input, inputProps) :
        <FieldInput {...inputProps} />
    }

    return input
  }

  renderClearIcon() {
    const props = this.p

    if (!props.clearIcon || props.pattern) {
      return undefined
    }

    const clearIcon = props.clearIcon === true ?
                        CLEAR_ICON :
                        props.clearIcon

    const clearIconProps = {
      style: {
        visibility: props.text ? 'visible' : 'hidden'
      },
      className: 'react-date-field__clear-icon',
      onMouseDown: this.onClearMouseDown,
      children: clearIcon
    }

    let result

    if (props.renderClearIcon) {
      result = props.renderClearIcon(clearIconProps)
    }

    if (result === undefined) {
      result = <InlineBlock {...clearIconProps} />
    }

    return result
  }

  onClearMouseDown(event) {
    event.preventDefault()
    this.onFieldChange('')

    if (!this.isFocused()) {
      this.focus()
    }
  }

  renderCalendarIcon() {
    let result
    const renderIcon = this.props.renderCalendarIcon

    const calendarIconProps = {
      className: 'react-date-field__calendar-icon',
      onMouseDown: this.onCalendarIconMouseDown,
      children: <div className="react-date-field__calendar-icon-inner" />
    }

    if (renderIcon) {
      result = renderIcon(calendarIconProps)
    }

    if (result === undefined) {
      result = <div {...calendarIconProps} />
    }

    return result
  }

  onCalendarIconMouseDown(event) {
    event.preventDefault()

    if (!this.isFocused()) {
      this.focus()
    }

    this.toggleExpand()
  }

  prepareExpanded(props) {
    return props.expanded === undefined ?
      this.state.expanded :
      props.expanded
  }

  prepareDate(props, pickerProps) {
    props = props || this.p
    pickerProps = pickerProps || props.pickerProps

    const locale = props.locale || pickerProps.locale
    const dateFormat = props.dateFormat || pickerProps.dateFormat

    let value = props.value === undefined ?
                  this.state.value :
                  props.value

    const date = this.toMoment(value)
    const valid = date.isValid()

    if (value && typeof value != 'string' && valid) {
      value = this.format(date)
    }

    if (date && valid) {
      this.lastValidDate = date
    } else {
      value = this.state.value
    }

    const viewDate = this.state.viewDate || this.lastValidDate || new Date()
    const activeDate = this.state.activeDate || this.lastValidDate || new Date()

    return {
      viewDate,
      activeDate,
      dateFormat,
      locale,
      valid,
      date,
      value
    }
  }

  preparePickerProps(props) {
    const picker = getPicker(props)

    if (!picker) {
      return null
    }

    return picker.props || {}
  }

  prepareProps(thisProps) {
    const props = this.p = assign({}, thisProps)

    props.children = React.Children.toArray(props.children)

    props.expanded = this.prepareExpanded(props)
    props.pickerProps = this.preparePickerProps(props)

    const input = props.children.filter(FIND_INPUT)[0]

    if (input && input.type == 'input') {
      props.rawInput = true
      props.pattern = false
    }

    const dateInfo = this.prepareDate(props, props.pickerProps)

    assign(props, dateInfo)

    if (props.text === undefined) {
      props.text = this.state.text

      if (props.text == null) {
        props.text = props.valid && props.date ?
              props.value :
              this.props.value
      }
    }

    if (props.text === undefined) {
      props.text = ''
    }

    props.className = this.prepareClassName(props)

    return props
  }

  prepareClassName(props) {
    return join([
      'react-date-field',
      props.className,

      props.theme && `react-date-field--theme-${props.theme}`,

      this.isFocused() && join(
        'react-date-field--focused',
        props.focusedClassName
      ),

      this.isExpanded() && join(
        'react-date-field--expanded',
        props.expandedClassName
      ),

      !props.valid && join(props.invalidClassName, 'react-date-field--invalid')
    ])
  }

  prepareInputProps(props) {
    const input = props.children.filter(FIND_INPUT)[0]
    const inputProps = (input && input.props) || {}

    const onBlur = joinFunctions(inputProps.onBlur, this.onFieldBlur)
    const onFocus = joinFunctions(inputProps.onFocus, this.onFieldFocus)
    const onChange = joinFunctions(inputProps.onChange, this.onFieldChange)
    const onKeyDown = joinFunctions(inputProps.onKeyDown, this.onFieldKeyDown)

    const newInputProps = assign({}, inputProps, {

      ref: (f) => { this.field = f },
      date: props.date,

      onFocus,
      onBlur,
      onChange,

      dateFormat: props.dateFormat,
      value: props.text || '',

      onKeyDown,

      className: join(
        'react-date-field__input',
        inputProps.className
      )
    })

    return newInputProps
  }

  renderPicker() {
    const props = this.p

    if (this.isExpanded()) {
      const picker = getPicker(props)

      const pickerProps = props.pickerProps

      const onMouseDown = joinFunctions(pickerProps.onMouseDown, preventDefault)
      const onChange = joinFunctions(pickerProps.onChange, this.onPickerChange)

      const date = props.valid && props.date

      return React.cloneElement(picker, {
        ref: (p) => {
          this.picker = p && p.getView ? p.getView() : p

          if (!this.state.viewDate) {
            this.onViewDateChange(props.viewDate)
          }
        },

        dateFormat: props.dateFormat,
        theme: props.theme || pickerProps.theme,

        className: join(pickerProps.className, 'react-date-field__picker'),

        date: date || null,

        viewDate: props.viewDate,
        activeDate: props.activeDate,

        onViewDateChange: this.onViewDateChange,
        onActiveDateChange: this.onActiveDateChange,

        tabIndex: -1,

        onMouseDown,
        onChange
      })
    }

    return null
  }

  toMoment(value, props) {
    if (moment.isMoment(value)) {
      return value
    }

    props = props || this.p

    let date = toMoment(value, {
      strict: props.strict,
      locale: props.locale,
      dateFormat: props.displayFormat || props.dateFormat || this.p.dateFormat
    })

    if (!date.isValid() && props.displayFormat) {
      date = toMoment(value, {
        strict: props.strict,
        locale: props.locale,
        dateFormat: props.dateFormat || this.p.dateFormat
      })
    }

    return date
  }

  isValid(text) {
    if (text === undefined) {
      text = this.p.text
    }

    return this.toMoment(text).isValid()
  }

  onViewDateChange(viewDate) {
    this.setState({
      viewDate
    })
  }

  onActiveDateChange(activeDate) {
    this.setState({
      activeDate
    })
  }

  onViewKeyDown(event) {
    const key = event.key

    if (this.picker && (key == 'Enter' || (key in ARROW_KEYS))) {
      this.picker.onViewKeyDown(event)
    }
  }

  onFieldKeyDown(event, currentPosition) {
    const key = event.key
    const expanded = this.isExpanded()

    if (key == 'Enter') {
      this.toggleExpand()
      this.onViewKeyDown(event)
      return false
    }

    if (key == 'Escape') {
      if (expanded) {
        this.setExpanded(false)
        return false
      }
    }

    if (expanded) {
      if (!currentPosition || !currentPosition.time) {
        // the time has not changed, so it's safe to forward the event
        this.onViewKeyDown(event)
        return false
      }
    }

    return true
  }

  getInput() {
    return findDOMNode(this.field)
  }

  isFocused() {
    return this.state.focused
  }

  onFieldFocus(event) {
    if (this.state.focused) {
      return
    }

    this.setState({
      focused: true
    })

    if (this.props.expandOnFocus) {
      this.setExpanded(true)
    }

    this.props.onFocus(event)
  }

  onFieldBlur(event) {
    if (!this.isFocused()) {
      return
    }

    this.setState({
      focused: false
    })

    this.setExpanded(false)

    this.props.onBlur(event)

    if (!this.isValid() && this.props.validateOnBlur) {
      const value = this.lastValidDate && this.p.text != '' ?
          this.format(this.lastValidDate) :
          ''

      setTimeout(() => {
        this.onFieldChange(value)
      }, 0)
    }
  }

  onInputChange() {

  }

  isExpanded() {
    return this.p.expanded
  }

  toggleExpand() {
    this.setExpanded(!this.p.expanded)
  }

  setExpanded(bool) {
    const props = this.p

    if (bool === props.expanded) {
      return
    }

    if (!bool) {
      this.onCollapse()
    } else {
      this.setState({}, () => {
        this.onExpand()
      })
    }

    if (bool && props.valid) {
      this.setState({
        // viewDate: props.date,
        activeDate: props.date
      })
    }

    if (this.props.expanded === undefined) {
      this.setState({
        expanded: bool
      })
    }

    this.props.onExpandChange(bool)
  }

  onCollapse() {
    this.props.onCollapse()
  }

  onExpand() {
    this.props.onExpand()
  }

  onFieldChange(value) {
    if (this.p.rawInput && typeof value != 'string') {
      const event = value
      value = event.target.value
    }

    const dateMoment = value == '' ?
                        null :
                        this.toMoment(value)

    if (dateMoment === null || dateMoment.isValid()) {
      this.onChange(dateMoment)
    }

    this.onTextChange(value)
  }

  onTextChange(text) {
    if (this.props.text === undefined) {
      this.setState({
        text
      })
    }

    if (this.props.onTextChange) {
      this.props.onTextChange(text)
    }
  }

  onPickerChange(dateString, { dateMoment }) {
    const props = this.p

    const currentDate = props.date

    if (props.valid && currentDate) {
      const dateFormat = props.dateFormat.toLowerCase()

      const hasTime = dateFormat.indexOf('k') != -1 ||
                      dateFormat.indexOf('h') != -1

      if (hasTime) {
        ['hour', 'minute', 'second', 'millisecond'].forEach(part => {
          dateMoment.set(part, currentDate.get(part))
        })
      }
    }

    if (props.collapseOnChange) {
      this.setExpanded(false)
    }

    this.onTextChange(this.format(dateMoment))
    this.onChange(dateMoment)
  }

  onChange(dateMoment) {
    if (dateMoment != null && !moment.isMoment(dateMoment)) {
      dateMoment = this.toMoment(dateMoment)
    }

    const newState = {}

    if (this.props.value === undefined) {
      assign(newState, {
        text: null,
        value: dateMoment
      })
    }

    newState.activeDate = dateMoment

    if (!this.picker || !this.picker.isInView || !this.picker.isInView(dateMoment)) {
      newState.viewDate = dateMoment
    }

    if (this.props.onChange) {
      this.props.onChange(this.format(dateMoment), { dateMoment })
    }

    this.setState(newState)
  }

  format(mom, format) {
    return mom == null ?
      '' :
      mom.format(format || this.p.displayFormat || this.p.dateFormat)
  }

  focusField() {
    const input = findDOMNode(this.field)

    input.focus()
  }

  focus() {
    this.focusField()
  }

}

DateField.defaultProps = {
  pattern: false,
  strict: true,
  expandOnFocus: true,
  collapseOnChange: true,

  theme: 'default',

  onBlur: () => {},
  onFocus: () => {},

  clearIcon: true,
  validateOnBlur: true,

  onExpandChange: () => {},
  onCollapse: () => {},
  onExpand: () => {}
}

DateField.propTypes = {
  dateFormat: PropTypes.string.isRequired
}
