'use strict'

var React  = require('react')
var moment = require('moment')
<<<<<<< HEAD
var assign = require('object-assign')
=======
var copy   = require('copy-utils').copy
>>>>>>> 44a5e8fac98c6fd460a2f67fce1fdd9ee937f6fb

var FORMAT   = require('./utils/format')
var asConfig = require('./utils/asConfig')
var toMoment = require('./toMoment')

var TODAY

function emptyFn(){}

var MonthView = React.createClass({

    displayName: 'MonthView',

    /**
     * Formats the given date in the specified format.
     * @method format
     *
     * @param  {Date/String/Moment} value
     * @param  {String} [format] If none specified, #dateFormat will be used
     *
     * @return {String}
     */

    formatAsDay: function(moment, dayDisplayFormat){
        return moment.format(dayDisplayFormat || 'D')
    },

    getDefaultProps: function() {

        return asConfig()
    },

    getWeekStartMoment: function(value){
        // var clone = moment(value).startOf('week')

        var weekStartDay = this.weekStartDay
        var clone = this.toMoment(value).day(weekStartDay)

            // debugger
        if (weekStartDay != null){
            // debugger
            // clone.add(this.props.weekStartDay, 'days')
        }

        // if (DEFAULT_WEEK_START_DAY != this.weekStartDay){
        //     clone.add('days', this.weekStartDay - DEFAULT_WEEK_START_DAY)
        // }

        return clone
    },

    /**
     * Returns all the days in the specified month.
     *
     * @param  {Moment/Date/Number} value
     * @return {Moment[]}
     */
    getDaysInMonth: function(value){
        var first = this.toMoment(value).startOf('month')
        var start = this.getWeekStartMoment(first)
        var result = []
        var i = 0

        if (first.add(-1, 'days').isBefore(start)){
            //make sure the last day of prev month is included
            start.add(-1, 'weeks')
        }

        for (; i < 42; i++){
            result.push(this.toMoment(start))
            start.add(1, 'days')
        }

        return result
    },

    render: function() {

        var props = assign({}, this.props)

        this.toMoment = function(value, dateFormat){
            // debugger
            return toMoment(value, dateFormat || props.dateFormat, { locale: props.locale })
        }

        TODAY = +this.toMoment().startOf('day')

        var dateFormat = props.dateFormat
        var viewMoment = props.viewMoment = this.toMoment(props.viewDate, dateFormat)

        var weekStartDay = props.weekStartDay

        if (weekStartDay == null){
            weekStartDay = props.localeData._week? props.localeData._week.dow: null
        }

        this.weekStartDay = props.weekStartDay = weekStartDay

        props.minDate && (props.minDate = +this.toMoment(props.minDate, dateFormat))
        props.maxDate && (props.maxDate = +this.toMoment(props.maxDate, dateFormat))

<<<<<<< HEAD
        this.monthFirst = this.toMoment(viewMoment).startOf('month')
        this.monthLast  = this.toMoment(viewMoment).endOf('month')
=======
        if (this.props.minDate){
            // debugger
        }

        this.monthFirst = moment(viewMoment).startOf('month')
        this.monthLast  = moment(viewMoment).endOf('month')
>>>>>>> 44a5e8fac98c6fd460a2f67fce1fdd9ee937f6fb

        if (props.date){
            props.moment = this.toMoment(props.date).startOf('day')
        }

        var daysInView = this.getDaysInMonth(viewMoment)

        return (
            React.createElement("table", {className: "dp-table dp-month-view"}, 
                React.createElement("tbody", null, 
                    this.renderWeekDayNames(), 
                    this.renderDays(props, daysInView)
                )
            )
        )
    },

    /**
     * Render the given array of days
     * @param  {Moment[]} days
     * @return {React.DOM}
     */
    renderDays: function(props, days) {
        var nodes = days.map(function(date){
            return this.renderDay(props, date)
        }, this)

        var len        = days.length
        var buckets    = []
        var bucketsLen = Math.ceil(len / 7)

        var i = 0

        for ( ; i < bucketsLen; i++){
            buckets.push(nodes.slice(i * 7, (i + 1) * 7))
        }

        return buckets.map(function(bucket, i){
            return React.createElement("tr", {key: "row" + i, className: "dp-week dp-row"}, bucket)
        })
    },

    renderDay: function(props, date) {
        var dayText = FORMAT.day(date)
        var classes = ["dp-cell dp-day"]

        var dateTimestamp = +date

        if (dateTimestamp == TODAY){
            classes.push('dp-current')
        } else if (dateTimestamp < this.monthFirst){
            classes.push('dp-prev')
        } else if (dateTimestamp > this.monthLast){
            classes.push('dp-next')
        }

        if (props.minDate && date < props.minDate){
            classes.push('dp-disabled dp-before-min')
        }
        if (props.maxDate && date > props.maxDate){
            classes.push('dp-disabled dp-after-max')
        }

        if (dateTimestamp == props.moment){
            classes.push('dp-value')
        }

        var renderDayProps = {
            key      : dayText,
            text     : dayText,
            date     : date,
            className: classes.join(' '),
            style    : {},
            onClick  : this.handleClick.bind(this, props, date, dateTimestamp),
            children : dayText
        }

        if (typeof props.onRenderDay === 'function'){
            renderDayProps = props.onRenderDay(renderDayProps)
        }

        var defaultRenderFunction = React.DOM.td
        var renderFunction = props.renderDay || defaultRenderFunction

        var result = renderFunction(renderDayProps)

        if (result === undefined){
            result = defaultRenderFunction(renderDayProps)
        }

        return result
    },

    getWeekDayNames: function(props) {
        props = props || this.props

        var names        = props.weekDayNames
        var weekStartDay = this.weekStartDay

        if (typeof names == 'function'){
            names = names(weekStartDay, props.locale)
        } else {
            var index = weekStartDay

            while (index > 0){
                names.push(names.shift())
                index--
            }
        }

        return names
    },

    renderWeekDayNames: function(){
        var names = this.getWeekDayNames()

        return (
            React.createElement("tr", {className: "dp-row dp-week-day-names"}, 
                names.map(function(name)  {return React.createElement("td", {key: name, className: "dp-cell dp-week-day-name"}, name);})
            )
        )
    },

    handleClick: function(props, date, timestamp, event) {
        if (props.minDate && timestamp < props.minDate){
            return
        }
        if (props.maxDate && timestamp > props.maxDate){
            return
        }

        event.target.value = date

        ;(props.onChange || emptyFn)(date, event)
    }
})

copy({
    getHeaderText: function(moment) {
        return toMoment(moment).format('MMMM YYYY')
    }
}, MonthView)

module.exports = MonthView