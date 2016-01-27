'use strict'

var React  = require('react')
var moment = require('moment')

var FORMAT   = require('./utils/format')
var asConfig = require('./utils/asConfig')
var toMoment = require('./toMoment')
var onEnter  = require('./onEnter')
var assign   = require('object-assign')

var TODAY

function emptyFn(){}

var YearView = React.createClass({

    displayName: 'YearView',

    getDefaultProps: function() {

        return asConfig()
    },

    /**
     * Returns all the days in the specified month.
     *
     * @param  {Moment/Date/Number} value
     * @return {Moment[]}
     */
    getMonthsInYear: function(value){
        var start = moment(value).startOf('year')
        var result = []
        var i = 0

        for (; i < 12; i++){
            result.push(moment(start))
            start.add(1, 'month')
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
            props.moment = moment(props.date).startOf('month')
        }

        var monthsInView = this.getMonthsInYear(viewMoment)

        return (
            <div className="dp-table dp-year-view">
                {this.renderMonths(props, monthsInView)}
            </div>
        )
    },

    /**
     * Render the given array of days
     * @param  {Moment[]} days
     * @return {React.DOM}
     */
    renderMonths: function(props, days) {
        var nodes

        if (props.range){
            const beginRange = this.toMoment(props.range[0])
            const endRange = props.range[1]? this.toMoment(props.range[1]) : null

            nodes      = days.map(function(date){
                return this.renderMonth(props, date, beginRange, endRange)
            }, this)
        } else {
            nodes      = days.map(function(date){
                return this.renderMonth(props, date)
            }, this)
        } 
        
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

    renderMonth: function(props, date, beginRange, endRange) {
        var monthText = FORMAT.month(date, props.monthFormat)
        var classes = ["dp-cell dp-month"]

        var dateTimestamp = +date

        if (props.range){
          const thisDay = this.toMoment(dateTimestamp)
          if (thisDay.isBetween(beginRange, endRange, 'months') || thisDay.isBetween(endRange, beginRange, 'months')){
            classes.push('dp-in-selected-range')
          }
          if (thisDay.format('YYYYMM') == beginRange.format('YYYYMM')){
            classes.push('dp-value')
          }
          if (endRange){
            if (thisDay.format('YYYYMM') == endRange.format('YYYYMM'))
                classes.push('dp-value')
          }
        } else {
            if (dateTimestamp == props.moment){
                classes.push('dp-value')
            }
        }

        var onClick = this.handleClick.bind(this, props, date)

        return (
            <div
                tabIndex="1"
                role="link"
                key={monthText}
                className={classes.join(' ')}
                onClick={onClick}
                onKeyUp={onEnter(onClick)}
            >
                {monthText}
            </div>
        )
    },

    handleClick: function(props, date, event) {
        event.target.value = date

        ;(props.onSelect || emptyFn)(date, event)
    }
})

YearView.getHeaderText = function(moment, props) {
    return toMoment(moment, null, { locale: props.locale }).format('YYYY')
}

module.exports = YearView
