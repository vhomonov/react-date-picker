import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import moment from 'moment'
import assign from 'object-assign'
import join from './join'
import toMoment from './toMoment'
import normalize from 'react-style-normalizer'

const MINUTES = Array.apply(null, new Array(60)).map((_, index) => index)

const HALF_PI = Math.PI / 2
const PI2 = 2 * Math.PI
const minutePI = PI2 / 360

const TICKS = MINUTES.map(minute => {
  return {
    minute,
    deg: minute * minutePI -  HALF_PI
  }
})

const transformStyle = normalize({transform: ''})

const translate = (minute, max) => {
  return ((max/2) * 100 / (Math.PI/2)) * minute
}

const rotateTickStyle = (tick, { width, height }, totalSize, offset) => {
  const result = assign({}, transformStyle)
  const deg = tick * 6

  const transform = `translate3d(${-width/2}px, ${-height/2}px, 0px) rotate(${deg}deg) translate3d(0px, -${offset}px, 0px)`

  Object.keys(result).forEach(name => {
    result[name] = transform
  })

  return result
}

const rotateStyle = (value, { width, height }) => {
  const result = assign({}, transformStyle)
  const deg = value * 6

  const transform = `translate3d(${-width/2}px, ${-height/2}px, 0px) rotate(${deg}deg)`

  Object.keys(result).forEach(name => {
    result[name] = transform
  })

  return result
}

export default class Clock extends Component {

  constructor(props){
    super(props)

    this.state = {
      value: props.defaultValue
    }

    if (props.run){
      this.state.time = this.getTime(props)
      this.state.initialTime = this.state.time
    }
  }

  componentDidMount(){
    if (this.props.run){
      this.start()
    }
  }

  componentWillReceiveProps(nextProps){
    if (!this.props.run && nextProps.run){
      this.start()
    }
  }

  start(){
    this.startTime = Date.now? Date.now(): +new Date

    this.run()
  }

  getTime(props){
    props = props || this.props

    if (props.value){
      return props.value * 1000
    }

    return props.time === true?
              Date.now?
                Date.now():
                +new Date
            :
            props.time
  }

  run(){
    setTimeout(() => {
      this.update()
      this.run()
    }, this.props.updateInterval || 1000)
  }

  update(){
    const now = Date.now? Date.now(): +new Date
    const diff = now - this.startTime

    const value = this.props.value?
                  this.props.value * 1000:
                  this.state.initialTime || this.props.time

    console.log(diff)
    this.setTime(value + diff)
  }

  setTime(time){
    this.setState({
      time
    })

    if (this.props.onChange){
      this.props.onChange(time / 1000)
    }

    if (this.props.onTimeChange){
      this.props.onTimeChange(time)
    }
  }

  render(){

    const props = this.props
    const { size } = props

    const time = this.state.time || props.time

    let value

    if (this.state.value || this.props.value){
      value = this.state.value || this.props.value
    } else if (time){
      value = time / 1000
    }

    const width = size
    const height = size

    const className = join(props.className, 'react-date-picker__clock')

    const seconds = value % 60
    const minutes = value / 60 % 60// (value - seconds) % 3600
    const hours = (value / 3600) % 24

    console.log(value, 'value')
    console.log(seconds, 'seconds')
    console.log(minutes, 'minutes')
    console.log(hours, 'hours')
    console.log('------')

    return <div className={className} style={{width, height, borderWidth: props.borderWidth}}>
      {this.renderSecondHand(seconds)}
      {this.renderMinuteHand(minutes)}
      {this.renderHourHand(hours)}

      {MINUTES.map(this.renderTick)}
    </div>
  }

  renderSecondHand(value){
    return this.props.showSeconds && this.renderHand('second', value)
  }

  renderMinuteHand(value){
    return this.props.showMinutes && this.renderHand('minute', value)
  }

  renderHourHand(value){
    return this.props.showHours && this.renderHand('hour', value)
  }

  renderHand(name, value){
    const props = this.props
    const { size, borderWidth } = props

    const height = props[name + 'HandHeight'] || props.handHeight || ((size/2) - props[name + 'HandDiff'])
    const width = props[name + 'HandWidth'] || props.handWidth || props.tickWidth
    let offset = props[name + 'HandOffset'] || props.handOffset

    if (!offset && offset != 0){
      offset = 5
    }

    const style = rotateTickStyle(value, { width, height }, size - borderWidth, height / 2 - offset)
    style.width = width
    style.height = height

    const className = join(
      'react-date-picker__clock-hand',
      `react-date-picker__clock-hand-${name}`
    )

    return <div key={name} className={className} style={style} />
  }

  renderTick(tick){

    const {
      size,
      borderWidth,

      tickWidth,
      smallTickWidth,
      bigTickWidth,

      tickHeight,
      smallTickHeight,
      bigTickHeight,

      tickOffset,
      smallTickOffset,
      bigTickOffset
    } = this.props

    const small = !!(tick % 5)
    const sizeName = small? 'small': 'big'

    if (small && !this.props.showSmallTicks){
      return false
    }

    const className = join(
      'react-date-picker__clock-tick',
      `react-date-picker__clock-tick--${sizeName}`
    )

    const offset = small?
                    smallTickOffset || tickOffset:
                    bigTickOffset || tickOffset

    const tWidth = small?
                    smallTickWidth || tickWidth:
                    bigTickWidth || tickWidth

    const tHeight = small?
                      smallTickHeight || tickHeight:
                      bigTickHeight || tickHeight

    const totalSize = size - borderWidth
    const style = rotateTickStyle(tick, {width: tWidth, height: tHeight}, totalSize, totalSize/2 - (tHeight/2 + offset))

    style.height = tHeight
    style.width = tWidth

    return <div key={tick} className={className} style={style}/>
  }
}

Clock.defaultProps = {
  size: 150,
  time: true,

  showSeconds: true,
  showHours: true,
  showMinutes: true,

  run: true,

  hourHandDiff: 40,
  minuteHandDiff: 30,
  secondHandDiff: 20,

  tickWidth: 2,
  tickOffset: 2,

  smallTickHeight: 6,
  bigTickHeight: 10,

  borderWidth: 4,
  showSmallTicks: true
}
