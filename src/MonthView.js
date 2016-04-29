import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import moment from 'moment'
import assign from 'object-assign'

import toMoment from './toMoment'
import join from './join'
import isInRange from './utils/isInRange'

import NavBar from './NavBar'
import bemFactory from './bemFactory'

import BasicMonthView, { getDaysInMonthView } from './BasicMonthView'

let TODAY

const emptyFn = () => {}

const RENDER_DAY = (props) => {
  return <div {...props} />
}

export default class MonthView extends Component {

  constructor(props){
    super(props)

    this.state = {
      range: props.defaultRange,
      date: props.defaultDate,
      activeDate: props.defaultActiveDate,
      viewDate: props.defaultViewDate
    }
  }

  componentWillMount(){
    this.updateBem(this.props)
    this.updateToMoment(this.props)
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.defaultClassName != this.props.defaultClassName){
      this.updateBem(nextProps)
    }

    this.updateToMoment(nextProps)
  }

  updateBem(props){
    this.bem = bemFactory(props.defaultClassName)
  }

  updateToMoment(props){

    this.toMoment = (value, dateFormat) => {
      return toMoment(value, {
        locale: props.locale,
        dateFormat: dateFormat || props.dateFormat
      })
    }

    TODAY = +this.toMoment().startOf('day')
  }

  prepareDate(props){

    if (props.range){
      return null
    }

    return props.date === undefined?
            this.state.date:
            props.date
  }

  prepareViewDate(props){
    let viewDate = props.viewDate === undefined?
            this.state.viewDate:
            props.viewDate

    return viewDate
  }

  prepareActiveDate(props){
    const activeDate = props.activeDate === undefined?
        //only fallback to date if activeDate not specified
        (this.state.activeDate || this.prepareDate(props)):

        props.activeDate

    const daysInView = props.daysInView

    if (activeDate && daysInView && props.contrainActiveInView){

      const activeMoment = this.toMoment(activeDate)

      if (!this.isInView(activeMoment, props)){

        const date = this.prepareDate(props)
        const dateMoment = this.toMoment(date)

        if (date && this.isInView(dateMoment, props) && this.isValidActiveDate(+dateMoment)){
          return date
        }

        return null
      }
    }

    return this.isValidActiveDate(+activeDate)? activeDate: null
  }

  prepareProps(thisProps){
    const props = this.p = assign({}, thisProps)

    const { minDate, maxDate } = props

    if (minDate){
      props.minDateMoment = this.toMoment(props.minDate).startOf('day')
      props.minDate = +props.minDateMoment
    }

    if (maxDate){
      props.maxDateMoment = this.toMoment(props.maxDate)
      props.maxDate = +props.maxDateMoment
    }

    props.viewMoment = props.viewMoment || this.toMoment(this.prepareViewDate(props))

    if (props.constrainViewDate && props.minDate && props.viewMoment.isBefore(props.minDate)){
      props.minContrained = true
      props.viewMoment = this.toMoment(props.minDate)
    }

    if (props.constrainViewDate && props.maxDate && props.viewMoment.isAfter(props.maxDate)){
      props.maxConstrained = true
      props.viewMoment = this.toMoment(props.maxDate)
    }

    props.viewMonthStart = this.toMoment(props.viewMoment).startOf('month')
    props.viewMonthEnd  = this.toMoment(props.viewMoment).endOf('month')

    const date = this.prepareDate(props)

    if (date){
      props.moment = props.moment || (props.range? null: this.toMoment(date).startOf('day'))
      props.timestamp = props.moment? +props.moment: null
    }

    props.daysInView = getDaysInMonthView(props.viewMoment, props)

    const activeDate = this.prepareActiveDate(props)

    if (activeDate){
      props.activeDate = +this.toMoment(activeDate)
    }

    return props
  }

  isInView(moment, props){
    props = props || this.p

    const daysInView = props.daysInView

    return isInRange(moment, { range: daysInView, inclusive: false })
  }

  handleViewMouseLeave(){
    this.state.range && this.setState({ range: null })
  }

  preparePrevNextClassName(timestamp, props){
    const { viewMonthStart, viewMonthEnd } = props

    const before = timestamp < viewMonthStart
    const after = timestamp > viewMonthEnd

    const thisMonth = !before && !after

    return join(
      timestamp == TODAY && this.bem('day--today'),

      before && this.bem('day--prev-month'),
      before && !props.showDaysBeforeMonth && this.bem('day--hidden'),

      after && this.bem('day--next-month'),
      after && !props.showDaysAfterMonth && this.bem('day--hidden'),

      thisMonth && this.bem('day--this-month')
    )

  }

  isValidActiveDate(timestamp, props){
    props = props || this.p

    if (props.minDate && timestamp < props.minDate){
      return false
    }
    if (props.maxDate && timestamp > props.maxDate){
      return false
    }

    return true
  }

  prepareMinMaxProps(timestamp, props){

    const classes = []

    let isBeforeMinDate = false
    let isAfterMaxDate = false

    const { minDate, maxDate } = props

    if (minDate && timestamp < minDate){
      classes.push(
        this.bem('day--disabled'),
        this.bem('day--disabled-min')
      )
      isBeforeMinDate = true
    }

    if (maxDate && timestamp > maxDate){
      classes.push(
        this.bem('day--disabled'),
        this.bem('day--disabled-max')
      )
      isAfterMaxDate = true
    }

    return {
      className: join(classes),
      isBeforeMinDate,
      isAfterMaxDate,
      isDisabled: isBeforeMinDate || isAfterMaxDate
    }
  }

  prepareWeekendClassName(dateMoment, { highlightWeekends }){

    let weekDay = dateMoment.day()

    if (weekDay === 0 /* Sunday */ || weekDay === 6 /* Saturday */){
      return join(
        this.bem('day--weekend'),
        highlightWeekends && this.bem('day--weekend-highlight')
      )
    }
  }

  prepareRangeProps(dateMoment, props){
    const range = this.state.range || this.props.range

    let inRange = false
    let className = ''

    if (range){
      const start = dateMoment
      const end = moment(start).endOf('day')

      const [rangeStart, rangeEnd] = range

      if (
        isInRange(start, range) ||
        isInRange(end, range) ||
        rangeStart && isInRange(rangeStart, [start, end]) ||
        rangeEnd && isInRange(rangeEnd, [start, end])
      ) {
        className = this.bem('dp-in-range')
        inRange = true
      }
    }

    return {
      inRange,
      className
    }
  }

  prepareDayProps(renderDayProps, props){

    const { timestamp, dateMoment, className } = renderDayProps

    props = props || this.p
    const result = {}

    const minMaxProps = this.prepareMinMaxProps(timestamp, props)
    const rangeProps = this.prepareRangeProps(dateMoment, props)

    const weekendClassName = this.prepareWeekendClassName(dateMoment, props)
    const prevNextClassName = this.preparePrevNextClassName(timestamp, props)

    const currentTimestamp = props.timestamp

    const eventParam = { timestamp, dateMoment }

    let events = {
      onClick: this.handleClick.bind(this, eventParam)
    }

    if (!minMaxProps.isDisabled && props.activateOnHover && this.props.activeDate !== null) {
      events.onMouseEnter = this.onDayTextMouseEnter.bind(this, eventParam)
    }

    return assign(
      result,
      minMaxProps,
      rangeProps,
      events,
      {
        children: <div className={this.bem('day-text')}>
          {renderDayProps.day}
        </div>,
        className: join([
          minMaxProps.className,
          rangeProps.className,
          prevNextClassName,
          weekendClassName,
          timestamp == currentTimestamp? this.bem('day--value'): null,
          timestamp == props.activeDate? this.bem('day--active'): null,
          className
        ])
      }
    )
  }

  focus(){
    findDOMNode(this).focus()
  }

  onDayTextMouseEnter({ dateMoment, timestamp }){

    if (!this.state.focused){
      this.focus()
    }

    this.onActiveDateChange({ dateMoment, timestamp })
  }

  renderDay(renderProps) {

    const props = this.p

    const { dateMoment, timestamp } = renderProps

    assign(
      renderProps,
      this.prepareDayProps(renderProps, props)
    )

    if (props.range && props.highlightRangeOnMouseMove){
      renderProps.onMouseEnter = this.handleDayMouseEnter.bind(this, renderProps)
    }

    if (typeof props.onRenderDay === 'function'){
      renderProps = props.onRenderDay(renderProps)
    }

    const renderFunction = props.renderDay || RENDER_DAY

    let result = renderFunction(renderProps)

    if (result === undefined){
      result = RENDER_DAY(renderProps)
    }

    return result
  }

  render() {

    const props = this.p = this.prepareProps(this.props)

    return <BasicMonthView
      tabIndex={0}
      renderChildren={this.renderChildren}
      {...props}

      onKeyDown={this.onViewKeyDown}
      onFocus={this.onFocus}
      onBlur={this.onBlur}

      viewMonthStart={null}
      viewMonthEnd={null}

      minDate={null}
      maxDate={null}

      viewDate={null}
      range={null}

      renderDay={this.renderDay}
      viewMoment={props.viewMoment}
      onMouseLeave={props.highlightRangeOnMouseMove && this.handleViewMouseLeave}
    />
  }

  renderChildren(children){

    const props = this.p
    const navBar = this.renderNavBar(props)

    if (navBar) {
      children = [
        navBar,
        children
      ]
    }

    return children
  }

  renderNavBar(){
    const props = this.p

    const prevDisabled = props.minContrained || (props.minDateMoment && props.viewMoment.format('YYYY-MM') == props.minDateMoment.format('YYYY-MM'))
    const nextDisabled = props.maxContrained || (props.maxDateMoment && props.viewMoment.format('YYYY-MM') == props.maxDateMoment.format('YYYY-MM'))

    const childNavBar = React.Children.toArray(props.children).filter(c => c && c.props && c.props.isDatePickerNavBar)[0]

    if (!childNavBar){

      if (props.navigation){
        return <NavBar
          prevDisabled={prevDisabled}
          nextDisabled={nextDisabled}
          secondary
          viewMoment={props.viewMoment}
          onViewDateChange={this.onViewDateChange}
        />
      }

      return null
    }

    const navBarProps = assign({}, childNavBar.props, {
      viewMoment: props.viewMoment,
      prevDisabled,
      nextDisabled
    })

    const prevOnViewDateChange = navBarProps.onViewDateChange
    let onViewDateChange = this.onViewDateChange

    if (prevOnViewDateChange){
      onViewDateChange = (...args) => {
        prevOnViewDateChange(...args)
        this.onViewDateChange(...args)
      }
    }

    navBarProps.onViewDateChange = onViewDateChange

    if (navBarProps){
      return <NavBar {...navBarProps} />
    }
  }

  onFocus(){
    this.setState({
      focused: true
    })
  }

  onBlur(){
    this.setState({
      focused: false
    })
  }

  onViewKeyDown(event){
    const key = event.key

    if (this.props.onKeyDown){
      this.props.onKeyDown(event)
    }

    if (key == 'Enter' && this.p.activeDate){
      this.confirm(this.p.activeDate)
    }

    const dir = ({
      ArrowUp: -7,
      ArrowDown: 7,
      ArrowLeft: -1,
      ArrowRight: 1
    })[key]

    if (!dir){
      return
    }

    this.navigate(dir, event)
  }

  confirm(date){
    this.goto({ dateMoment: this.toMoment(date) })
  }

  navigate(dir, event){

    const props = this.p

    if (props.navigate){
      return props.navigate(dir, event)
    }

    if (props.activeDate){

      event.preventDefault()

      const nextMoment = this.toMoment(props.activeDate).add(dir, 'day')

      this.gotoViewDate({ dateMoment: nextMoment})
    }
  }

  handleDayMouseEnter(dayProps){
    const range = this.props.range

    if (range && range.length == 1){
      const [start] = range

      this.setState({
        range: [start, dayProps.date].sort((a, b) => a - b)
      })
    } else if (this.state.range){
      this.setState({
        range: null
      })
    }
  }

  handleClick({ timestamp, dateMoment }, event) {
    const props = this.p

    if (props.minDate && timestamp < props.minDate){
      return
    }

    if (props.maxDate && timestamp > props.maxDate){
      return
    }

    event.target.value = timestamp

    this.goto({ dateMoment, timestamp }, event)

  }

  goto({ dateMoment, timestamp }, event){

    if (!timestamp){
      timestamp = +dateMoment
    }

    this.gotoViewDate({ dateMoment, timestamp })

    this.onChange({ dateMoment, timestamp }, event)
  }

  format(moment){
    return moment.format(this.props.dateFormat)
  }

  onChange({ dateMoment, timestamp }, event){
    if (this.props.date === undefined){
      this.setState({
        date: timestamp
      })
    }

    this.props.onChange({ dateMoment, timestamp, date: this.format(dateMoment) }, event)
  }

  onViewDateChange({ dateMoment, timestamp }){
    if (this.props.viewDate === undefined && this.props.navOnDateClick){
      this.setState({
        viewDate: timestamp
      })
    }

    this.props.onViewDateChange({ dateMoment, timestamp})
  }

  onActiveDateChange({ dateMoment, timestamp }){

    if (!this.isValidActiveDate(timestamp)){
      return
    }

    if (this.props.activeDate === undefined){
      this.setState({
        activeDate: timestamp
      })
    }

    this.props.onActiveDateChange({ dateMoment, timestamp })
  }

  gotoViewDate({ dateMoment, timestamp }){

    if (!timestamp){
      timestamp = +dateMoment
    }

    this.onViewDateChange({ dateMoment, timestamp })
    this.onActiveDateChange({ dateMoment, timestamp })

  }
}

MonthView.defaultProps = {
  defaultClassName: 'react-date-picker__month-view',
  dateFormat: 'YYYY-MM-DD',

  onChange: () => {},
  onViewDateChange: () => {},
  onActiveDateChange: () => {},

  activateOnHover: false,
  contrainActiveInView: true,

  showDaysBeforeMonth: true,
  showDaysAfterMonth: true,

  highlightWeekends: true,
  navOnDateClick: true,
  navigation: true,

  constrainViewDate: true
}

MonthView.propTypes = {
  navOnDateClick: PropTypes.bool
}

MonthView.getHeaderText = (moment, props) => {
  return toMoment(moment, {locale: props.locale}).format('MMMM YYYY')
}
