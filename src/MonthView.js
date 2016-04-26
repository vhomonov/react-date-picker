import React, { PropTypes } from 'react'
import Component from 'react-class'

import moment from 'moment'
import assign from 'object-assign'

import toMoment from './toMoment'
import join from './join'
import isInRange from './utils/isInRange'

import BasicMonthView from './BasicMonthView'

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
    this.updateToMoment(this.props)
  }

  componentWillReceiveProps(nextProps){
    this.updateToMoment(nextProps)
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

    return props.date == null?
            this.state.date:
            props.date
  }

  prepareViewDate(props){
    let viewDate = props.viewDate == null?
            this.state.viewDate:
            props.viewDate

    return viewDate || this.prepareActiveDate(props)
  }

  prepareActiveDate(props){
    return props.activeDate == null?
            this.state.activeDate:
            props.activeDate
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

    const activeDate = this.prepareActiveDate(props)
    if (activeDate){
      props.activeDate = +this.toMoment(activeDate)
    }

    return props
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
      timestamp == TODAY && 'dp-today',
      before && 'dp-prev',
      after && 'dp-after',
      thisMonth && 'dp-view-month'
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
        'dp-weekend',
        highlightWeekends && 'dp-weekend-highlight'
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
        className = 'dp-in-range'
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

    return assign(
      result,
      minMaxProps,
      rangeProps,
      {
        onClick: this.handleClick.bind(this, { timestamp, dateMoment }),
        className: join([
          minMaxProps.className,
          rangeProps.className,
          prevNextClassName,
          weekendClassName,
          timestamp == currentTimestamp? 'dp-value': null,
          timestamp == props.activeDate? 'dp-active': null,
          className
        ])
      }
    )
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

    console.log(this.p.viewMoment.format('MM-DD'),'!!!')
    return <BasicMonthView
      tabIndex={0}
      {...props}

      onKeyDown={this.onViewKeyDown}

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
    this.goto(this.toMoment(date))
  }

  navigate(dir){

    const props = this.p

    if (props.navigate){
      return props.navigate(dir)
    }

    if (props.activeDate){
      const nextMoment = this.toMoment(props.activeDate).add(dir, 'day')

      this.gotoViewDate(+nextMoment)
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

  goto(dateParam, event){

    let { dateMoment, timestamp } = dateParam

    if (!dateMoment){
      dateMoment = dateParam
    }

    if (!timestamp){
      timestamp = +dateMoment
    }

    this.gotoViewDate(timestamp)

    if (this.props.date == null){
      this.setState({
        date: timestamp
      })
    }

    ;(this.props.onChange || emptyFn)({ dateMoment, timestamp }, event)
  }

  gotoViewDate(timestamp){

    const dateMoment = this.toMoment(timestamp)

    if (this.props.viewDate == null && this.props.navOnDateClick){
      this.setState({
        viewDate: timestamp
      })
    }

    this.props.onViewDateChange({ dateMoment, timestamp})

    if (this.props.activeDate == null){
      this.setState({
        activeDate: timestamp
      })
    }

    this.props.onActiveDateChange({ dateMoment, timestamp })

  }
}

MonthView.defaultProps = {
  defaultClassName: 'react-date-picker__month-view',
  dateFormat: 'YYYY-MM-DD',

  onChange: () => {},
  onViewDateChange: () => {},
  onActiveDateChange: () => {},

  navOnDateClick: true
}

MonthView.propTypes = {
  navOnDateClick: PropTypes.bool
}

MonthView.getHeaderText = (moment, props) => {
  return toMoment(moment, {locale: props.locale}).format('MMMM YYYY')
}
