import React from 'react'
import Component from 'react-class'

import assign from 'object-assign'
import { Flex, Item } from 'react-flex'
import moment from 'moment'

import times from './utils/times'
import toMoment from './toMoment'
import join from './join'
import bemFactory from './bemFactory'

const bem = bemFactory('react-date-picker__decade-view')

const ARROWS = {
  prev: <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>,

  next: <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
}

const isValidActiveDate = function (timestamp, props) {
  if (!props) {
    throw new Error('props is mandatory in isValidActiveDate')
  }

  return isDateInMinMax(timestamp, props)
}


const isDateInMinMax = function(timestamp, props) {
  if (props.minDate && timestamp < props.minDate) {
    return false
  }

  if (props.maxDate && timestamp > props.maxDate) {
    return false
  }

  return true
}

import ON_KEY_DOWN from './MonthView/onKeyDown'

const getDecadeStartYear = (mom) => {
  const year = mom.get('year')

  return year - year % 10
}

const getDecadeEndYear = (mom) => {
  return getDecadeStartYear(mom) + 9
}

const NAV_KEYS = {
  ArrowUp(mom) {
    return mom.add(-5, 'year')
  },
  ArrowDown(mom) {
    return mom.add(5, 'year')
  },
  ArrowLeft(mom) {
    return mom.add(-1, 'year')
  },
  ArrowRight(mom) {
    return mom.add(1, 'year')
  },
  Home(mom) {
    return mom.set('year', getDecadeStartYear(mom))
  },
  End(mom) {
    return mom.set('year', getDecadeEndYear(mom))
  },
  PageUp(mom) {
    return mom.add(-10, 'year')
  },
  PageDown(mom) {
    return mom.add(10, 'year')
  }
}


export default class DecadeView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      date: props.defaultDate,
      activeDate: props.defaultActiveDate,
      viewDate: props.defaultViewDate
    }
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

    const { minDate, maxDate } = props

    if (minDate != null) {
      props.minDateMoment = this.toMoment(props.minDate).startOf('year')
      props.minDate = +props.minDateMoment
    }

    if (maxDate != null) {
      props.maxDateMoment = this.toMoment(props.maxDate).endOf('year')
      props.maxDate = +props.maxDateMoment
    }

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

    if (props.constrainViewDate && props.minDate != null && props.viewMoment.isBefore(props.minDate)) {
      props.minConstrained = true
      props.viewMoment = this.toMoment(props.minDate)
    }

    if (props.constrainViewDate && props.maxDate != null && props.viewMoment.isAfter(props.maxDate)) {
      props.maxConstrained = true
      props.viewMoment = this.toMoment(props.maxDate)
    }

    return props
  }

  getYearsInDecade(value) {
    const year = getDecadeStartYear(this.toMoment(value))

    const start = this.toMoment(`${year}`, 'YYYY').startOf('year')

    return times(10).map(i => {
      return this.toMoment(start).add(i, 'year')
    })
  }

  toMoment(date, format) {
    return toMoment(date, format, this.props)
  }

  render() {
    const props = this.p = this.prepareProps(this.props)

    const yearsInView = this.getYearsInDecade(props.viewMoment)

    const className = join(
      props.className,
      bem(),
      props.theme && bem(null, `theme-${props.theme}`)
    )

    let children = this.renderYears(props, yearsInView)
    let align = 'stretch'
    let column = true

    if (props.navigation) {
      column = false
      align = 'center'

      children = [
        this.renderNav(-1),
        <Flex inline flex column alignItems="stretch" children={children} />,
        this.renderNav(1)
      ]
    }

    return <Flex
      inline
      column={column}
      alignItems={align}
      tabIndex={0}
      {...this.props}
      onKeyDown={this.onKeyDown}
      className={className}
      children={children}
    />
  }

  renderNav(dir) {
    const props = this.p

    const name = dir == -1 ? 'prev' : 'next'
    const navMoment = this.toMoment(props.viewMoment).add(dir * 10, 'year')

    const disabled = dir == -1 ?
      props.minDateMoment && getDecadeEndYear(navMoment) < getDecadeEndYear(props.minDateMoment) :
      props.maxDateMoment && getDecadeEndYear(navMoment) < getDecadeEndYear(props.maxDateMoment)

    const className = join(
      bem('arrow'),
      bem(`arrow--${name}`),
      disabled && bem('arrow--disabled')
    )

    const arrow = props.arrows[name] || ARROWS[name]

    const arrowProps = {
      className,
      onClick: !disabled ? () => this.onViewDateChange({ dateMoment: navMoment }) : null,
      children: arrow,
      disabled
    }

    if (props.renderNavigation) {
      return props.renderNavigation(arrowProps, props)
    }

    return <div {...arrowProps} />
  }

  renderYears(props, years) {
    const nodes = years.map(this.renderYear)

    const perRow = props.perRow
    const buckets = times(Math.ceil(nodes.length / perRow)).map(i => {
      return nodes.slice(i * perRow, (i + 1) * perRow)
    })

    return buckets.map((bucket, i) => <Flex
      alignItems="center"
      flex
      row
      inline
      key={`row_${i}`}
      className="dp-row"
    >
      {bucket}
    </Flex>)
  }

  renderYear(dateMoment) {
    const props = this.p
    const yearText = this.format(dateMoment)

    const timestamp = +dateMoment

    const className = join(
      bem('year'),
      timestamp === props.activeDate && bem('year', 'active'),
      timestamp === props.timestamp && bem('year', 'value'),
      props.minDate != null && timestamp < props.minDate && bem('year', 'disabled'),
      props.maxDate != null && timestamp > props.maxDate && bem('year', 'disabled')
    )

    const onClick = this.handleClick.bind(this, {
      dateMoment,
      timestamp
    })

    return <Item
      key={yearText}
      className={className}
      onClick={onClick}
    >
      {yearText}
    </Item>
  }

  format(mom, format) {
    format = format || this.props.yearFormat

    return mom.format(format)
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
    if (dateMoment && timestamp === undefined) {
      timestamp = +dateMoment
    }

    if (this.props.constrainViewDate && !isDateInMinMax(timestamp, this.p)) {
      return
    }

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
    if (!isValidActiveDate(timestamp, this.p)) {
      return
    }

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

DecadeView.defaultProps = {
  arrows: {},
  constrainViewDate: true,
  navKeys: NAV_KEYS,
  theme: 'default',
  yearFormat: 'YYYY',
  perRow: 5
}
