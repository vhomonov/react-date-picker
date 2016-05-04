'use strict'

// require('./index.css')
// require('./theme/hackerone.css')
//
require('./style/index.scss')

import MonthView from './src/MonthView'
import NavigationView from './src/NavigationView'
import NavBar from './src/NavBar'
import MultiMonthView from './src/MultiMonthView'

var moment = require('moment');
var React      = require('react')
var DatePicker = require('./src/index')

var render = require('react-dom').render

var range = ['2016-02-01', '2016-02-09']
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

let R = ['2016-05-10']
var App = React.createClass({
    displayName: 'App',

    onLocaleChange: function(event) {
        LOCALE = event.target.value

        this.setState({})
    },

    render: function(){
        range = this.props.range || range
        date = this.props.date || date

        return <div style={{margin: 10}}>

        <NavBar secondary defaultViewDate="2016-06-03" />

        <MonthView
          xminDate="2016-10-10"
          xmaxDate="2016-11-11"
          locale={LOCALE}
          xrange={R}
          defaultRange={[]}
          xonRangeChange={this.onRangeChange}
          style={{height: 400}}
          xdefaultActiveDate="2016-06-6"
          xdefaultDate="2016-02-10"
        >

        </MonthView>

        <MultiMonthView
          xdefaultRange={['2016-05-06']}
          range={R}
          xdefaultRange={[]}
          onRangeChange={this.onRangeChange}
          size={4}
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
      console.log(range)
      R = range
      this.setState({})
        //range = rangeValue
        //date = rangeValue
        //this.setState({})
    }
})

render(<App />, document.getElementById('content'))
