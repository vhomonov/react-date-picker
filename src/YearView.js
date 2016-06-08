import React from 'react'
import Component from 'react-class'

import moment from 'moment'
import assign from 'object-assign'

import times from './utils/times'
import join from './join'
import toMoment from './toMoment'

import { Flex, Item } from 'react-flex'

import bemFactory from './bemFactory'

const bem = bemFactory('react-date-picker__year-view')

import ON_KEY_DOWN from './MonthView/onKeyDown'

const NAV_KEYS = {
  ArrowUp(mom) {
    if (mom.get('month') >= 4) {
      mom.add(-4, 'month')
    }

    return mom
  },
  ArrowDown(mom) {
    if (mom.get('month') <= 7) {
      mom.add(4, 'month')
    }

    return mom
  },
  ArrowLeft(mom) {
    if (mom.get('month') >= 1) {
      mom.add(-1, 'month')
    }

    return mom
  },
  ArrowRight(mom) {
    if (mom.get('month') <= 10) {
      mom.add(1, 'month')
    }

    return mom
  },
  Home(mom) {
    return mom.startOf('year').startOf('month')
  },
  End(mom) {
    return mom.endOf('year').startOf('month')
  },

  PageUp(mom) {
    const month = mom.get('month') - 4
    const extra4 = month - 4

    if (month >= 0) {
      if (extra4 >= 0) {
        return mom.set('month', extra4)
      }

      return mom.set('month', month)
    }

    return mom
  },

  PageDown(mom) {
    const month = mom.get('month') + 4
    const extra4 = month + 4

    if (month <= 11) {
      if (extra4 <= 11) {
        return mom.set('month', extra4)
      }

      return mom.set('month', month)
    }

    return mom
  }
}


export default class YearView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      date: props.defaultDate,
      activeDate: props.defaultActiveDate,
      viewDate: props.defaultViewDate
    }
  }

  /**
   * Returns all the days in the specified month.
   *
   * @param  {Moment/Date/Number} value
   * @return {Moment[]}
   */
  getMonthsInYear(value) {
    const start = this.toMoment(value).startOf('year')

    return times(12).map(i => this.toMoment(start).add(i, 'month'))
  }

  prepareViewDate(props, state) {
    const viewDate = props.viewDate === undefined ?
          state.viewDate :
          props.viewDate

    if (!viewDate && props.date) {
      return props.date
    }

    return viewDate
  }


  prepareDate(props, state) {
    return props.date === undefined ?
            state.date :
            props.date
  }

  prepareActiveDate(props, state) {
    const activeDate = props.activeDate === undefined ?
      state.activeDate || this.prepareDate(props, state) :
      props.activeDate

    return activeDate
  }

  prepareProps(thisProps) {
    const props = assign({}, thisProps)
    const state = this.state

    props.date = this.prepareDate(props, state)
    props.viewDate = this.prepareViewDate(props, state)

    const activeDate = this.prepareActiveDate(props, state)

    if (props.date) {
      props.timestamp = +this.toMoment(props.date).startOf('month')
    }

    if (activeDate) {
      props.activeDate = +this.toMoment(activeDate).startOf('month')
    }

    props.viewMoment = this.toMoment(props.viewDate).startOf('month')

    return props
  }

  toMoment(date) {
    return toMoment(date, this.props)
  }

  render() {
    const props = this.p = this.prepareProps(this.props)

    const className = join(
      props.className,
      bem(),
      props.theme && bem(null, `theme-${props.theme}`)
    )

    const monthsInView = this.getMonthsInYear(props.viewMoment)

    return <Flex
      inline
      column
      alignItems="stretch"
      tabIndex={0}
      {...props}
      onKeyDown={this.onKeyDown}
      className={className}
    >
      {this.renderMonths(props, monthsInView)}
    </Flex>
  }

  renderMonths(props, months) {
    const nodes = months.map(monthMoment => this.renderMonth(props, monthMoment))

    const buckets = times(Math.ceil(nodes.length / 4)).map(i => {
      return nodes.slice(i * 4, (i + 1) * 4)
    })

    const className = bem('row')

    return buckets.map((bucket, i) => <Flex
      alignItems="center"
      flex
      row
      inline
      key={`row_${i}`}
      className={className}
    >
      {bucket}
    </Flex>)
  }

  format(mom, format) {
    format = format || this.props.monthFormat

    return mom.format(format)
  }

  renderMonth(props, dateMoment) {
    const index = dateMoment.get('month')

    const monthText = props.monthNames ?
      props.monthNames[index] || this.format(dateMoment) :
      this.format(dateMoment)

    const timestamp = +dateMoment

    const className = join(
      bem('month'),
      timestamp === props.activeDate && bem('month', 'active'),
      timestamp === props.timestamp && bem('month', 'value')
    )

    const onClick = this.handleClick.bind(this, {
      dateMoment,
      timestamp
    })

    return <Item
      key={monthText}
      className={className}
      onClick={onClick}
    >
      {monthText}
    </Item>
  }

  handleClick({ timestamp, dateMoment }, event) {
    event.target.value = timestamp

    this.select({ dateMoment, timestamp }, event)
  }

  onKeyDown(event) {
    return ON_KEY_DOWN.call(this, event)
  }

  confirm(date, event) {
    event.preventDefault()

    if (this.props.confirm) {
      return this.props.confirm(date, event)
    }

    const dateMoment = this.toMoment(date)

    this.select({ dateMoment, timestamp: +dateMoment }, event)

    return undefined
  }

  navigate(direction, event) {
    const props = this.p

    const getNavigationDate = (dir, date, dateFormat) => {
      const mom = moment.isMoment(date) ? date : this.toMoment(date, dateFormat)

      if (typeof dir == 'function') {
        return dir(mom)
      }

      return mom
    }

    if (props.navigate) {
      return props.navigate(direction, event, getNavigationDate)
    }

    event.preventDefault()

    if (props.activeDate) {
      const nextMoment = getNavigationDate(direction, props.activeDate)

      this.gotoViewDate({ dateMoment: nextMoment })
    }

    return undefined
  }

  select({ dateMoment, timestamp }, event) {
    if (this.props.select) {
      return this.props.select({ dateMoment, timestamp }, event)
    }

    if (!timestamp) {
      timestamp = +dateMoment
    }

    this.gotoViewDate({ dateMoment, timestamp })
    this.onChange({ dateMoment, timestamp }, event)

    return undefined
  }

  onViewDateChange({ dateMoment, timestamp }) {
    if (this.props.viewDate === undefined) {
      this.setState({
        viewDate: timestamp
      })
    }

    if (this.props.onViewDateChange) {
      const dateString = this.format(dateMoment)
      this.props.onViewDateChange(dateString, { dateMoment, dateString, timestamp })
    }
  }

  gotoViewDate({ dateMoment, timestamp }) {
    if (!timestamp) {
      timestamp = dateMoment == null ? null : +dateMoment
    }

    this.onViewDateChange({ dateMoment, timestamp })
    this.onActiveDateChange({ dateMoment, timestamp })
  }

  onActiveDateChange({ dateMoment, timestamp }) {
    if (this.props.activeDate === undefined) {
      this.setState({
        activeDate: timestamp
      })
    }

    if (this.props.onActiveDateChange) {
      const dateString = this.format(dateMoment)
      this.props.onActiveDateChange(dateString, { dateMoment, timestamp, dateString })
    }
  }

  onChange({ dateMoment, timestamp }, event) {
    if (this.props.date === undefined) {
      this.setState({
        date: timestamp
      })
    }

    if (this.props.onChange) {
      const dateString = this.format(dateMoment)
      this.props.onChange(dateString, { dateMoment, timestamp, dateString }, event)
    }
  }
}

YearView.defaultProps = {
  navKeys: NAV_KEYS,
  theme: 'default',
  monthFormat: 'MMM',
  dateFormat: 'YYYY-MM-DD'
}
