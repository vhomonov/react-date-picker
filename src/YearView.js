import React from 'react'
import Component from 'react-class'
import moment from 'moment'

import FORMAT from './utils/format'
import asConfig from './utils/asConfig'
import toMoment from './toMoment'
import onEnter from './onEnter'
import assign from 'object-assign'
import isInRange from './utils/isInRange'

let TODAY

const emptyFn = () => {}

export default class YearView extends Component {

  /**
   * Returns all the days in the specified month.
   *
   * @param  {Moment/Date/Number} value
   * @return {Moment[]}
   */
  getMonthsInYear(value){
    const start = moment(value).startOf('year')
    const result = []

    let i = 0

    for (; i < 12; i++){
      result.push(moment(start))
      start.add(1, 'month')
    }

    return result
  }

  render() {

    TODAY = +moment().startOf('day')

    const props = assign({}, this.props)

    const viewMoment = props.viewMoment = moment(this.props.viewDate)

    if (!this.props.range){
      props.moment = moment(props.date).startOf('month')
    }

    const monthsInView = this.getMonthsInYear(viewMoment)

    return <div className="dp-table dp-year-view">
      {this.renderMonths(props, monthsInView)}
    </div>
  }

  /**
   * Render the given array of days
   * @param  {Moment[]} days
   * @return {React.DOM}
   */
  renderMonths(props, days) {
    const nodes = days.map(date => this.renderMonth(props, date))
    const len = days.length

    const buckets = []
    const bucketsLen = Math.ceil(len / 4)

    let i = 0

    for ( ; i < bucketsLen; i++){
      buckets.push(nodes.slice(i * 4, (i + 1) * 4))
    }

    return buckets.map((bucket, i) => <div key={"row" + i} className="dp-row">{bucket}</div>)
  }

  renderMonth(props, date) {
    const monthText = FORMAT.month(date, props.monthFormat)
    const classes = ["dp-cell dp-month"]

    const dateTimestamp = +date

    if (props.range){
      const start = date
      const end = moment(start).endOf('month')

      const [rangeStart, rangeEnd] = props.range

      if (
        isInRange(start, props.range) ||
        isInRange(end, props.range) ||
        rangeStart && isInRange(rangeStart, [start, end]) ||
        rangeEnd && isInRange(rangeEnd, [start, end])
      ){
        classes.push('dp-in-range')
      }
    }

    if (dateTimestamp == props.moment){
      classes.push('dp-value')
    }

    const onClick = this.handleClick.bind(this, props, date)

    return <div
      tabIndex="1"
      role="link"
      key={monthText}
      className={classes.join(' ')}
      onClick={onClick}
      onKeyUp={onEnter(onClick)}
    >
      {monthText}
    </div>
  }

  handleClick(props, date, event) {
    event.target.value = date

    ;(props.onSelect || emptyFn)(date, event)
  }

}

YearView.defaultProps = asConfig()

YearView.getHeaderText = (moment, props) => {
  return toMoment(moment, null, { locale: props.locale }).format('YYYY')
}
