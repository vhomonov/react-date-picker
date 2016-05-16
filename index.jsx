'use strict'

// require('./index.css')
// require('./theme/hackerone.css')
//
require('./style/index.scss')

import DateFormatInput from './src/DateFormatInput'
import MonthView from './src/MonthView'

import DatePicker from './src/DatePicker'
import TimePicker from './src/TimePicker'
import TimeInput from './src/TimeInput'

import NavigationView from './src/NavigationView'
import TransitionView from './src/TransitionView'
import NavBar from './src/NavBar'
import MultiMonthView from './src/MultiMonthView'
import DateField from './src/DateField'
import Clock from './src/Clock'
import { Flex, Item } from 'react-flex'

var moment = require('moment');
var React      = require('react')

var render = require('react-dom').render

var range = ['2016-05-01', '2016-05-09']
var date = moment().add(-10, 'days')

var LOCALE = 'en'

var TODAY = {
    en: 'Today',
    fr: 'Aujourd\'hui',
    de: 'Heute',
    es: 'Hoy',
    ro: 'Azi'
}

var GO2SELECTED = {
    en: 'Go to selected',
    es: 'Vaya a Favoritos',
    de: 'Zum ausgewählten',
    fr: 'Aller a la liste',
    ro: 'Mergi la selectie'
}

function emptyFn(){}

let R = range
var App = React.createClass({
    displayName: 'App',

    onLocaleChange: function(event) {
        LOCALE = event.target.value

        this.setState({})
    },

    getInitialState(){
      return {
        date: '2016-10-03',
        text: 'atext',
        time: '03:45:21 pm'
      }
    },

    onTimeChange(time){
      // console.log('time', time)
      this.setState({ time })
    },

    onChange(date){
      this.setState({
        date
      })
    },

    onTextChange(text){
      this.setState({
        text
      })
    },

    render: function(){
        range = this.props.range || range
        date = this.props.date || date

        return <div style={{margin: 10}}>
        <DateFormatInput dateFormat="HH:YYYY"/>
        <br />
        <TimeInput format="hh:mm:ss A" autoFocus xonChange={this.onTimeChange} defaultValue={this.state.time}/>
        <br />
        <TimePicker timeFormat="HH:mm:ss" defaultTime style={{minHeight: 200, minWidth: 200}}/>
        <br />
        <DateField dateFormat="YYYY-MM-DD HH:mm" defaultValue="2016-04-02 23:11" xonChange={this.onChange}>
          <DatePicker>
            <Clock/>
          </DatePicker>
        </DateField>
        <br />
        <input defaultValue="dadas"/>

        navview
          <MonthView
            className="xxx"
            minDate="2016-10-10"
            maxDate="2016-11-11"
            locale={LOCALE}
            xrange={R}
            xdefaultRange={[]}
            onRenderDay={(props) => {
              props.onClick = () => {
                console.log(props.dateMoment.format('YYYY-MM-DD'), props.disabled)
              }
              return props
            }}
            isDisabledDay={(props) => {
              return props.dateMoment.format('YYYY-MM-DD') == '2016-10-20'
            }}
            xonRangeChange={this.onRangeChange}
            style={{height: 400}}
            xdefaultActiveDate="2016-06-6"
            xdefaultDate="2016-02-10"
          />
        transition view<TransitionView>
          <MonthView
            style={{maxWidth: 400}}
            maxDate="2016-07-11"
            locale={LOCALE}
            onRenderDay={(props) => {
              props.onClick = () => {
                console.log(props.dateMoment.format('YYYY-MM-DD'), props.disabled)
              }
              return props
            }}
            isDisabledDay={(props) => {
              return props.dateMoment.format('YYYY-MM-DD') == '2016-10-20'
            }}
            xonRangeChange={this.onRangeChange}
            xstyle={{height: 400}}
            defaultRange={[]}
          >

          </MonthView>

        </TransitionView>
        <MultiMonthView
          style={{maxWidth: 1200}}
          maxDate="2016-06-24"
          defaultRange={[]}
          onRangeChange={this.onRangeChange}
          size={2}
        />

        <p>Select locale: <select value={LOCALE} onChange={this.onLocaleChange}>
                <option value="en">English (US)</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="es">Spanish</option>
                <option value="ro">Romanian</option>
            </select>
        </p>

        </div>
    },

    onRangeChange: function(range, r){

      if (r.length){
        if (r[1].timestamp - r[0].timestamp < 1000 * 60 *60*24 * 3)
        return range[0]
      }
      // console.log(range)
      R = range
      this.setState({})
        //range = rangeValue
        //date = rangeValue
        //this.setState({})
    }
})

render(<App />, document.getElementById('content'))
