import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import { Flex, Item } from 'react-flex'
import InlineBlock from 'react-inline-block'

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

    const child = React.Children.toArray(this.props.children)[0]
    const childProps = child.props || {}

    const cloneProps = assign({}, this.props)

    delete cloneProps.style
    delete cloneProps.className

    const viewDate = this.prepareViewDate({
      viewDate: this.props.viewDate !== undefined?
        this.props.viewDate:
        childProps.viewDate
    })

    const view = React.cloneElement(child, assign(cloneProps, {
      viewDate
    }))

    const props = this.p = assign({}, view.props)

    props.viewMoment = this.toMoment(viewDate)

    return <Flex
      column
      alignItems="stretch"
      {...props}
    >
      {this.renderNavigation()}
      {view}
    </Flex>
  }

  toMoment(value, props){
    props = props || this.p

    return toMoment(value, {
      locale: props.locale,
      dateFormat: props.dateFormat
    })
  }

  renderNavigation(){
    if (this.props.renderNavigation){
      return this.props.renderNavigation({
        viewDate: props.viewDate
      })
    }

    return <Flex row>
      {this.renderNavBefore()}
      <Item style={{textAlign: 'center'}}>
        {this.renderHeaderDate()}
      </Item>
      {this.renderNavAfter()}
    </Flex>
  }

  renderNavBefore(){
    return this.renderNav(-1)
  }

  renderNavAfter(){
    return this.renderNav(1)
  }

  renderNav(dir){
    const className = bem(`arrow--${dir == -1? 'prev': 'next'}`)

    return <InlineBlock className={className} onClick={this.onNavClick.bind(this, dir)}>
      {ARROWS[dir]}
    </InlineBlock>
  }

  onNavClick(dir){

    const props = this.p
    const viewMoment = props.viewMoment

    const dateMoment = this.toMoment(viewMoment).add(dir, 'month')
    const timestamp = +dateMoment

    this.onViewDateChange({
      dateMoment,
      timestamp
    })
  }

  renderHeaderDate(){
    const props = this.p
    const moment = props.viewMoment

    if (this.props.renderHeaderDate){
      return this.props.renderHeaderDate(moment)
    }

    return moment.format(props.headerDateFormat)
  }

  onViewDateChange({ dateMoment, timestamp }){
    if (this.props.viewDate === undefined ){
      this.setState({
        viewDate: timestamp
      })
    }

    this.props.onViewDateChange({ dateMoment, timestamp})
  }

}

NavigationView.defaultProps = {
  headerDateFormat: 'MMM YYYY',

  onViewDateChange: () => {}
}

NavigationView.propTypes = {
}
