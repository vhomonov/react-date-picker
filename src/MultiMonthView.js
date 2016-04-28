import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import { Flex } from 'react-flex'

import moment from 'moment'
import assign from 'object-assign'

import toMoment from './toMoment'
import join from './join'
import isInRange from './utils/isInRange'

import bemFactory from './bemFactory'

import MonthView from './MonthView'

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
    let viewDate = props.viewDate === undefined?
            this.state.viewDate:
            props.viewDate

    return viewDate
  }

  prepareProps(thisProps){
    const props = assign({}, thisProps)

    props.viewMoment = this.toMoment(this.prepareViewDate(props))

    return props
  }

  render(){

    const props = this.p = this.prepareProps(this.props)
    const size = props.size

    const rowCount = Math.ceil(size/props.perRow)
    const rows = times(rowCount).map(this.renderRow).filter(x => !!x)

    return <Flex
      column
      alignItems="stretch"
      children={rows}
      {...props}
    />
  }

  renderRow(rowIndex){
    const props = this.p

    if (rowIndex >= props.size){
      return
    }

    const children = times(props.perRow).map(i => {
      const index = (rowIndex * props.perRow) + i

      return this.renderView(index)
    })

    return <Flex row children={children} />
  }

  renderView(index){

    const props = this.p
    const viewMoment = this.toMoment(props.viewMoment).add(index, 'month')

    console.log(viewMoment.format('YYYY-MM-DD'))
    return <MonthView
      {...this.props}
      viewDate={viewMoment}
      activeDate={null}
    />
  }
}

MultiMonthView.defaultProps = {
  perRow: 2,
  size: 4,

  dateFormat: 'YYYY-MM-DD'
}

MultiMonthView.propTypes = {
}
