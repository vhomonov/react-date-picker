import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import { Flex, Item } from 'react-flex'
import InlineBlock from 'react-inline-block'
import NavBar from './NavBar'

import moment from 'moment'
import assign from 'object-assign'

import toMoment from './toMoment'
import join from './join'
import bemFactory from './bemFactory'

const ARROWS = {
  [-1]: <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/>
        <path d="M0-.5h24v24H0z" fill="none"/>
      </svg>
}

const bem = bemFactory('react-date-picker__navigation')

export default class NavigationView extends Component {

  constructor(props){
    super(props)

    this.mounted = false

    const child = React.Children.toArray(this.props.children)[0]

    this.state = {
      viewDate: child.props.defaultViewDate
    }
  }

  componentDidMount(){
    this.mounted = true
  }

  componentWillMount(){
    const child = React.Children.toArray(this.props.children)[0]

    const prepareProps = child.type && child.type.prototype && child.type.prototype.prepareProps

    if (prepareProps){

      const preparedProps = prepareProps.call({
        toMoment: this.toMoment
      }, child.props, this.state)

      this.setState({
        viewMoment: preparedProps.viewMoment
      })
    }
  }

  toMoment(value, props){
    props = props || this.props

    return toMoment(value, {
      locale: props.locale,
      dateFormat: props.dateFormat
    })
  }

  render() {
    const props = this.props

    const child = this.child = React.Children.toArray(this.props.children)[0]
    const childProps = child.props || {}

    const config = {
      locale: props.locale || childProps.locale,
      dateFormat: props.dateFormat || childProps.dateFormat
    }
    const theme = props.theme || childProps.theme

    const viewMoment = childProps.viewDate?
      this.toMoment(childProps.viewDate, config):
      this.state.viewMoment

    const view = React.cloneElement(child, {
      navigation: false,
      viewDate: viewMoment,
      theme,
      locale: config.locale,
      dateFormat: config.dateFormat
    })

    // const prepareProps = child.type && child.type.prototype && child.type.prototype.prepareProps
    // const preparedProps = prepareProps.call({
    //   toMoment: this.toMoment
    // }, view.props, this.state)

    // const prevDisabled = preparedProps.minContrained || (preparedProps.minDateMoment && viewMoment.format('YYYY-MM') == preparedProps.minDateMoment.format('YYYY-MM'))
    // const nextDisabled = preparedProps.maxContrained || (preparedProps.maxDateMoment && viewMoment.format('YYYY-MM') == preparedProps.maxDateMoment.format('YYYY-MM'))

    return <Flex
      column
      inline
      wrap={false}
      alignItems="stretch"
      {...props}
      className={
        join(
          'react-date-picker__navigation-view',
          theme && `react-date-picker__navigation-view--theme-${theme}`
        )
      }
    >
      <NavBar
        minDate={childProps.minDate}
        maxDate={childProps.maxDate}

        dateFormat={config.dateFormat}
        secondary={props.secondary}
        viewMoment={viewMoment}
        onViewDateChange={this.onViewDateChange}
      />
      {view}
    </Flex>
  }

  onViewDateChange(dateString, { dateMoment, timestamp }){
    this.setState({
      viewMoment: dateMoment
    })
  }
}

NavigationView.defaultProps = {
  headerDateFormat: 'MMM YYYY',

  onViewDateChange: () => {}
}

NavigationView.propTypes = {
}
