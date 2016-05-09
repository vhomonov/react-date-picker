import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import moment from 'moment'
import assign from 'object-assign'
import join from './join'
import toMoment from './toMoment'
import normalize from 'react-style-normalizer'

const ticks = Array.apply(null, new Array(16))

const transformStyle = normalize({transform: ''})

const rotateStyle = (tick, tickSize, totalSize) => {
  const result = assign({}, transformStyle)
  const deg = tick * 6

  console.log(15-tick)
  const x = ((totalSize/2) / 15) * tick
  const y = x

  Object.keys(result).forEach(name => {
    result[name] = `rotate(${deg}deg) translate3d(${x}px, ${y}px, 0px)`
  })

  console.log(result)

  return result
}

export default class Clock extends Component {

  constructor(props){
    super(props)
    this.state = {
    }
  }

  render(){

    const props = this.props
    const size = props.size

    const width = size
    const height = size

    const className = join(props.className, 'react-date-picker__clock')

    return <div className={className} style={{width, height}}>
      {ticks.map(this.renderTick)}
    </div>
  }

  renderTick(_, tick){

    const sizeName = tick % 5? 'small': 'big'
    const className = join(
      'react-date-picker__clock-tick',
      `react-date-picker__clock-tick--${sizeName}`
    )

    const tickSize = tick % 5? this.props.smallTickSize: this.props.bigTickSize
    const style = rotateStyle(tick, tickSize, this.props.size)

    style.height = tickSize

    return <div key={tick} className={className} style={style}/>
  }
}

Clock.defaultProps = {
  size: 150,
  smallTickSize: 10,
  bigTickSize: 20
}
