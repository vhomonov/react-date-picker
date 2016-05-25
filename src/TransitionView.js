import React from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import moment from 'moment'
import assign from 'object-assign'
import join from './join'
import toMoment from './toMoment'

import getTransitionEnd from './getTransitionEnd'
import assignDefined from './assignDefined'

import NavBar from './NavBar'
import { Flex } from 'react-flex'

import normalize from 'react-style-normalizer'

const joinFunctions = (a, b) => {
  if (a && b) {
    return (...args) => {
      a(...args)
      b(...args)
    }
  }

  return a || b
}


const TRANSITION_DURATION = '0.4s'

export default class TransitionView extends Component {

  constructor(props) {
    super(props)

    const child = React.Children.toArray(this.props.children)[0]
    const childProps = child.props

    this.state = {
      rendered: false,
      viewDate: props.viewDate ||
        props.defaultViewDate ||
        props.defaultDate ||

        childProps.defaultViewDate ||
        childProps.defaultDate
    }
  }

  toMoment(value, props) {
    props = props || this.props

    return toMoment(value, {
      locale: props.locale,
      dateFormat: props.dateFormat
    })
  }

  componentWillMount() {
    this.setState({
      viewDate: this.getNextState().viewDate
    })
  }

  componentDidMount() {
    this.setState({
      rendered: true
    })
  }

  prepareChildProps(child, extraProps) {
    if (this.view) {
      return this.view.p
    }

    child = child || React.Children.toArray(this.props.children)[0]

    return assign({}, child.props, extraProps)
  }

  getNextState(childProps) {
    childProps = childProps || this.prepareChildProps()

    return {
      viewDate: childProps.viewMoment,
      date: childProps.date || childProps.moment,
      activeDate: childProps.activeDate,
      range: childProps.range
    }
  }

  render() {
    const props = this.props

    const children = React.Children.toArray(props.children)
    const child = this.child = children[0]

    this.viewDate = this.state.viewDate || props.viewDate

    const childProps = this.prepareChildProps(child, {
      viewDate: this.viewDate
    })

    const onViewDateChange = joinFunctions(
      this.onViewDateChange,
      props.onViewDateChange
    )

    const newProps = {
      ref: (v) => { this.view = v },

      viewDate: this.viewDate,
      onViewDateChange,

      navigation: false,

      className: join(
        child.props.className,
        'react-date-picker__center'
      )
    }

    if (this.state.transition) {
      this.transitionDurationStyle = normalize({
        transitionDuration: props.transitionDuration || TRANSITION_DURATION
      })

      newProps.style = assign({}, child.props.style, this.transitionDurationStyle)

      newProps.className = join(
        newProps.className,
        'react-date-picker--transition',
        `react-date-picker--transition-${this.state.transition == -1 ? 'left' : 'right'}`
      )
    }

    const commonProps = this.commonProps = assignDefined({}, {
      // take those from child first
      date: childProps.date || childProps.moment,
      activeDate: childProps.activeDate,
      range: childProps.range,
      dateFormat: childProps.dateFormat,
      theme: childProps.theme
    }, {
      date: props.date,
      activeDate: props.activeDate,
      range: props.range,
      dateFormat: props.dateFormat,
      theme: props.theme
    })

    const thisProps = assignDefined({}, {
      defaultActiveDate: props.defaultActiveDate,
      onActiveDateChange: props.onActiveDateChange,

      defaultRange: props.defaultRange,
      onRangeChange: props.onRangeChange,

      defaultDate: props.defaultDate,
      onChange: joinFunctions(props.onChange, childProps.onChange)
    })

    const cloneProps = assign({}, commonProps, thisProps, newProps)
    const clone = React.cloneElement(child, cloneProps)

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
        viewDate={this.viewDate}
        onViewDateChange={onViewDateChange}
      />
      <Flex inline row style={{ position: 'relative' }}>
        {this.renderAt(-1)}
        {clone}
        {this.renderAt(1)}
      </Flex>
    </Flex>
  }

  renderAt(index) {
    if (!this.state.rendered || !this.view) {
      return null
    }

    const viewSize = this.view.getViewSize ? this.view.getViewSize() : 1

    const childProps = this.child.props

    const newProps = assign({}, this.commonProps, {
      viewDate: moment(this.viewDate).add(viewSize * index, 'month'),
      key: index,
      navigation: false,
      className: join(
        childProps.className,
        `react-date-picker__${index == -1 ? 'prev' : 'next'}`
      )
    })

    if (this.state.transition && this.state.transition != index) {
      newProps.style = assign({}, childProps.style, this.transitionDurationStyle)
      newProps.className = join(
        newProps.className,
        'react-date-picker--transition',
        `react-date-picker--transition-${this.state.transition == -1 ? 'left' : 'right'}`
      )

      console.log("newProps.className", newProps.className, index);
    }

    return React.cloneElement(this.child, newProps)
  }

  getView() {
    return this.view
  }

  onViewKeyDown(...args) {
    return this.view.onViewKeyDown(...args)
  }

  isInView(...args) {
    this.view.isInView(...args)
  }

  onViewDateChange(dateString, { dateMoment }) {

    if (moment(dateMoment).startOf('month')
        .isSame(
          moment(this.viewDate).startOf('month')
        )
      ) {
      return
    }

    setTimeout(() => {
      // in order to allow this.view.p to update
      if (!findDOMNode(this.view)) {
        return
      }

      this.nextViewDate = dateMoment

      const newState = {}

      if (dateMoment.isAfter(this.viewDate)) {
        newState.transition = -1
      } else {
        newState.transition = 1
      }

      this.addTransitionEnd()
      this.setState(newState)
    })
  }

  addTransitionEnd() {
    findDOMNode(this.view).addEventListener(getTransitionEnd(), this.onTransitionEnd, false)
  }

  removeTransitionEnd() {
    findDOMNode(this.view).removeEventListener(getTransitionEnd(), this.onTransitionEnd)
  }

  onTransitionEnd() {
    if (!this.nextViewDate) {
      return
    }

    this.removeTransitionEnd()

    this.setState({
      viewDate: this.nextViewDate,
      transition: 0
    })
  }
}

TransitionView.defaultProps = {
  theme: 'default',
  isDatePicker: true,
  dateFormat: 'YYYY-MM-DD'
}
