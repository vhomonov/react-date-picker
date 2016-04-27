import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import moment from 'moment'
import assign from 'object-assign'

import toMoment from './toMoment'
import join from './join'
import isInRange from './utils/isInRange'

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

        if (date && this.isInView(this.toMoment(date), props)){
          return date
        }

        return null
      }
    }


    return activeDate
  }

  prepareProps(thisProps){
    const props = assign({}, thisProps)

    props.viewMoment = this.toMoment(this.prepareViewDate(props))
    props.viewMonthStart = this.toMoment(props.viewMoment).startOf('month')
    props.viewMonthEnd  = this.toMoment(props.viewMoment).endOf('month')

    const { minDate, maxDate } = props

    if (minDate){
      props.minDate = +this.toMoment(props.minDate).startOf('day')
    }

    if (maxDate){
      props.maxDate = +this.toMoment(props.maxDate)
    }

    const date = this.prepareDate(props)

    if (date){
      props.moment = props.range? null: this.toMoment(date).startOf('day')
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

    const outOfView = moment.isBefore(daysInView[0]) ||
                      moment.isAfter(daysInView[daysInView.length - 1])

    return !outOfView
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
      after && this.bem('day--next-month'),
      thisMonth && this.bem('day--this-month')
    )

  }

  prepareMinMaxProps(timestamp, props){

    const classes = []

    let isBeforeMinDate = false
    let isAfterMaxDate = false

    const { minDate, maxDate } = props

    if (minDate && timestamp < minDate){
      classes.push('dp-disabled dp-before-min')
      isBeforeMinDate = true
    }

    if (maxDate && timestamp > maxDate){
      classes.push('dp-disabled dp-after-max')
      isAfterMaxDate = true
    }

    return {
      className: classes.join(''),
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

    if (props.activateOnHover && this.props.activeDate !== null) {
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

    this.navigate(dir)
  }

  confirm(date){
    this.goto({ dateMoment: this.toMoment(date) })
  }

  navigate(dir){

    const props = this.p

    if (props.navigate){
      return props.navigate(dir)
    }

    if (props.activeDate){
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

  onChange({ dateMoment, timestamp }, event){
    if (this.props.date === undefined){
      this.setState({
        date: timestamp
      })
    }

    this.props.onChange({ dateMoment, timestamp }, event)
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

  activateOnHover: true,
  contrainActiveInView: true,

  highlightWeekends: true,
  navOnDateClick: true
}

MonthView.propTypes = {
  navOnDateClick: PropTypes.bool
}

MonthView.getHeaderText = (moment, props) => {
  return toMoment(moment, {locale: props.locale}).format('MMMM YYYY')
}
