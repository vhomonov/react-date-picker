import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import { Flex } from 'react-flex'
import moment from 'moment'
import assign from 'object-assign'

import toMoment from './toMoment'
import join from './join'
import bemFactory from './bemFactory'

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
      viewDate,
      onViewDateChange: this.onViewDateChange
    }))

    const props = this.p = view.props

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
      return this.props.renderNavigation()
    }

    return <Flex column>
        <div style={{textAlign: 'center'}}>
          {this.renderHeaderDate()}
        </div>
      </Flex>
  }

  renderHeaderDate(){
    const props = this.p
    const mom = this.toMoment(props.viewDate)

    if (this.props.renderHeaderDate){
      return this.props.renderHeaderDate(mom)
    }

    return mom.format(props.headerDateFormat)
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
  headerDateFormat: 'MMM YYYY'
}

NavigationView.propTypes = {
}
