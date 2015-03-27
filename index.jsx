'use strict'

require('./index.styl')

var React      = require('react')
var DatePicker = require('./src/index')

var DATE = Date.now()
var VALUE = Date.now()

var App = React.createClass({

    displayName: 'App',

    render: function(){
        var v = VALUE

        function onNav(moment, text, view){
            console.log('nav to ', text)
        }

        function onSelect(moment, text, view){
            console.log('SELECT')
            console.log(moment, text, view)
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

        return <div style={{margin: 10}}>
            <DatePicker
                onNav={onNav}
                onSelect={onSelect}
                onRenderDay={renderDay}
                date={v} onChange={this.onChange}/>

                <button onClick={clear}>clear</button>
            </div>
    },

    onChange: function(date, dateString) {
        console.log('change',dateString)
        DATE  = dateString
        VALUE = dateString
        this.setState({})
    }
})

React.render(<App />, document.getElementById('content'))