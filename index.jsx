'use strict'

require('./index.styl')

window.moment = require('moment')

var React      = require('react')
var DatePicker = require('./src/index')
var assign = require('object-assign')

var VALUE = Date.now()
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

var TimePicker = require('react-time-picker')

var Picker = React.createClass({

    getInitialState: function(){
        return {
            hideHeader: false,
            view: 'month',
            time: this.props.time
        }
    },

    renderFooter: function(footerProps){

        return <div className="dp-footer">
                <div className="dp-footer-today" onClick={footerProps.gotoToday}>
                    Today
                </div>
                <div className="dp-footer-today" onClick={this.toggleTime} style={{fontWeight: 'bold'}}>
                    ⌚
                </div>
            </div>
    },

    toggleTime: function(){
        if (this.state.view == 'time'){
            return this.changeView('month')
        }

        this.setState({
            view: 'time',
            hideHeader: true
        })
    },

    changeView: function(view){
        this.setState({
            view: view
        })
    },

    onTimeChange: function(value){
        this.setState({
            time: value
        })

        this.onChange(null, value)
    },

    onDateChange: function(dateString){
        this.onChange(dateString)
    },

    onChange: function(date, time){
        var value = (date || this.date) + ' ' + (time || this.time)
        ;(this.props.onChange || emptyFn)(value)
    },

    time: function(){

    },

    renderTimePicker: function(){
        var format = this.timeFormat.toLowerCase()
        return <TimePicker format={format} onChange={this.onTimeChange} defaultValue={this.time} style={{border: 0, position: 'absolute', width: '100%', margin: 'auto', top: 0, bottom: 0}}/>
    },

    render: function(){

        var state = this.state
        var views = assign({
            time: function(){
                return this.renderTimePicker({
                    time: this.time
                })
            }.bind(this)
        }, DatePicker.views)

        var props = assign({}, this.props)
        props.defaultDate = props.date

        var dateFormat = this.dateFormat = 'YYYY-MM-DD'
        var timeFormat = this.timeFormat = 'HH:mm:ss'

        var format     = dateFormat + ' ' + timeFormat
        var date = moment(props.value, typeof props.value == 'number'? null: format)

        this.date = date.format(dateFormat)
        this.time = date.format(timeFormat)

        delete props.date
        delete props.value

        return <DatePicker {...props} defaultDate={date} onChange={this.onDateChange} onViewChange={this.changeView} view={this.state.view} ref="datePicker" hideHeader={this.state.hideHeader} views={views} footerFactory={this.renderFooter}/>
    }
})

var App = React.createClass({

    displayName: 'App',

    onLocaleChange: function(event) {
        LOCALE = event.target.value

        this.setState({})
    },

    render: function(){
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

            <Picker
                locale   ={LOCALE}
                value    ={VALUE}
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

React.render(<App />, document.getElementById('content'))