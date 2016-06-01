import React, { PropTypes } from 'react'
import Component from 'react-class'

import { Flex, Item } from 'react-flex'
import InlineBlock from 'react-inline-block'

import assign from 'object-assign'

import join from './join'
import bemFactory from './bemFactory'

const bem = bemFactory('react-date-picker__footer')

const SPACER = <Item />

export const Button = (props) => {
  return <InlineBlock
    {...props}
    className={`${props.className || ''} react-date-picker__footer-button`}
  />
}

export default class Footer extends Component {

  render() {
    const props = this.p = assign({}, this.props)

    const className = join(props.className, bem(), bem(null, `theme-${props.theme}`))

    return <Flex inline row {...props} className={className}>

      {this.renderTodayButton()}
      {this.renderClearButton()}
      {SPACER}
      {this.renderOkButton()}
      {this.renderCancelButton()}
    </Flex>
  }

  renderTodayButton() {
    return this.renderButton('Today', this.props.onTodayClick)
  }

  renderClearButton() {
    return this.renderButton('Clear', this.props.onClearClick)
  }

  renderOkButton() {
    return this.renderButton('OK', this.props.onOkClick)
  }

  renderCancelButton() {
    return this.renderButton('Cancel', this.props.onCancelClick)
  }

  renderButton(props, fn) {
    let text = props.children
    let p = props

    if (typeof props == 'string') {
      p = {}
      text = props
    }

    if (typeof fn == 'function' && !p.onClick) {
      p.onClick = fn
    }

    const Factory = this.props.buttonFactory

    return <Factory tabIndex={0} {...p}>{text}</Factory>
  }
}

Footer.defaultProps = {
  theme: 'default',

  buttonFactory: Button,

  isDatePickerFooter: true,
}

Footer.propTypes = {
  theme: PropTypes.string,

  onTodayClick: PropTypes.func,
  onClearClick: PropTypes.func,
  onOkClick: PropTypes.func,
  onCancelClick: PropTypes.func
}
