import React, { PropTypes } from 'react'
import Component from 'react-class'

import { Flex, Item } from 'react-flex'
import InlineBlock from 'react-inline-block'

import moment from 'moment'
import assign from 'object-assign'

import toMoment from './toMoment'
import join from './join'
import bemFactory from './bemFactory'

const ARROWS = {
  prev: <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </svg>,

  next: <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </svg>
}


const bem = bemFactory('react-date-picker__nav-bar')

export default class NavBar extends Component {

  constructor(props){
    super(props)

    this.state = {
      viewDate: props.defaultViewDate
    }
  }

  prepareViewDate(props){
    return props.viewDate === undefined?
            this.state.viewDate:
            props.viewDate
  }

  render() {

    const props = this.p = assign({}, this.props)

    const viewMoment = props.viewMoment || this.toMoment(
      this.prepareViewDate(props)
    )

    const secondary = props.secondary

    const className = join(props.className, bem(), bem(null, `theme-${props.theme}`))

    return <Flex inline row {...props} className={className} viewDate={null}>

      {secondary && this.renderNav(-2, viewMoment)}
      {this.renderNav(-1, viewMoment)}

      <Item className={bem('date')} style={{textAlign: 'center'}}>
        {this.renderNavDate(viewMoment)}
      </Item>

      {this.renderNav(1, viewMoment)}
      {secondary && this.renderNav(2, viewMoment)}
    </Flex>

  }

  toMoment(value, props){
    props = props || this.props

    return toMoment(value, {
      locale: props.locale,
      dateFormat: props.dateFormat
    })
  }


  renderNav(dir, viewMoment){
    const props = this.p

    const name = dir < 0? 'prev': 'next'
    let disabled = dir < 0? props.prevDisabled: props.nextDisabled
    const secondary = Math.abs(dir) == 2

    if (dir < 0 && props.minDate){
      const gotoMoment = this.getGotoMoment(dir, viewMoment).endOf('month')

      if (gotoMoment.isBefore(this.toMoment(props.minDate))){
        disabled = true
      }
    }

    if (dir > 0 && props.maxDate){
      const gotoMoment = this.getGotoMoment(dir, viewMoment).startOf('month')

      if (gotoMoment.isAfter(this.toMoment(props.maxDate))){
        disabled = true
      }
    }

    const className = [
      bem(`arrow`),
      bem(`arrow--${name}`),
      secondary && bem('secondary-arrow'),
      disabled && bem('arrow--disabled')
    ]

    const arrow = props.arrows[name] || ARROWS[name]

    let children

    if (secondary){
      const secondArrow = <InlineBlock style={{position: 'absolute', [dir < 0? 'left': 'left']: 7}}>{arrow}</InlineBlock>

      children = dir < 0? [secondArrow, arrow]: [secondArrow, arrow]
    } else {
      children = arrow
    }

    const navProps = {
      dir,
      name,
      disabled,
      className: join(className),
      onClick: !disabled && this.onNavClick.bind(this, dir, viewMoment),
      children
    }

    if (props.renderNav){
      return props.renderNav(navProps)
    }

    if (dir < 0 && props.renderNavPrev){
      return props.renderNavPrev(navProps)
    }

    if (dir > 0 && props.renderNavNext){
      return props.renderNavNext(navProps)
    }

    return <InlineBlock
      {...navProps}
      disabled={null}
      name={null}
    />
  }

  getGotoMoment(dir, viewMoment){
    viewMoment = viewMoment || this.p.viewMoment

    const sign = dir < 0? -1: 1
    const abs = Math.abs(dir)

    const mom = this.toMoment(viewMoment)

    mom.add(sign, abs == 1? 'month': 'year')

    return mom
  }

  onNavClick(dir, viewMoment, event){

    const props = this.props

    let dateMoment = this.toMoment(viewMoment)

    if (props.onUpdate){
      dateMoment = props.onUpdate(dateMoment, dir)
    } else {
      const sign = dir < 0? -1: 1
      const abs = Math.abs(dir)

      dateMoment.add(sign, abs == 1? 'month': 'year')
    }

    const timestamp = +dateMoment

    props.onNavClick(dir, viewMoment, event)

    const disabled = dir < 0? props.prevDisabled: props.nextDisabled

    if (disabled){
      return
    }

    this.onViewDateChange({
      dateMoment,
      timestamp
    })
  }

  renderNavDate(viewMoment){
    const props = this.props
    const text = viewMoment.format(props.navDateFormat)

    if (props.renderNavDate){
      return props.renderNavDate(viewMoment, text)
    }

    return text
  }

  onViewDateChange({ dateMoment, timestamp }){
    if (this.props.viewDate === undefined ){
      this.setState({
        viewDate: timestamp
      })
    }

    if (this.props.onViewDateChange){
      const dateString = dateMoment.format(this.props.dateFormat)
      this.props.onViewDateChange(dateString, { dateString, dateMoment, timestamp})
    }
  }

}

NavBar.defaultProps = {
  arrows: {},

  theme: 'default',

  isDatePickerNavBar: true,

  navDateFormat: 'MMM YYYY',
  onNavClick: (dir, viewMoment) => {},

  onViewDateChange: () => {}
}

NavBar.propTypes = {
  secondary: PropTypes.bool,

  renderNav: PropTypes.func,
  renderNavPrev: PropTypes.func,
  renderNavNext: PropTypes.func,

  arrows: PropTypes.object,
  navDateFormat: PropTypes.string,

  onUpdate: PropTypes.func,
  onNavClick: PropTypes.func,
  onViewDateChange: PropTypes.func
}
