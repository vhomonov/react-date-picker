import React, { PropTypes } from 'react'

import Component from 'react-class'

import moment from 'moment'
import assign from 'object-assign'
import asConfig from './utils/asConfig'

import MonthView from './MonthView'
import YearView from './YearView'
import DecadeView from './DecadeView'
import Header from './Header'
import toMoment from './toMoment'

import onEnter from './onEnter';

const hasOwn = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

const Views = {
  month: MonthView,
  year: YearView,
  decade: DecadeView
}

const emptyFn = () => {}

class DatePicker extends Component {

  constructor(props) {
    super(props)

    this.state = {
      view: this.props.defaultView,
      viewDate: this.props.defaultViewDate,
      defaultDate: this.props.defaultDate,
      defaultRange: this.props.defaultRange
    }
  }

  getViewOrder() {
    return this.props.viewOrder || ['month', 'year', 'decade']
  }

  getViewName() {
    const view = this.props.view != null?
      this.props.view:
      this.state.view

    return view || 'month'
  }

  addViewIndex(amount) {
    const viewName = this.getViewName()

    const order = this.getViewOrder()
    let index = order.indexOf(viewName)

    index += amount

    return index % order.length
  }

  getNextViewName() {
    return this.getViewOrder()[this.addViewIndex(1)]
  }

  getPrevViewName() {
    return this.getViewOrder()[this.addViewIndex(-1)]
  }

  getView() {
    const views = this.props.views || Views

    return views[this.getViewName()] || views.month
  }

  getViewFactory() {
    let view = this.getView()

    if (React.createFactory && view && view.prototype && typeof view.prototype.render == 'function'){
      view.__factory = view.__factory || React.createFactory(view)
      view = view.__factory
    }

    return view
  }

  getViewDate() {
    let date = hasOwn(this.props, 'viewDate')?
                    this.props.viewDate:
                    this.state.viewDate

    date = date || this.viewMoment || this.getDate() || new Date()

    if (moment.isMoment(date)){
      //in order to strip the locale - the date picker may have had its locale changed
      //between two render calls. If we don't strip this, moment(mom) returns a new moment
      //with the locale of mom, which is not what we want
      date = +date
    }

    date = this.toMoment(date)

    return date
  }

  getDate() {
    const date = hasOwn(this.props, 'date')?
        this.props.date:
        this.state.defaultDate

    return date? this.toMoment(date): null
  }

  getRange(){
    let range

    if (hasOwn(this.props, 'range')){
      range = this.props.range
    } else if (this.state.defaultRange) {
      range = this.state.defaultRange
    }
    if(range){
      return range.map(r => r? this.toMoment(r): null) || null
    } else {
      return null
    }
  }

  render() {

    const props = this.p = assign({}, this.props)

    this.toMoment = function(value, dateFormat){
      return toMoment(value, dateFormat || props.dateFormat, { locale: props.locale })
    }

    const view  = this.getViewFactory()

    props.date = this.getDate()
    props.range = this.getRange()

    const dateString = (props.date == null ? '' : props.date.format(this.props.dateFormat))

    props.viewDate   = this.viewMoment = this.getViewDate()
    props.locale     = this.props.locale
    props.localeData = moment.localeData(props.locale)

    props.renderDay   = this.props.renderDay
    props.onRenderDay = this.props.onRenderDay

    const className = (this.props.className || '') + ' date-picker react-date-picker'

    props.style = this.prepareStyle(props)

    const viewProps = asConfig(props)

    viewProps.toMoment = this.toMoment
    viewProps.highlightWeekends = this.props.highlightWeekends
    viewProps.weekNumbers = this.props.weekNumbers
    viewProps.weekNumberName = this.props.weekNumberName
    viewProps.dateString = dateString
    viewProps.localeData = props.localeData
    viewProps.onSelect = this.handleSelect
    viewProps.onChange = this.handleChange
    viewProps.onWeekChange = this.props.onWeekChange
    viewProps.renderWeekNumber = this.props.renderWeekNumber

    viewProps.highlightRangeOnMouseMove = this.props.highlightRangeOnMouseMove
    viewProps.range = props.range

    return <div {...this.props} className={className} style={props.style} >
      {this.renderHeader(view, props)}

      <div className="dp-body" style={{flex: 1}}>
        {view(viewProps)}
      </div>

      {this.renderFooter(props)}
    </div>
  }

  prepareStyle(props) {
    return assign({}, props.defaultStyle, props.style)
  }

  renderFooter(props) {
    if (this.props.hideFooter){
      return
    }

    if (this.props.today){
      console.warn('Please use "todayText" prop instead of "today"!')
    }
    if (this.props.gotoSelected){
      console.warn('Please use "gotoSelectedText" prop instead of "gotoSelected"!')
    }

    const todayText = this.props.todayText || 'Today'
    const gotoSelectedText = this.props.gotoSelectedText || 'Go to selected'

    const footerProps = {
      todayText: todayText,
      gotoSelectedText: gotoSelectedText,
      gotoToday: this.gotoNow,
      gotoSelected: this.gotoSelected.bind(this, props),
      date: props.date,
      viewDate: props.viewDate
    }

    let result

    if (typeof this.props.footerFactory == 'function'){
      result = this.props.footerFactory(footerProps)
    }

    if (result !== undefined){
      return result
    }

    return <div className="dp-footer">
      <div
        tabIndex="1"
        role="link"
        className="dp-footer-today"
        onClick={footerProps.gotoToday}
        onKeyUp={onEnter(footerProps.gotoToday)}
      >
        {todayText}
      </div>
      <div
        tabIndex="1"
        role="link"
        className="dp-footer-selected"
        onClick={footerProps.gotoSelected}
        onKeyUp={onEnter(footerProps.gotoSelected)}
      >
        {gotoSelectedText}
      </div>
    </div>
  }

  gotoNow() {
    this.gotoDate(+new Date())
  }

  gotoSelected(props) {
    this.gotoDate(props.date || +new Date())
  }

  gotoDate(value) {
    this.setView('month')
    this.setViewDate(value)
  }

  getViewColspan(){
    const map = {
      month : 5,
      year  : 2,
      decade: 2
    }

    return map[this.getViewName()]
  }

  renderHeader(view, props) {

    if (this.props.hideHeader){
      return
    }

    props = props || this.props

    const viewDate = this.getViewDate()
    const headerText = this.getView().getHeaderText(viewDate, props)

    const colspan = this.getViewColspan()
    const prev = this.props.navPrev
    const next = this.props.navNext

    return <Header
      prevText={prev}
      nextText={next}
      colspan={colspan}
      onPrev={this.handleNavPrev}
      onNext={this.handleNavNext}
      onChange={this.handleViewChange}
    >
      {headerText}
    </Header>
  }

  handleRenderDay (date) {
    return (this.props.renderDay || emptyFn)(date) || []
  }

  handleViewChange() {
    this.setView(this.getNextViewName())
  }

  /**
   * Use this method to set the view.
   *
   * @param {String} view 'month'/'year'/'decade'
   *
   * It calls onViewChange, and if the view is uncontrolled, also sets it is state,
   * so the datepicker gets re-rendered view the new view
   *
   */
  setView(view) {

    if (typeof this.props.onViewChange == 'function'){
      this.props.onViewChange(view)
    }

    if (this.props.view == null){
      this.setState({
        view: view
      })
    }
  }

  setViewDate(moment) {

    moment = this.toMoment(moment)

    const fn = this.props.onViewDateChange

    if (typeof fn == 'function'){

      const text = moment.format(this.props.dateFormat)
      const view = this.getViewName()

      fn(text, moment, view)
    }

    if (!hasOwn(this.props, 'viewDate')){
      this.setState({
        viewDate: moment
      })
    }
  }

  getNext() {
    const current = this.getViewDate()
    const toMoment = this.toMoment

    return ({
      month() {
        return toMoment(current).add(1, 'month')
      },
      year() {
        return toMoment(current).add(1, 'year')
      },
      decade() {
        return toMoment(current).add(10, 'year')
      }
    })[this.getViewName()]()
  }

  getPrev() {
    const current = this.getViewDate()
    const toMoment = this.toMoment

    return ({
      month() {
        return toMoment(current).add(-1, 'month')
      },
      year() {
        return toMoment(current).add(-1, 'year')
      },
      decade() {
        return toMoment(current).add(-10, 'year')
      }
    })[this.getViewName()]()
  }

  handleNavigation(direction, event) {
    const viewMoment = direction == -1?
                        this.getPrev():
                        this.getNext()

    this.setViewDate(viewMoment)

    if (typeof this.props.onNav === 'function'){
      const text = viewMoment.format(this.props.dateFormat)
      const view = this.getViewName()

      this.props.onNav(text, viewMoment, view, direction, event)
    }
  }

  handleNavPrev(event) {
    this.handleNavigation(-1, event)
  }

  handleNavNext(event) {
    this.handleNavigation(1, event)
  }

  handleChange(date, event) {
    if (date.dateMoment && date.timestamp){
      date = date.dateMoment
    } else {
      date = this.toMoment(date)
    }

    if (this.props.navOnDateClick){
      const viewDate = this.toMoment(this.getViewDate())

      //it's not enough to compare months, since the year can change as well
      //
      //also it's ok to hardcode the format here
      const viewMonth = viewDate.format('YYYY-MM')
      const dateMonth = date.format('YYYY-MM')

      if (dateMonth > viewMonth){
        this.handleNavNext(event)
      } else if (dateMonth < viewMonth){
        this.handleNavPrev(event)
      }
    }

    const text = date.format(this.props.dateFormat)

    if (!hasOwn(this.props, 'date')){
      this.setState({
        defaultDate: text
      })
    }

    ;(this.props.onChange || emptyFn)(text, date, event)

    if (this.p.range){
      this.handleRangeChange(date, event)
    }
  }

  handleRangeChange(mom){
    let range = this.p.range

    if (range.length < 2){
      range = [...range, mom]
    } else {
      range = [mom]
    }

    range.sort((a,b) => a - b)

    if (!this.props.range){
      this.setState({
        defaultRange: range
      })
    }

    const rangeText = range.map(date => {
      return date.format(this.props.dateFormat)
    })

    this.props.onRangeChange(rangeText, range, event)
  }

  handleSelect(date, event) {
    const viewName = this.getViewName()

    const property = ({
      decade: 'year',
      year  : 'month'
    })[viewName]

    const value = date.get(property)
    const viewMoment = this.toMoment(this.getViewDate()).set(property, value)
    const view = this.getPrevViewName()

    this.setViewDate(viewMoment)

    this.setView(view)

    if (typeof this.props.onSelect === 'function'){
      const text = viewMoment.format(this.props.dateFormat)
      this.props.onSelect(text, viewMoment, view, event)
    }
  }

}

DatePicker.defaultProps = (() => {
  const props = assign({}, asConfig(), {
    highlightWeekends: false,
    weekNumberName: '',
    isDatePicker: true,
    navOnDateClick: true,
    highlightRangeOnMouseMove: true,

    onRangeChange: () => {}
  })

  delete props.viewDate
  delete props.date

  return props
})()

DatePicker.views = Views

DatePicker.propTypes = {
  todayText: PropTypes.string,
  gotoSelectedText: PropTypes.string,

  renderFooter: PropTypes.func,
  onChange: PropTypes.func,

  date: PropTypes.any,
  viewDate: PropTypes.any,

  highlightWeekends: PropTypes.bool,

  /**
   * Function to be called when user selects a date.
   *
   * Called with the following params:
   *
   * @param {String} dateText Date formatted as string
   * @param {Moment} moment Moment.js instance
   * @param {Event} event
   *
   * @type {Function}
   */
  onChange: PropTypes.func,

  /**
   * Function to be called when the user navigates to the next/prev month/year/decade
   *
   * Called with the following params:
   *
   * @param {String} dateText Date formatted as string
   * @param {Moment} moment Moment.js instance
   * @param {String} view The name of the current view (eg: "month")
   * @param {Number} direction 1 or -1. 1 if the right arrow, to nav to next period was pressed. -1 if the left arrow, to nav to the prev period was pressed.
   * @param {Event} event
   *
   * @type {Function}
   */
  onNav: PropTypes.func,

  /**
   * Function to be called when the user selects a year/month.
   *
   * Called with the following params:
   *
   * @param {String} dateText Date formatted as string
   * @param {Moment} moment Moment.js instance
   * @param {String} view The name of the view displayed after following the selection. For now, either "year" or "month"
   *
   * @type {Function}
   */
  onSelect: PropTypes.func,

  /**
   * A function that should return a React DOM for the day cell. The first param is the props object.
   * You can use this to have full control over what gets rendered for a day.
   *
   * @param {Object} dayProps The props object passed to day rendering
   *
   * @type {Function}
   */
  renderDay: PropTypes.func,

  /**
   * A function that can manipulate the props object for a day, and SHOULD return a props object (a new one, or the same).
   * Use this for CUSTOM DAY STYLING.
   * You can use this to take full control over the styles/css classes/attributes applied to the day cell in the month view.
   *
   * @param {Object} dayProps
   * @return {Object} dayProps
   *
   * @type {Function}
   */
  onRenderDay: PropTypes.func,


  /******************************************/
  /********** VIEW-related props ************/
  /******************************************/

  /**
   * The default view to show in the picker. This is an uncontrolled prop.
   * If none specified, the default view will be "month"
   *
   * @type {String}
   */
  defaultView: PropTypes.string,

  /**
   * The view to show in the picker. This is a CONTROLLED prop!
   *
   * When using this controlled prop, make sure you update it when `onViewChange` function is called
   * if you want to navigate to another view, as expected.
   *
   * @type {String}
   */
  view: PropTypes.string,

  /**
   * A function to be called when navigating to another view date.
   *
   * Called with the following params:
   *
   * @param {String} dateText Date formatted as string
   * @param {Moment} moment Moment.js instance
   * @param {String} view the name of the view displayed after the navigation occurs.
   *
   * @type {Function}
   */
  onViewDateChange: PropTypes.func,

  /**
   * A function to be called when the view is changed.
   * If you're using the controlled `view` prop, make sure you update the `view` prop in this function if you want to navigate to another view, as expected.
   *
   * @param {String} nextView One of "month", "year", "decade"
   *
   * @type {Function}
   */
  onViewChange: PropTypes.func,

  /**
   * Defaults to true. If specified as false, will not navigate to the date that was clicked, even if that date is in the prev/next month
   * @type {Boolean}
   */
  navOnDateClick: PropTypes.bool,

  highlightRangeOnMouseMove: PropTypes.bool
}

export default DatePicker

module.exports = DatePicker
