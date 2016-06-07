import React from 'react'
import Component from 'react-class'
import moment from 'moment'

import assign from 'object-assign'
import times from './utils/times'
import join from './join'

export default class YearView extends Component {

  /**
   * Returns all the days in the specified month.
   *
   * @param  {Moment/Date/Number} value
   * @return {Moment[]}
   */
  getMonthsInYear(value) {
    const start = moment(value).startOf('year')

    return times(12).map(i => moment(start).add(i, 'month'))
  }

  render() {
    const props = assign({}, this.props)

    const viewMoment = props.viewMoment = moment(this.props.viewDate)

    const className = join(
      props.className,
      'react-date-picker__year-view',
      props.theme && `react-date-picker__year-view--${props.theme}`
    )

    const monthsInView = this.getMonthsInYear(viewMoment)

    return <div {...props} className={className}>
      {this.renderMonths(props, monthsInView)}
    </div>
  }
  
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

YearView.defaultProps = {
  theme: 'default'
}
