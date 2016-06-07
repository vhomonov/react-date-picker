import React, { PropTypes } from 'react'
import Component from 'react-class'

import moment from 'moment'
import assign from 'object-assign'

import toMoment from './toMoment'
import isInRange from './utils/isInRange'

const emptyFn = () => {}

export default class DecadeView extends Component {

  /**
   * Returns all the years in the decade of the given value
   *
   * @param  {Moment/Date/Number} value
   * @return {Moment[]}
   */
  getYearsInDecade(value){
    let year = moment(value).get('year')
    const offset = year % 10

    year = year - offset - 1

    const result = []
    let i = 0

    const start = moment(year, 'YYYY').startOf('year')

    for (; i < 12; i++){
      result.push(moment(start))
      start.add(1, 'year')
    }

    return result
  }

  render() {

    TODAY = +moment().startOf('day')

    const props = assign({}, this.props)

    const viewMoment = props.viewMoment = moment(this.props.viewDate)

    if (!this.props.range){
      props.moment = moment(props.date).startOf('year')
    }

    const yearsInView = this.getYearsInDecade(viewMoment)

    return <div className="dp-table dp-decade-view">
      {this.renderYears(props, yearsInView)}
    </div>
  }

  /**
   * Render the given array of days
   * @param  {Moment[]} days
   * @return {React.DOM}
   */
  renderYears(props, days) {
    const nodes = days.map((date, index, arr) => this.renderYear(props, date, index, arr))
    const len = days.length
    const buckets = []
    const bucketsLen = Math.ceil(len / 4)

    let i = 0

    for ( ; i < bucketsLen; i++){
      buckets.push(nodes.slice(i * 4, (i + 1) * 4))
    }

    return buckets.map((bucket, i) => <div key={"row" + i} className="dp-row">{bucket}</div>)
  }

  renderYear(props, date, index, arr) {
    const yearText = FORMAT.year(date, props.yearFormat)
    const classes = ["dp-cell dp-year"]

    const dateTimestamp = +date

    if (props.range) {
      const start = date
      const end = moment(start).endOf('year')

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

    if (dateTimestamp == props.moment && !props.range){
      classes.push('dp-value')
    }

    if (!index){
      classes.push('dp-prev')
    }

    if (index == arr.length - 1){
      classes.push('dp-next')
    }

    const onClick = this.handleClick.bind(this, props, date)

    return <div
      role="link"
      tabIndex="1"
      key={yearText}
      className={classes.join(' ')}
      onClick={onClick}
      onKeyUp={onEnter(onClick)}
    >
      {yearText}
    </div>
  }

  handleClick(props, date, event) {
    event.target.value = date
    ;(props.onSelect || emptyFn)(date, event)
  }
}

DecadeView.getHeaderText = (value, props) => {
  let year = moment(value).get('year')
  const offset = year % 10

  year = year - offset - 1

  return year + ' - ' + (year + 11)
}

DecadeView.propTypes = asConfig()
