import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Component from 'react-class'

import moment from 'moment'
import assign from 'object-assign'

import { NotifyResize } from 'react-notify-resize'

import join from './join'
import toMoment from './toMoment'
import normalize from 'react-style-normalizer'

const MINUTES = Array.apply(null, new Array(60)).map((_, index) => index)

const toUpperFirst = (str) => {
  return str?
    str.charAt(0).toUpperCase() + str.substr(1):
    ''
}

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

    let time = 0

    if (props.defaultSeconds){
      time = props.defaultSeconds == true?
              Date.now():
              +props.defaultSeconds * 1000
    }

    if (props.defaultTime){
      time = props.defaultTime == true?
              Date.now():
              +props.defaultTime
    }

    this.state = {
      time
    }

    if (time){
      this.state.defaultTime = this.state.time
    }
  }

  getPropsTime(){
    if (this.props.time){
      return this.props.time
    }

    if (this.props.seconds){
      return this.props.seconds * 1000
    }

    return this.state.defaultTime || 0
  }

  shouldRun(props){
    return !!(this.props.run || this.props.defaultSeconds || this.props.defaultTime)
  }

  componentDidMount(){
    if (this.shouldRun(this.props)){
      this.start()
    }

    if (this.props.size == 'auto'){
      this.setState({
        rendered: true
      })
    }
  }

  componentWillReceiveProps(nextProps){
    const currentRun = this.shouldRun(this.props)
    const nextRun = this.shouldRun(nextProps)

    if (!currentRun && nextRun){
      this.start()
    } else if (currentRun && !nextRun){
      this.stop()
    }
  }

  start(){
    this.startTime = Date.now? Date.now(): +new Date

    this.run()
  }

  stop(){
    this.timeoutId && clearTimeout(this.timeoutId)
  }

  run(){
    this.timeoutId = setTimeout(() => {
      this.update()
      this.run()
    }, this.props.updateInterval || 1000)
  }

  update(){
    const now = Date.now? Date.now(): +new Date
    const diff = now - this.startTime

    const value = this.getPropsTime()

    this.setTime(value + diff)
  }

  setTime(time){
    this.setState({
      time
    })

    if (this.props.onSecondsChange){
      this.props.onSecondsChange(time / 1000)
    }

    if (this.props.onTimeChange){
      this.props.onTimeChange(time)
    }
  }

  render(){

    const props = this.p = assign({}, this.props)
    let size = props.size

    if (size == 'auto'){
      this.ignoreRender = false
      if (!this.state.rendered){
        this.ignoreRender = true
      }

      size = props.size = this.state.size
    }

    const time = this.state.time || this.getPropsTime()

    const mom = toMoment(time)
    const value = toMoment(time)

    const width = size
    const height = size

    const className = join(props.className, 'react-date-picker__clock')

    const seconds = mom.seconds()
    const minutes = mom.minutes() + seconds / 60
    const hours = (mom.hours() + minutes / 60) * 5

    const defaultStyle = {}

    if (props.color){
      defaultStyle.borderColor = props.color
    }

    const style = assign(defaultStyle, props.style, {width, height, borderWidth: props.borderWidth})

    return <div className={className} style={style}>
      {this.renderSecondHand(seconds)}
      {this.renderMinuteHand(minutes)}
      {this.renderHourHand(hours)}

      {MINUTES.map(this.renderTick)}
      {this.props.size == 'auto' && <NotifyResize notifyOnMount onResize={this.onResize} />}
    </div>
  }

  onResize({width, height}){
    if (width != height){
      console.warn('Clock width != height. Please make sure it\'s a square.')
    }

    this.setState({
      size: width
    })
  }

  renderSecondHand(value){
    return this.props.showSecondsHand && this.renderHand('second', value)
  }

  renderMinuteHand(value){
    return this.props.showMinutesHand && this.renderHand('minute', value)
  }

  renderHourHand(value){
    return this.props.showHoursHand && this.renderHand('hour', value)
  }

  renderHand(name, value){

    if (this.ignoreRender){
      return null
    }

    const props = this.p
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

    if (props.color){
      style.background = props.color
    }

    const className = join(
      'react-date-picker__clock-hand',
      `react-date-picker__clock-hand-${name}`
    )

    const renderName = 'render' + toUpperFirst(name) + 'Hand'

    if (props[renderName]){
      return props[renderName]({
        key: name,
        className,
        style
      })
    }

    return <div key={name} className={className} style={style} />
  }

  renderTick(tick){

    if (this.ignoreRender){
      return null
    }

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
    } = this.p

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

    if (this.props.color){
      style.background = this.props.color
    }

    if (this.props.renderTick){
      return this.props.renderTick({
        tick,
        key,
        className,
        style
      })
    }

    return <div key={tick} className={className} style={style}/>
  }
}

Clock.defaultProps = {
  size: 150,

  showSecondsHand: true,
  showHoursHand: true,
  showMinutesHand: true,

  handWidth: 2,

  hourHandDiff: 50,
  minuteHandDiff: 35,
  secondHandDiff: 20,

  tickWidth: 1,
  bigTickWidth: 2,
  tickOffset: 2,

  smallTickHeight: 6,
  bigTickHeight: 10,

  color: '',
  borderWidth: 0,
  showSmallTicks: true
}
