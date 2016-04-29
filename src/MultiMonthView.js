import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import { Flex } from 'react-flex'
import InlineBlock from 'react-inline-block'

import moment from 'moment'
import assign from 'object-assign'

import NavBar from './NavBar'
import toMoment from './toMoment'
import join from './join'
import isInRange from './utils/isInRange'

import bemFactory from './bemFactory'

import MonthView from './MonthView'
import NavigationView from './NavigationView'

const emptyFn = () => {}

const times = (count) => [...new Array(count)].map((v, i) => i)

export default class MultiMonthView extends Component {

  constructor(props){
    super(props)

    this.state = {
      date: props.defaultDate,
      activeDate: props.defaultActiveDate,
      viewDate: props.defaultViewDate
    }
  }

  componentWillMount(){
    this.updateToMoment(this.props)
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.locale != this.props.locale || nextProps.dateFormat != this.props.dateFormat){
      this.updateToMoment(nextProps)
    }
  }

  updateToMoment(props){

    this.toMoment = (value, dateFormat) => {
      return toMoment(value, {
        locale: props.locale,
        dateFormat: dateFormat || props.dateFormat
      })
    }
  }

  prepareViewDate(props){
    return props.viewDate === undefined?
            this.state.viewDate:
            props.viewDate
  }

  prepareDate(props){

    if (props.range){
      return null
    }

    return props.date === undefined?
            this.state.date:
            props.date
  }

  prepareActiveDate(props){
    return props.activeDate === undefined?
            this.state.activeDate:
            props.activeDate
  }

  prepareProps(thisProps){
    const props = assign({}, thisProps)

    props.viewMoment = this.toMoment(this.prepareViewDate(props))

    props.viewStart = this.toMoment(props.viewMoment).startOf('month')
    props.viewEnd = this.toMoment(props.viewStart).add(props.size - 1, 'month').endOf('month')

    const activeDate = this.prepareActiveDate(props)

    if (activeDate){
      props.activeDate = +this.toMoment(activeDate)
    }

    props.date = this.prepareDate(props)

    return props
  }

  render(){

    const props = this.p = this.prepareProps(this.props)
    const size = props.size

    const rowCount = Math.ceil(size/props.perRow)
    const children = times(rowCount).map(this.renderRow).filter(x => !!x)

    return <Flex
      column
      alignItems="stretch"
      {...props}
      children={children}
    />
  }

  renderRow(rowIndex){
    const props = this.p

    const children = times(props.perRow).map(i => {
      const index = (rowIndex * props.perRow) + i

      if (index >= props.size){
        return null
      }

      return this.renderView(index, props.size)
    })

    return <Flex row wrap={false} children={children} />
  }

  renderView(index, size){

    const props = this.p
    const viewMoment = this.toMoment(props.viewMoment).add(index, 'month')

    const navBarProps = {
      secondary: true,
      renderNavNext: this.renderHiddenNav,
      renderNavPrev: this.renderHiddenNav,

      viewMoment: props.viewMoment,

      onViewDateChange: this.onViewDateChange,
      onUpdate: this.updateViewMoment
    }

    if (index == 0){
      delete navBarProps.renderNavPrev
    }

    if (index == props.perRow - 1){
      delete navBarProps.renderNavNext
    }

    return <MonthView
      {...this.props}

      constrainActiveInView={false}
      navigate={this.onMonthNavigate}
      navigation={false}
      activeDate={props.activeDate}
      xdefaultActiveDate={null}

      onActiveDateChange={this.onMonthActiveDateChange.bind(this, index)}
      onViewDateChange={this.onMonthViewDateChange.bind(this, index)}

      date={props.date}
      onChange={this.onChange}

      viewDate={+viewMoment}
      defaultViewDate={null}

      showDaysBeforeMonth={index == 0}
      showDaysAfterMonth={index == size - 1}
    >
      <NavBar {...navBarProps} />
    </MonthView>
  }


  onMonthNavigate(dir, event){
    const nextMoment = this.toMoment(this.p.activeDate).add(dir, 'day')

    event.preventDefault()

    this.gotoViewDate({
      dateMoment: nextMoment,
      timestamp: +nextMoment
    })
  }

  onMonthActiveDateChange(index, { dateMoment, timestamp }){
    console.info('ACTIVE DATE CHANGE', dateMoment? dateMoment.format('YYYY-MM-DD'): null)

    this.onActiveDateChange({dateMoment, timestamp})
  }

  onMonthViewDateChange(index, { dateMoment, timestamp }){
    const props = this.p

    if (index === props.size - 1){
      dateMoment = this.toMoment(dateMoment).add(-props.size + 1, 'month')
      timestamp = +dateMoment
    } else if (index != 0) {
      return
    }

    this.onViewDateChange({ dateMoment, timestamp })
  }

  updateViewMoment(dateMoment, dir){
    const sign = dir < 0? -1: 1
    const abs = Math.abs(dir)

    const newMoment = this.toMoment(this.p.viewMoment)

    newMoment.add(sign, abs == 1? 'month': 'year')

    return newMoment
  }

  renderHiddenNav(props){
    return <InlineBlock {...props} style={{visibility: 'hidden'}} />
  }

  isInRange(moment){
    return isInRange(moment, [this.p.viewStart, this.p.viewEnd])
  }

  onViewDateChange({ dateMoment, timestamp }){

    if (this.isInRange(dateMoment)){
      return
    }

    if (this.props.viewDate === undefined ){
      this.setState({
        viewDate: timestamp
      })
    }

    this.props.onViewDateChange({ dateMoment, timestamp})
  }

  onActiveDateChange({ dateMoment, timestamp }){

    if (this.props.activeDate === undefined ){
      this.setState({
        activeDate: timestamp
      })
    }

    this.props.onActiveDateChange({ dateMoment, timestamp})
  }

  gotoViewDate({ dateMoment, timestamp }){

    if (!timestamp){
      timestamp = +dateMoment
    }

    this.onViewDateChange({ dateMoment, timestamp })
    this.onActiveDateChange({ dateMoment, timestamp })

  }

  onChange({ dateMoment, timestamp }, event){
    if (this.props.date === undefined){
      this.setState({
        date: timestamp
      })
    }

    this.props.onChange({ dateMoment, timestamp }, event)
  }
}

MultiMonthView.defaultProps = {
  perRow: 2,
  size: 4,

  dateFormat: 'YYYY-MM-DD',
  onChange: () => {},
  onActiveDateChange: () => {},
  onViewDateChange: () => {}
}

MultiMonthView.propTypes = {
}
