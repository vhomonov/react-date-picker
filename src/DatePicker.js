import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import moment from 'moment'
import assign from 'object-assign'

import MonthView from './MonthView'
import clampRange from './clampRange'
import toMoment from './toMoment'
import join from './join'
import isInRange from './utils/isInRange'

import NavBar from './NavBar'
import bemFactory from './bemFactory'

import Clock from './Clock'

import {Flex, Item} from 'react-flex'

export default class DatePicker extends Component {

  prepareDate(props){
    return toMoment(props.date, props)
  }

  render(){

    const props = this.p = assign({}, this.props)
    const dateFormat = props.dateFormat.toLowerCase()

    props.date = this.prepareDate(props)
    props.hasTime = props.hasTime || dateFormat.indexOf('k') != -1 || dateFormat.indexOf('h') != -1

    const className = join(
      props.className,
      'react-date-picker__date-picker',
      props.theme && `react-date-picker__date-picker--theme-${props.theme}`
    )

    return <Flex row wrap={false} className={className}>
      <MonthView {...this.props} ref={view => this.view = view }/>
      {props.hasTime && this.renderClock()}
    </Flex>
  }

  onViewKeyDown(...args){
    this.view.onViewKeyDown(...args)
  }

  renderClock(){

    const props = this.p
    const style = {
      margin: 10
    }

    return <Clock style={style} time={props.date} showSecondsHand={false}/>
  }
}

DatePicker.defaultProps = {
  dateFormat: 'YYYY-MM-DD',

  theme: 'default',

  isDatePicker: true
}

DatePicker.propTypes = {
}
