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
          minDate="2016-10-10"
          maxDate="2016-11-11"
          locale={LOCALE}
          style={{height: 400}}
          defaultActiveDate="2016-06-6"
          defaultDate="2016-02-10"
        >

        </MonthView>

        <MultiMonthView
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

    onRangeChange: function(rangeValue){
        //range = rangeValue
        //date = rangeValue
        //this.setState({})
    }
})

render(<App />, document.getElementById('content'))
