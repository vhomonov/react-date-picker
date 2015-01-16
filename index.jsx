'use strict'

require('./index.styl')

require('moment/locale/nl')

var moment = require('moment')
console.log(moment().locale()) // nl

var React      = require('react')
var DatePicker = require('./src/index')

var DATE = Date.now()
var VALUE

var App = React.createClass({

    displayName: 'App',

    render: function(){
        var v = VALUE || Date.now()

        function onNav(moment, text, view){
            console.log(moment, text, view)
        }

        function onSelect(moment, text, view){
            console.log(moment, text, view)
        }

        function renderDay(props){
            props.className += ' aaa '

            return props
        }

        return <div style={{margin: 10}}>
            <DatePicker
                onNav={onNav}
                onSelect={onSelect}
                onRenderDay={renderDay}
                minDate='2014-04-04' maxDate='2015-10-10' date={v} hideFooter={true} viewDate={DATE} onChange={this.onChange}/></div>
    },

    onChange: function(date, dateString) {
        DATE  = dateString
        VALUE = dateString
        this.setState({})
    }
})

React.render(<App />, document.getElementById('content'))