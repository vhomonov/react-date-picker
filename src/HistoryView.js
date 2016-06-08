import React from 'react'
import Component from 'react-class'

import assign from 'object-assign'
import { Flex } from 'react-flex'
import toMoment from './toMoment'
import join from './join'
import joinFunctions from './joinFunctions'
import bemFactory from './bemFactory'

import Footer from './Footer'
import DecadeView from './DecadeView'
import YearView from './YearView'

import assignDefined from './assignDefined'

const bem = bemFactory('react-date-picker__history-view')

const preventDefault = (e) => {
  e.preventDefault()
}

import {
  prepareDateProps,
  getInitialState,

  onKeyDown,

  onViewDateChange,
  onActiveDateChange,
  onChange,
  navigate,
  select,
  confirm,
  gotoViewDate
} from './DecadeView'

export default class HistoryView extends Component {

  constructor(props) {
    super(props)

    this.state = getInitialState(props)
  }

  toMoment(date, format) {
    return toMoment(date, format, this.props)
  }

  render() {
    const dateProps = prepareDateProps(this.props, this.state)

    const props = this.p = assign({}, this.props, dateProps)

    props.children = React.Children.toArray(props.children)

    const className = join(
      props.className,
      bem(),
      props.theme && bem(null, `theme-${props.theme}`)
    )

    const commonProps = assignDefined({}, {
      locale: props.locale,
      theme: props.theme,
      minDate: props.minDate,
      maxDate: props.maxDate,

      viewDate: props.viewMoment,
      activeDate: props.activeDate,
      date: props.date,

      dateFormat: props.dateFormat
    })

    const yearViewProps = assign({}, commonProps)

    const decadeViewProps = assign({}, commonProps, {
      ref: view => { this.decadeView = view }
    })

    return <Flex
      inline
      column
      alignItems="stretch"
      {...this.props}
      className={className}
    >
      {this.renderYearView(yearViewProps)}
      {this.renderDecadeView(decadeViewProps)}
      {this.renderFooter()}
    </Flex>
  }

  renderFooter() {
    const props = this.p
    const children = props.children

    if (!props.footer) {
      return null
    }

    const footerChild = children.filter(c => c && c.props && c.props.isDatePickerFooter)[0]

    if (footerChild) {
      const newFooterProps = {
        onOkClick: joinFunctions(this.onOkClick, footerChild.props.onOkClick),
        onCancelClick: joinFunctions(this.onCancelClick, footerChild.props.onCancelClick)
      }

      if (footerChild.props.centerButtons === undefined) {
        newFooterProps.centerButtons = true
      }
      if (footerChild.props.todayButton === undefined) {
        newFooterProps.todayButton = false
      }
      if (footerChild.props.clearButton === undefined) {
        newFooterProps.clearButton = false
      }

      return React.cloneElement(footerChild, newFooterProps)
    }

    return <Footer
      todayButton={false}
      clearButton={false}
      centerButtons
    />
  }

  renderYearView(yearViewProps) {
    const props = this.p
    const children = props.children

    const yearViewChild = children.filter(c => c && c.props && c.props.isYearView)[0]
    const yearViewChildProps = yearViewChild ? yearViewChild.props : {}

    const tabIndex = yearViewChild && yearViewChild.props ?
      yearViewChild.props.tabIndex :
      null

    yearViewProps.tabIndex = tabIndex

    if (props.focusYearView === false || tabIndex == null) {
      yearViewProps.tabIndex = null
      yearViewProps.onFocus = this.onYearViewFocus
      yearViewProps.onMouseDown = this.onYearViewMouseDown
    }

    assign(yearViewProps, {
      // viewDate: props.moment || props.viewDate,
      onViewDateChange: joinFunctions(
        this.onViewDateChange,
        yearViewChildProps.onViewDateChange
      ),
      onActiveDateChange: joinFunctions(
        this.onActiveDateChange,
        yearViewChildProps.onActiveDateChange
      ),
      onChange: joinFunctions(
        this.onChange,
        yearViewChildProps.onChange
      )
    })

    if (yearViewChild) {
      return React.cloneElement(yearViewChild, yearViewProps)
    }

    return <YearView {...yearViewProps} />
  }

  renderDecadeView(decadeViewProps) {
    const props = this.p
    const children = props.children
    const decadeViewChild = children.filter(c => c && c.props && c.props.isDecadeView)[0]

    const decadeViewChildProps = decadeViewChild ? decadeViewChild.props : {}

    assign(decadeViewProps, {
      onViewDateChange: joinFunctions(
        this.handleDecadeOnViewDateChange,
        decadeViewChildProps.onViewDateChange
      ),
      onActiveDateChange: joinFunctions(
        this.handleDecadeOnActiveDateChange,
        decadeViewChildProps.onActiveDateChange
      ),
      onChange: joinFunctions(
        this.handleDecadeOnChange,
        decadeViewChildProps.onChange
      )
    })

    if (decadeViewChild) {
      return React.cloneElement(decadeViewChild, decadeViewProps)
    }

    return <DecadeView {...decadeViewProps} />
  }

  onYearViewFocus() {
    if (this.props.focusYearView === false) {
      this.focus()
    }
  }

  focus() {
    if (this.decadeView) {
      this.decadeView.focus()
    }
  }

  onYearViewMouseDown(e) {
    preventDefault(e)

    this.focus()
  }

  format(mom, format) {
    format = format || this.props.dateFormat

    return mom.format(format)
  }

  onKeyDown(event) {
    return onKeyDown.call(this, event)
  }

  confirm(date, event) {
    return confirm.call(this, date, event)
  }

  navigate(direction, event) {
    return navigate.call(this, direction, event)
  }

  select({ dateMoment, timestamp }, event) {
    return select.call(this, { dateMoment, timestamp }, event)
  }

  handleDecadeOnViewDateChange(dateString, { dateMoment, timestamp }) {
    const props = this.p
    const currentViewMoment = props.viewMoment

    if (currentViewMoment) {
      dateMoment.set('month', currentViewMoment.get('month'))
      dateString = this.format(dateMoment)
      timestamp = +dateMoment

      console.log('dateString', dateString, 'view date');
    }

    this.onViewDateChange(dateString, { dateMoment, timestamp })
  }

  handleDecadeOnActiveDateChange(dateString, { dateMoment, timestamp }) {
    const props = this.p
    const currentViewMoment = props.viewMoment

    if (currentViewMoment){
      dateMoment.set('month', currentViewMoment.get('month'))
      dateString = this.format(dateMoment)
      timestamp = +dateMoment
    }

    this.onActiveDateChange(dateString, { dateMoment, timestamp })
  }

  handleDecadeOnChange(dateString, { dateMoment, timestamp }, event) {
    const props = this.p
    const currentViewMoment = props.viewMoment

    if (currentViewMoment){
      dateMoment.set('month', currentViewMoment.get('month'))
      dateString = this.format(dateMoment)
      timestamp = +dateMoment
    }

    this.onChange(dateString, { dateMoment, timestamp })
  }

  onViewDateChange(dateString, { dateMoment, timestamp }) {
    return onViewDateChange.call(this, { dateMoment, timestamp })
  }

  gotoViewDate({ dateMoment, timestamp }) {
    return gotoViewDate.call(this, { dateMoment, timestamp })
  }

  onActiveDateChange(dateString, { dateMoment, timestamp }) {
    return onActiveDateChange.call(this, { dateMoment, timestamp })
  }

  onChange(dateString, { dateMoment, timestamp }, event) {
    return onChange.call(this, { dateMoment, timestamp }, event)
  }
}

HistoryView.defaultProps = {
  footer: true,
  theme: 'default',
  navigation: true,
  focusYearView: false,

  dateFormat: 'YYYY-MM-DD',

  adjustDateStartOf: 'month',
  adjustMinDateStartOf: 'month',
  adjustMaxDateStartOf: 'month'
}
