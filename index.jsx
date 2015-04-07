'use strict'

require('./index.styl')

window.moment = require('moment')

var React      = require('react')
var DatePicker = require('./src/index')

var VALUE = Date.now()
var VIEW_DATE = null
var VIEW  = 'month'

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


var App = React.createClass({

    displayName: 'App',

    onLocaleChange: function(event) {
        LOCALE = event.target.value

        this.setState({})
    },

    render: function(){
        var v = VALUE

        var clear = function(){
            VALUE = null
            this.setState({})
        }.bind(this)

        var today = TODAY[LOCALE]

        return <div style={{margin: 10}}>

        <p>Select locale:
            <select value={LOCALE} onChange={this.onLocaleChange}>
                <option value="en">English (US)</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="es">Spanish</option>
                <option value="ro">Romanian</option>
            </select>
        </p>
            <DatePicker
                locale={LOCALE}
                todayText={today}
                minDate='2013-04-04'
                maxDate='2015-10-10'
                date={v}
                onChange={this.onChange}
                />

                <button onClick={clear}>clear</button>
            </div>
    },

    onChange: function(dateString) {
        console.log('selected ', dateString)
        VALUE = dateString
        this.setState({})
    }
})

React.render(<App />, document.getElementById('content'))