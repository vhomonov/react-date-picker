import React, { PropTypes } from 'react'
import Component from 'react-class'

import onEnter from './onEnter'

export default class DatePickerHeader extends Component {

  render() {

    const props = this.props

    return <div className="dp-header">
      <div className="dp-nav-table">
        <div className="dp-row">
          <div
            tabIndex="1"
            role="link"
            className="dp-prev-nav dp-nav-cell dp-cell"
            onClick={props.onPrev}
            onKeyUp={onEnter(props.onPrev)}
          >{props.prevText}
          </div>

          <div
            tabIndex="1"
            role="link"
            className="dp-nav-view dp-cell"
            colSpan={props.colspan}
            onClick={props.onChange}
            onKeyUp={onEnter(props.onChange)}
          >{props.children}</div>

          <div
            tabIndex="1"
            role="link"
            className="dp-next-nav dp-nav-cell dp-cell"
            onClick={props.onNext}
            onKeyUp={onEnter(props.onNext)}
          >{props.nextText}</div>
        </div>
      </div>
    </div>
  }
}

DatePickerHeader.propTypes = {
  onChange: PropTypes.func,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  colspan: PropTypes.number,
  children: PropTypes.node
}

