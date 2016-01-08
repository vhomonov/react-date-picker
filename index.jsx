'use strict'

require('./style/base.styl')
require('./style/theme/hackerone/index.styl')

var moment = require('moment');
var React      = require('react')
var DatePicker = require('./src/index')

var render = require('react-dom').render

var VALUE = new Date(2016, 0, 1)
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
        return <div style={{margin: 10}}>

            <p>Select locale: <select value={LOCALE} onChange={this.onLocaleChange}>
                    <option value="en">English (US)</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="es">Spanish</option>
                    <option value="ro">Romanian</option>
                </select>
            </p>

            <DatePicker
            xweekStartDay={3}
            highlightWeekends
            locale="ro"
            weekNumberName="x"
            weekNumbers
            xweekDayNames={['S','M','T','W','T','F','S']}
            renderWeekNumber={(p) => {
              p.children = 'W' + p.week
            }}
                date    ={VALUE}
                onChange ={this.onChange}

            />
        </div>
    },

    onChange: function(value) {
        console.log('selected ', value)
        VALUE = value
        this.setState({})
    }
})

render(<App />, document.getElementById('content'))
