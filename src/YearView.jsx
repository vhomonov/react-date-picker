'use strict'

var React  = require('react')
var moment = require('moment')

var FORMAT   = require('./utils/format')
var asConfig = require('./utils/asConfig')
var toMoment = require('./toMoment')
var assign = require('object-assign')

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

        TODAY = +moment().startOf('day')

        var props = assign({}, this.props)

        var viewMoment = props.viewMoment = moment(this.props.viewDate)

        if (props.date){
            props.moment = moment(props.date).startOf('month')
        }

        var monthsInView = this.getMonthsInYear(viewMoment)

        return (
            <table className="dp-table dp-year-view">
                <tbody>
                    {this.renderMonths(props, monthsInView)}

                </tbody>
            </table>
        )
    },

    /**
     * Render the given array of days
     * @param  {Moment[]} days
     * @return {React.DOM}
     */
    renderMonths: function(props, days) {
        var nodes      = days.map(function(date){
            return this.renderMonth(props, date)
        }, this)
        var len        = days.length
        var buckets    = []
        var bucketsLen = Math.ceil(len / 4)

        var i = 0

        for ( ; i < bucketsLen; i++){
            buckets.push(nodes.slice(i * 4, (i + 1) * 4))
        }

        return buckets.map(function(bucket, i){
            return <tr key={"row" + i} >{bucket}</tr>
        })
    },

    renderMonth: function(props, date) {
        var monthText = FORMAT.month(date, props.monthFormat)
        var classes = ["dp-cell dp-month"]

        var dateTimestamp = +date

        if (dateTimestamp == props.moment){
            classes.push('dp-value')
        }

        return (
            <td key={monthText} className={classes.join(' ')} onClick={this.handleClick.bind(this, props, date)}>
                {monthText}
            </td>
        )
    },

    handleClick: function(date, event) {
        event.target.value = date

        ;(props.onSelect || emptyFn)(date, event)
    }
})

YearView.getHeaderText = function(moment) {
    return toMoment(moment).format('YYYY')
}

module.exports = YearView