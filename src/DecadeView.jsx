'use strict'

var React  = require('react')
var moment = require('moment')
var assign = require('object-assign')

var FORMAT   = require('./utils/format')
var asConfig = require('./utils/asConfig')
var toMoment = require('./toMoment')
var onEnter  = require('./onEnter')
var assign   = require('object-assign')

var TODAY

function emptyFn(){}

var DecadeView = React.createClass({

    displayName: 'DecadeView',

    getDefaultProps: function() {
        return asConfig()
    },

    /**
     * Returns all the years in the decade of the given value
     *
     * @param  {Moment/Date/Number} value
     * @return {Moment[]}
     */
    getYearsInDecade: function(value){
        var year = moment(value).get('year')
        var offset = year % 10

        year = year - offset - 1

        var result = []
        var i = 0

        var start = moment(year, 'YYYY').startOf('year')

        for (; i < 12; i++){
            result.push(moment(start))
            start.add(1, 'year')
        }

        return result
    },

    render: function() {

        this.toMoment = function(value, dateFormat){
            return toMoment(value, dateFormat || props.dateFormat, { locale: props.locale })
        }

        TODAY = +moment().startOf('day')

        var props = assign({}, this.props)

        var viewMoment = props.viewMoment = moment(this.props.viewDate)

        if (props.date){
            props.moment = moment(props.date).startOf('year')
        }

        var yearsInView = this.getYearsInDecade(viewMoment)

        return (
            <div className="dp-table dp-decade-view">
                {this.renderYears(props, yearsInView)}
            </div>
        )
    },

    /**
     * Render the given array of days
     * @param  {Moment[]} days
     * @return {React.DOM}
     */
    renderYears: function(props, days) {
        var nodes

         if (props.range){
            const beginRange = this.toMoment(props.range[0])
            const endRange = props.range[1]? this.toMoment(props.range[1]) : null

            nodes      = days.map(function(date, index, arr){
            return this.renderYear(props, date, index, arr, beginRange, endRange)
        }, this)
        } else {
            nodes      = days.map(function(date, index, arr){
            return this.renderYear(props, date, index, arr)
        }, this)
        } 

        // var nodes      = days.map(function(date, index, arr){
        //     return this.renderYear(props, date, index, arr)
        // }, this)

        var len        = days.length
        var buckets    = []
        var bucketsLen = Math.ceil(len / 4)

        var i = 0

        for ( ; i < bucketsLen; i++){
            buckets.push(nodes.slice(i * 4, (i + 1) * 4))
        }

        return buckets.map(function(bucket, i){
            return <div key={"row" + i} className="dp-row">{bucket}</div>
        })
    },

    renderYear: function(props, date, index, arr, beginRange, endRange) {
        var yearText = FORMAT.year(date, props.yearFormat)
        var classes = ["dp-cell dp-year"]

        var dateTimestamp = +date

        if (props.range){
          const thisDay = this.toMoment(dateTimestamp)
          if (thisDay.isBetween(beginRange, endRange, 'years') || thisDay.isBetween(endRange, beginRange, 'years')){
            classes.push('dp-in-selected-range')
          }
          if (thisDay.format('YYYY') == beginRange.format('YYYY')){
            classes.push('dp-value')
          }
          if (endRange){
            if (thisDay.format('YYYY') == endRange.format('YYYY'))
                classes.push('dp-value')
          }
        } else {
            if (dateTimestamp == props.moment){
                classes.push('dp-value')
            }
        }


        if (!index){
            classes.push('dp-prev')
        }

        if (index == arr.length - 1){
            classes.push('dp-next')
        }

        var onClick = this.handleClick.bind(this, props, date)

        return (
            <div
                role="link"
                tabIndex="1"
                key={yearText}
                className={classes.join(' ')}
                onClick={onClick}
                onKeyUp={onEnter(onClick)}
            >
                {yearText}
            </div>
        )
    },

    handleClick: function(props, date, event) {
        event.target.value = date
        ;(props.onSelect || emptyFn)(date, event)
    }
})

DecadeView.getHeaderText = function(value, props) {
    var year = moment(value).get('year')
    var offset = year % 10

    year = year - offset - 1

    return year + ' - ' + (year + 11)
}

module.exports = DecadeView
