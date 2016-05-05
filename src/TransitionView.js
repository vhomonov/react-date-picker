import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import moment from 'moment'
import assign from 'object-assign'
import join from './join'
import toMoment from './toMoment'

import assignDefined from './assignDefined'

import NavBar from './NavBar'
import { Flex } from 'react-flex'

import normalize from 'react-style-normalizer'

const joinFunctions = (a, b) => {
  if (a && b){
    return (...args) => {
      a(...args)
      b(...args)
    }
  }

  return a? a: b
}


const TRANSITION_DURATION = '0.4s'

export default class TransitionView extends Component {

  constructor(props){
    super(props)

    const child = React.Children.toArray(this.props.children)[0]
    const childProps = child.props

    this.state = {
      rendered: false,
      viewDate: props.defaultViewDate ||
        props.defaultDate ||
        childProps.defaultViewDate ||
        childProps.defaultDate
    }
  }

  toMoment(value, props){
    props = props || this.props

    return toMoment(value, {
      locale: props.locale,
      dateFormat: props.dateFormat
    })
  }

  componentWillMount(){
    this.setState({
      viewDate: this.getNextState().viewDate
    })
  }

  getNextState(childProps){

    childProps = childProps || this.prepareChildProps()

    return {
      viewDate: childProps.viewMoment,
      date: childProps.date || childProps.moment,
      activeDate: childProps.activeDate,
      range: childProps.range
    }
  }

  componentDidMount(){
    this.setState({
      rendered: true
    })
  }

  prepareChildProps(child, extraProps){
    if (this.view){
      return this.view.p
    }

    child = child || React.Children.toArray(this.props.children)[0]

    const prepareProps = child.type && child.type.prototype && child.type.prototype.prepareProps

    return prepareProps.call({
      toMoment: this.toMoment
    }, assign({}, child.props, extraProps), this.state)
  }

  render(){
    const props = this.props

    const children = React.Children.toArray(props.children)

    const child = this.child = children[0]

    const childProps = this.prepareChildProps(child, {
      viewDate: this.state.viewDate
    })

    this.nextState = this.getNextState(childProps)

    const onViewDateChange = joinFunctions(
      this.onViewDateChange,
      props.onViewDateChange
    )

    const newProps = {
      ref: (v) => this.view = v,

      viewDate: this.state.viewDate,

      onViewDateChange,
      theme: props.theme || child.props.theme,
      navigation: false,
      className: join(
        child.props.className,
        'react-date-picker__center'
      )
    }

    if (this.state.transition){
      this.transitionDurationStyle = normalize({ transitionDuration: props.transitionDuration || TRANSITION_DURATION})

      newProps.style = assign({}, child.props.style, this.transitionDurationStyle),
      newProps.onTransitionEnd = this.onTransitionEnd

      newProps.className = join(
        newProps.className,
        'react-date-picker--transition',
        `react-date-picker--transition-${this.state.transition == -1? 'left': 'right'}`
      )
    }

    const thisProps = assignDefined({}, {
      activeDate: props.activeDate,
      defaultActiveDate: props.defaultActiveDate,
      onActiveDateChange: props.onActiveDateChange,

      range: props.range,
      defaultRange: props.defaultRange,
      onRangeChange: props.onRangeChange,

      date: props.date,
      defaultDate: props.defaultDate,
      onChange: props.onChange
    })

    const clone = React.cloneElement(child, assign({}, thisProps, newProps))

    return <Flex
      column
      inline
      wrap={false}
      alignItems="stretch"
      {...props}
      className={join(
        props.className,
        'react-date-picker__transition-month-view',
        props.theme && `react-date-picker__transition-month-view--theme-${props.theme}`
      )}
    >
      <NavBar
        minDate={childProps.minDate}
        maxDate={childProps.maxDate}
        secondary
        viewDate={this.state.viewDate}
        onViewDateChange={onViewDateChange}
      />
      <Flex inline row style={{position: 'relative'}}>
        {this.renderAt(-1)}
        {clone}
        {this.renderAt(1)}
      </Flex>
    </Flex>
  }

  getView(){
    return this.view
  }

  onViewKeyDown(...args){
    this.view.onViewKeyDown(...args)
  }

  isInView(...args){
    this.view.isInView(...args)
  }

  onViewDateChange(dateString, { dateMoment }){

    if (moment(dateMoment).startOf('month')
        .isSame(
          moment(this.state.viewDate).startOf('month')
        )
      ){
      return
    }

    setTimeout(() => {
      //in order to allow this.view.p to update
      if (!findDOMNode(this.view)){
        return
      }

      this.nextViewDate = dateMoment

      const newState = {}

      if (dateMoment.isAfter(this.state.viewDate)){
        newState.transition = -1
      } else {
        newState.transition = 1
      }

      this.setState(newState)
    })
  }

  onTransitionEnd(){
    if (!this.nextViewDate){
      return
    }

    this.setState({
      viewDate: this.nextViewDate,
      transition: 0
    })
  }

  renderAt(index){
    if (!this.state.rendered || !this.view){
      return null
    }

    const viewDate = this.view.getViewMoment()
    const viewSize = this.view.getViewSize? this.view.getViewSize(): 1

    const childProps = this.child.props

    const newProps = {

      viewDate: moment(this.state.viewDate).add(viewSize * index, 'month'),

      date: this.nextState.date,
      range: this.nextState.range,
      activeDate: this.nextState.activeDate,

      key: index,
      navigation: false,
      className: join(
        childProps.className,
        `react-date-picker__${index == -1?'prev':'next'}`
      ),

    }

    if (this.state.transition && this.state.transition != index){
      newProps.style = assign({}, childProps.style, this.transitionDurationStyle),
      newProps.className = join(
        newProps.className,
        'react-date-picker--transition',
        `react-date-picker--transition-${this.state.transition == -1? 'left': 'right'}`
      )
    }

    return React.cloneElement(this.child, newProps)
  }
}

TransitionView.defaultProps = {
  theme: 'default',
  isDatePicker: true,
  dateFormat: 'YYYY-MM-DD'
}
