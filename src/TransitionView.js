import React from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import moment from 'moment'
import assign from 'object-assign'
import join from './join'
import toMoment from './toMoment'

import getTransitionEnd from './getTransitionEnd'
import assignDefined from './assignDefined'

import { renderFooter } from './MonthView'
import NavBar from './NavBar'
import { Flex } from 'react-flex'
import times from './utils/times'

import InlineBlock from 'react-inline-block'
import normalize from 'react-style-normalizer'

const renderHiddenNav = (props) => <InlineBlock {...props} style={{visibility: 'hidden'}} />

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

    const viewDate = props.viewDate ||
      props.defaultViewDate ||

      props.defaultDate ||
      props.date ||

      childProps.viewDate ||
      childProps.defaultViewDate ||

      childProps.defaultDate ||
      childProps.date

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

  format(mom, props) {
    props = props || this.props
    return mom.format(props.dateFormat)
  }

  componentDidMount() {
    this.setState({
      rendered: true
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.viewDate) {
      // this is in order to transition when the prop changes
      // is we were to simply do setState({ viewDate }) it wouldn't have had a transition
      this.transitionTo(nextProps.viewDate, nextProps)
    }
  }

  transitionTo(date, props) {
    props = props || this.props

    const dateMoment = this.toMoment(date, props)

    this.doTransition(dateMoment)
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

    const multiView = !!(child.props.size && child.props.size >= 2)

    const onViewDateChange = joinFunctions(this.onViewDateChange, props.onViewDateChange)

    const newProps = {
      key: 'picker',
      ref: (v) => { this.view = v },

      viewDate: this.viewDate,
      onViewDateChange,
      navigation: multiView,
      constrainActiveInView: props.constrainActiveInView,

      className: join(
        child.props.className,
        'react-date-picker__center'
      )
    }

    // only pass those down if they have been specified
    // as props on this TransitionView
    assignDefined(newProps, {
      tabIndex: -1,
      range: props.range,
      date: props.date,
      activeDate: props.activeDate,
      footer: false,
      insideField: props.insideField,

      defaultRange: props.defaultRange,
      defaultDate: props.defaultDate,
      defaultActiveDate: props.defaultActiveDate,

      // this is here in order to ensure time changes are reflected
      // when using a TransitionView inside a DateField
      onTimeChange: props.onTimeChange,

      dateFormat: props.dateFormat,
      locale: props.locale,
      theme: props.theme,

      showClock: props.showClock,

      minDate: props.minDate,
      maxDate: props.maxDate
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

    let navBar

    const navBarProps = {
      minDate: props.minDate || renderedChildProps.minDate,
      maxDate: props.maxDate || renderedChildProps.maxDate,
      secondary: true,
      viewDate: this.nextViewDate || this.viewDate,
      onViewDateChange,
      multiView
    }

    if (props.navBar) {
      navBar = this.renderNavBar(navBarProps)
    }

    let footer

    if (props.footer) {
      footer = renderFooter(props)
    }

    if (multiView) {
      newProps.renderNavBar = this.renderMultiViewNavBar.bind(this, navBarProps)
    }

    const clone = React.cloneElement(child, newProps)

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
        {this.renderAt(-1, { multiView, navBarProps })}
        {clone}
        {this.renderAt(1, { multiView, navBarProps })}
      </Flex>
      {footer}
    </Flex>
  }

  /**
   * This method is only called when rendering the NavBar of the MonthViews
   * that are not on the first row of the MultiMonthView
   *
   * @param  {Object} navBarProps
   * @param  {Object} config
   * @return {ReactNode}
   */
  renderMultiViewNavBar(navBarProps, config) {
    const { index } = config
    const count = this.child.props.perRow

    if (index >= count) {
      const viewDate = this.toMoment(navBarProps.viewDate)
        .add(index, 'month')

      return <NavBar
        {...navBarProps}
        renderNavNext={renderHiddenNav}
        renderNavPrev={renderHiddenNav}
        onViewDateChange={null}
        viewDate={moment(viewDate)}
      />
    }

    return null
  }

  renderNavBar(navBarProps) {
    const props = this.props
    const { multiView } = navBarProps

    const navBar = React.Children.toArray(props.children)
      .filter(c => c && c.props && c.props.isDatePickerNavBar)[0]

    let newProps = navBarProps

    if (navBar) {
      newProps = assign({}, navBarProps, navBar.props)

      // have viewDate & onViewDateChange win over initial navBar.props
      newProps.viewDate = navBarProps.viewDate
      newProps.onViewDateChange = navBarProps.onViewDateChange
    }

    if (multiView) {
      const count = this.child.props.perRow
      const viewSize = this.getViewSize()

      const bars = times(count).map(index => {
        const onUpdate = (dateMoment, dir) => {
          const mom = this.toMoment(newProps.viewDate)

          if (Math.abs(dir) == 1) {
            mom.add(dir * viewSize, 'month')
          } else {
            const sign = dir > 0 ? 1 : -1

            mom.add(sign, 'year')
          }

          return mom
        }

        const barProps = assign({}, newProps, {
          onUpdate,
          renderNavNext: renderHiddenNav,
          renderNavPrev: renderHiddenNav,
          viewDate: this.toMoment(newProps.viewDate).add(index, 'month')
        })

        if (index == 0) {
          delete barProps.renderNavPrev
        }
        if (index == count - 1) {
          delete barProps.renderNavNext
        }

        return <NavBar flex {...barProps} />
      })

      return <Flex row children={bars} />
    }

    return navBar ?
      React.cloneElement(navBar, newProps) :
      <NavBar {...newProps} />
  }

  getViewSize() {
    return this.view && this.view.getViewSize ?
      this.view.getViewSize() || 1 :
      1
  }

  renderAt(index, { multiView, navBarProps }) {
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
      tabIndex: -1,
      clockTabIndex: -1,
      navigation: multiView,
      viewDate,
      key: index,
      readOnly: true,
      className: join(
        childProps.className,
        `react-date-picker__${index == -1 ? 'prev' : 'next'}`
      )
    })

    assignDefined(newProps, {
      minDate: renderedProps.minDate,
      maxDate: renderedProps.maxDate
    })

    if (this.state.transition && this.state.transition != index) {
      newProps.style = assign({}, childProps.style, this.transitionDurationStyle)
      newProps.className = join(
        newProps.className,
        'react-date-picker--transition',
        `react-date-picker--transition-${this.state.transition == -1 ? 'left' : 'right'}`
      )
    }

    if (multiView) {
      newProps.renderNavBar = this.renderMultiViewNavBar.bind(
        this,
        assign({}, navBarProps, { viewDate, onViewDateChange: null })
      )
    }

    return React.cloneElement(this.child, newProps)
  }

  getView() {
    return this.view
  }

  isInView(...args) {
    return this.view.isInView(...args)
  }

  onViewDateChange(dateString, { dateMoment }) {
    this.doTransition(dateMoment)
  }

  doTransition(dateMoment) {
    if (this.state.transition) {
      // this.nextViewDate = dateMoment
      return
    }

    const newMoment = moment(dateMoment).startOf('month')
    const viewMoment = moment(this.viewDate).startOf('month')

    if (newMoment.isSame(viewMoment)) {
      return
    }

    const navNext = newMoment.isAfter(viewMoment)
    const transition = navNext ? -1 : 1
    const viewSize = this.getViewSize()

    if (Math.abs(viewSize) > 1) {
      const temp = moment(viewMoment).add(viewSize * -transition, 'month')

      if (navNext) {
        dateMoment = dateMoment.isAfter(temp) ? dateMoment : temp
      } else {
        dateMoment = dateMoment.isBefore(temp) ? dateMoment : temp
      }
    }

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

    if (this.props.focusOnTransitionEnd) {
      this.getView().focus()
    }
    delete this.nextViewDate
  }
}

TransitionView.defaultProps = {
  constrainActiveInView: false,
  focusOnTransitionEnd: false,
  navBar: true,
  theme: 'default',
  isDatePicker: true
}
