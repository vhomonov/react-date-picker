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

    const viewDate = props.defaultViewDate ||
      props.defaultDate ||
      childProps.defaultViewDate ||
      childProps.defaultDate

    const dateFormat = props.dateFormat || childProps.dateFormat
    const locale = props.locale || childProps.locale

    this.state = {
      rendered: false,
      viewDate: this.toMoment(viewDate, { dateFormat, locale })
    }
  }

  toMoment(value, props) {
    props = props || this.props

    return toMoment(value, {
      locale: props.locale,
      dateFormat: props.dateFormat
    })
  }

  componentDidMount() {
    this.setState({
      rendered: true
    })
  }

  getViewChild() {
    return React.Children.toArray(this.props.children)
      .filter(c => c && c.props && c.props.isDatePicker)[0]
  }

  prepareChildProps(child, extraProps) {
    if (this.view) {
      return this.view.p
    }

    child = child || this.getViewChild()

    return assign({}, child.props, extraProps)
  }

  render() {
    const props = this.props

    const child = this.child = this.getViewChild()

    let viewDate = this.state.viewDate || props.viewMoment || props.viewDate

    const renderedChildProps =
      this.renderedChildProps =
        this.prepareChildProps(child, assignDefined({
          viewDate
        }))

    viewDate = this.state.viewDate ||
      renderedChildProps.viewMoment ||
      renderedChildProps.viewDate

    if (!this.state.transition) {
      this.viewDate = viewDate
    }

    const onViewDateChange = joinFunctions(this.onViewDateChange, props.onViewDateChange)

    const newProps = {
      key: 'picker',
      ref: (v) => { this.view = v },

      viewDate: this.viewDate,
      onViewDateChange,

      navigation: false,

      className: join(
        child.props.className,
        'react-date-picker__center'
      )
    }

    // only pass those down if they have been specified
    // as props on this TransitionView
    assignDefined(newProps, {
      range: props.range,
      date: props.date,
      activeDate: props.activeDate,

      defaultRange: props.defaultRange,
      defaultDate: props.defaultDate,
      defaultActiveDate: props.defaultActiveDate,

      dateFormat: props.dateFormat,
      locale: props.locale,
      theme: props.theme
    })

    if (props.onChange) {
      newProps.onChange = joinFunctions(props.onChange, renderedChildProps.onChange)
    }
    if (props.onRangeChange) {
      newProps.onRangeChange = joinFunctions(props.onRangeChange, renderedChildProps.onRangeChange)
    }
    if (props.onActiveDateChange) {
      newProps.onActiveDateChange = joinFunctions(
        props.onActiveDateChange,
        renderedChildProps.onActiveDateChange
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

    const clone = React.cloneElement(child, newProps)

    let navBar

    if (props.navBar) {
      navBar = this.renderNavBar({
        minDate: renderedChildProps.minDate,
        maxDate: renderedChildProps.maxDate,
        secondary: true,
        viewDate: this.viewDate,
        onViewDateChange
      })
    }

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
      {navBar}
      <Flex inline row style={{ position: 'relative' }}>
        {this.renderAt(-1)}
        {clone}
        {this.renderAt(1)}
      </Flex>
    </Flex>
  }

  renderNavBar(navBarProps) {
    const props = this.props
    const navBar = React.Children.toArray(props.children)
      .filter(c => c && c.props && c.props.isDatePickerNavBar)[0]

    if (navBar) {
      const newProps = assign({}, navBarProps, navBar.props)

      // have viewDate & onViewDateChange win over initial navBar.props
      newProps.viewDate = navBarProps.viewDate
      newProps.onViewDateChange = navBarProps.onViewDateChange

      return React.cloneElement(navBar, newProps)
    }

    return <NavBar {...navBarProps} />
  }

  getViewSize() {
    return this.view.getViewSize ?
      this.view.getViewSize() || 1 :
      1
  }

  renderAt(index) {
    if (!this.state.rendered || !this.view) { // || this.state.prepareTransition != -index ) {
      return null
    }

    const viewSize = this.getViewSize()
    const viewDiff = viewSize * index

    const childProps = this.child.props
    const renderedProps = this.renderedChildProps

    let viewDate = moment(this.viewDate).add(viewDiff, 'month')

    if (this.nextViewDate && this.state.prepareTransition == -index) {
      // we're transitioning to this viewDate, so make sure
      // it renders the date we'll need at the end of the transition
      viewDate = this.nextViewDate
    }

    const newProps = assign({
      date: renderedProps.date || renderedProps.moment,
      range: renderedProps.range,
      activeDate: renderedProps.activeDate,
      dateFormat: renderedProps.dateFormat,
      locale: renderedProps.locale,
      tabIndex: -1
    }, {
      viewDate,
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
    }

    return React.cloneElement(this.child, newProps)
  }

  getView() {
    return this.view
  }

  // onViewKeyDown(...args) {
  //   return this.view.onViewKeyDown(...args)
  // }

  isInView(...args) {
    return this.view.isInView(...args)
  }

  onViewDateChange(dateString, { dateMoment }) {
    if (moment(dateMoment).startOf('month')
        .isSame(
          moment(this.viewDate).startOf('month')
        )
      ) {
      return
    }

    if (this.state.transition) {
      this.nextViewDate = dateMoment
      return
    }

    const transition = dateMoment.isAfter(this.viewDate) ? -1 : 1

    this.setState({
      prepareTransition: transition
    }, () => {
      setTimeout(() => {
        // in order to allow this.view.p to update
        if (!findDOMNode(this.view)) {
          return
        }

        this.nextViewDate = dateMoment

        this.addTransitionEnd()

        this.setState({
          transition
        })
      })
    })
  }

  addTransitionEnd() {
    const dom = findDOMNode(this.view)

    if (dom) {
      dom.addEventListener(getTransitionEnd(), this.onTransitionEnd, false)
    }
  }

  removeTransitionEnd(dom) {
    dom = dom || findDOMNode(this.view)

    if (dom) {
      dom.removeEventListener(getTransitionEnd(), this.onTransitionEnd)
    }
  }

  onTransitionEnd() {
    this.removeTransitionEnd()

    if (!this.nextViewDate) {
      return
    }

    this.setState({
      viewDate: this.nextViewDate,
      transition: 0,
      prepareTransition: 0
    })

    this.getView().focus()
    delete this.nextViewDate
  }
}

TransitionView.defaultProps = {
  navBar: true,
  theme: 'default',
  isDatePicker: true
}
