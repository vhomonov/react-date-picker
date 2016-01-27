'use strict'

require('./style/base.styl')
require('./style/theme/default/index.styl')

var moment = require('moment');
var React      = require('react')
var DatePicker = require('./src/index')

var render = require('react-dom').render

var range = [moment(), null]
var date = moment().format('YYYY-MM-DD')
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
        range = this.props.range || null
        date = this.props.date || date

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
            date={date}
            range={range}
            onChange={this.onChange}
            xweekDayNames={['S','M','T','W','T','F','S']}
            renderWeekNumber={(p) => {
              p.children = 'W' + p.week
            }}

            />
        </div>
    },

    createRangeVector: function(value, event){
        if (range[0] && range[1]){
            if (event.shiftKey){
                if (value < range[0]){
                    return [value, range[0]]
                } else if (value > range [1]){
                    return [range[1], value]
                } else {
                    return [value, null]
                }
            } else {
                return [value, null]
            }
        } else if (value > range[0]){
            return [range[0], value]
        } else {
            return [value, range[0]]
        }
        return range
    }, 


    onChange: function(value, event) {
        console.log('selected ', value.format('YYYY-MM-DD'))

        if (this.props.onRangeChange && range){
            this.props.onRangeChange(
                this.createRangeVector(value, event)
            )
        }else if (this.props.onChange && date){
            this.props.onChange(value)
        } else if (range){
            range = this.createRangeVector(value, event)
        } else if (date){
            date = value
        }
        this.setState({})
    }
})

render(<App />, document.getElementById('content'))
