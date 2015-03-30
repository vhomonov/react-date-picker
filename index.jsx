'use strict'

require('./index.styl')

window.moment = require('moment')

var React      = require('react')
var DatePicker = require('./src/index')

var VALUE = Date.now()
var VIEW_DATE = null
var VIEW  = 'month'

var App = React.createClass({

    displayName: 'App',

    render: function(){
        var v = VALUE

        function onNav(text, moment, view){
            // console.log(arguments);
            // console.log(moment, text, view)
        }

        function onSelect(text, moment, view){
            // console.log('SELECT', arguments)
            // console.log(moment, text, view)
        }

        function renderDay(props){
            props.className += ' aaa '
            props.style = props.style || {}

            return props
        }

        var clear = function(){
            VALUE = null
            this.setState({})
        }.bind(this)

        var onViewChange = function(view){
            VIEW = view
            // console.log(arguments);
            this.setState({})
        }.bind(this)

        var onViewDateChange = function(d){
            console.log(arguments);
            VIEW_DATE = d
            this.setState({})
        }.bind(this)

        return <div style={{margin: 10}}>
            <DatePicker

                onNav={onNav}
                onSelect={onSelect}
                view={VIEW}
                onViewChange={onViewChange}
                onViewDateChange={onViewDateChange}
                onRenderDay={renderDay}
                xweekStartDay={0}
                locale="ro"
                xweekDayNames={['SUND','mon','marti','miercuri','joi','vineri','sam']}
                minDate='2013-04-04' maxDate='2015-10-10' date={v} onChange={this.onChange}/>

                <button onClick={clear}>clear</button>
            </div>
    },

    onChange: function(date, dateString) {
        // console.log(dateString, 'change')
        VALUE = dateString
        this.setState({})
    }
})

React.render(<App />, document.getElementById('content'))