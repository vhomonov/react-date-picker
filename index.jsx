'use strict';

require('./index.styl')

var React      = require('react')
var DatePicker = require('react-date-picker')

var DAY = 1000 * 60 * 60 * 24
var NOW = +new Date

var pickerDate = NOW

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

    render: function(){

        var todayText = TODAY[LOCALE]
        var gotoSelectedText = GO2SELECTED[LOCALE]

        return <div>
            <h1>React Date Picker</h1>


            <code>npm install --save react-date-picker</code>
            <p>You can style the picker using the <b>date-picker</b> css class and other 'dp-*' prefixed classes.</p>
            <p>Just inspect the datepicker to see available classes.</p>
            <p>Github: <a href="https://github.com/zippyui/react-date-picker">github.com/zippyui/react-date-picker</a></p>

            <h2>Example with min date &amp; max date set. (-90 &amp; +90 days)</h2>

            <DatePicker
                minDate={NOW - 90 * DAY}
                maxDate={NOW + 90 * DAY}
                date={pickerDate}
                onChange={this.onChange}
                locale={LOCALE}
                gotoSelectedText={gotoSelectedText}
                todayText={todayText}
            >
            </DatePicker>

            <p style={{marginBottom: 10, color: 'gray', border: '1px solid gray', padding: 20, display: 'inline-block'}}>
            Hey! Just in case you are interested in a DataGrid, check out <a href="http://zippyui.github.io/react-datagrid" target="_blank">zippyui.github.io/react-datagrid</a>
            </p>
            <p>
                Select <b>locale</b>: <select value={LOCALE} onChange={this.onLocaleChange}>
                    <option value="en">English (US)</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="es">Spanish</option>
                    <option value="ro">Romanian</option>
                </select> - both pickers are linked to the selected locale
            </p>

            <p>You can click the header to change current view and easily navigate to far-off dates
            </p>
            <DatePicker
                defaultDate={pickerDate}
                locale={LOCALE}
                gotoSelectedText={gotoSelectedText}
                todayText={todayText}
            >
            </DatePicker>
        </div>
    },

    onLocaleChange: function(event) {
        LOCALE = event.target.value

        this.setState({})
    },

    onChange: function(dateString, moment) {
        pickerDate = dateString

        //now re-render the app
        console.log('selected ', dateString)
        this.setState({})
    }
})

React.render(<App />, document.getElementById('content'))