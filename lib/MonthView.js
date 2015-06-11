'use strict';

var React = require('react');
var moment = require('moment');
var assign = require('object-assign');

var FORMAT = require('./utils/format');
var asConfig = require('./utils/asConfig');
var toMoment = require('./toMoment');

var TODAY;

function emptyFn() {}

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

    formatAsDay: function formatAsDay(moment, dayDisplayFormat) {
        return moment.format(dayDisplayFormat || 'D');
    },

    getDefaultProps: function getDefaultProps() {

        return asConfig();
    },

    getWeekStartMoment: function getWeekStartMoment(value) {
        // var clone = moment(value).startOf('week')

        var weekStartDay = this.weekStartDay;
        var clone = this.toMoment(value).day(weekStartDay);

        // debugger
        if (weekStartDay != null) {}

        // if (DEFAULT_WEEK_START_DAY != this.weekStartDay){
        //     clone.add('days', this.weekStartDay - DEFAULT_WEEK_START_DAY)
        // }

        return clone;
    },

    /**
     * Returns all the days in the specified month.
     *
     * @param  {Moment/Date/Number} value
     * @return {Moment[]}
     */
    getDaysInMonth: function getDaysInMonth(value) {
        var first = this.toMoment(value).startOf('month');
        var start = this.getWeekStartMoment(first);
        var result = [];
        var i = 0;

        if (first.add(-1, 'days').isBefore(start)) {
            //make sure the last day of prev month is included
            start.add(-1, 'weeks');
        }

        for (; i < 42; i++) {
            result.push(this.toMoment(start));
            start.add(1, 'days');
        }

        return result;
    },

    render: function render() {

        var props = assign({}, this.props);

        this.toMoment = function (value, dateFormat) {
            return toMoment(value, dateFormat || props.dateFormat, { locale: props.locale });
        };

        TODAY = +this.toMoment().startOf('day');

        var dateFormat = props.dateFormat;
        var viewMoment = props.viewMoment = this.toMoment(props.viewDate, dateFormat);

        var weekStartDay = props.weekStartDay;

        if (weekStartDay == null) {
            weekStartDay = props.localeData._week ? props.localeData._week.dow : null;
        }

        this.weekStartDay = props.weekStartDay = weekStartDay;

        props.minDate && (props.minDate = +this.toMoment(props.minDate, dateFormat));
        props.maxDate && (props.maxDate = +this.toMoment(props.maxDate, dateFormat));

        this.monthFirst = this.toMoment(viewMoment).startOf('month');
        this.monthLast = this.toMoment(viewMoment).endOf('month');

        if (props.date) {
            props.moment = this.toMoment(props.date).startOf('day');
        }

        var daysInView = this.getDaysInMonth(viewMoment);

        return React.createElement(
            'table',
            { className: 'dp-table dp-month-view' },
            React.createElement(
                'tbody',
                null,
                this.renderWeekDayNames(),
                this.renderDays(props, daysInView)
            )
        );
    },

    /**
     * Render the week number cell
     * @param  {Moment[]} days
     * @param  {Number} firstDayOfWeekIndex
     * @return {React.DOM}
     */
    renderWeekNumber: function renderWeekNumber(props, days, firstDayOfWeekIndex) {

        var firstDayOfWeek = days[firstDayOfWeekIndex];
        var week = firstDayOfWeek.weeks();
        var dateTimestamp = +firstDayOfWeek;
        var weekDays = days.slice().splice(firstDayOfWeekIndex, 7);
        return React.createElement(
            'td',
            { key: 'week' + week, className: 'dp-cell dp-weeknumber', onClick: this.handleClick.bind(null, props, weekDays, dateTimestamp) },
            week
        );
    },

    /**
     * Render the given array of days
     * @param  {Moment[]} days
     * @return {React.DOM}
     */
    renderDays: function renderDays(props, days) {

        var nodes = days.map(function (date) {
            return this.renderDay(props, date);
        }, this);

        var numberOfDays = 7;
        var len = days.length;
        var buckets = [];
        var bucketsLen = Math.ceil(len / numberOfDays);

        var i = 0;

        for (; i < bucketsLen; i++) {

            var firstDayOfWeekIndex = i * numberOfDays;
            var week = props.weekNumbers ? [this.renderWeekNumber(props, days, firstDayOfWeekIndex)] : [];
            buckets.push(week.concat(nodes.slice(firstDayOfWeekIndex, (i + 1) * numberOfDays)));
        }

        return buckets.map(function (bucket, i) {
            return React.createElement(
                'tr',
                { key: 'row' + i, className: 'dp-week dp-row' },
                bucket
            );
        });
    },

    renderDay: function renderDay(props, date) {
        var dayText = FORMAT.day(date, props.dayFormat);
        var classes = ['dp-cell dp-day'];

        var dateTimestamp = +date;

        if (dateTimestamp == TODAY) {
            classes.push('dp-current');
        } else if (dateTimestamp < this.monthFirst) {
            classes.push('dp-prev');
        } else if (dateTimestamp > this.monthLast) {
            classes.push('dp-next');
        }

        if (props.minDate && date < props.minDate) {
            classes.push('dp-disabled dp-before-min');
        }
        if (props.maxDate && date > props.maxDate) {
            classes.push('dp-disabled dp-after-max');
        }

        if (dateTimestamp == props.moment) {
            classes.push('dp-value');
        }

        var mom = this.toMoment(date);

        var renderDayProps = {
            key: dayText,
            text: dayText,
            date: mom,
            moment: mom,
            className: classes.join(' '),
            style: {},
            onClick: this.handleClick.bind(this, props, date, dateTimestamp),
            children: dayText
        };

        if (typeof props.onRenderDay === 'function') {
            renderDayProps = props.onRenderDay(renderDayProps);
        }

        var defaultRenderFunction = React.DOM.td;
        var renderFunction = props.renderDay || defaultRenderFunction;

        var result = renderFunction(renderDayProps);

        if (result === undefined) {
            result = defaultRenderFunction(renderDayProps);
        }

        return result;
    },

    getWeekDayNames: function getWeekDayNames(props) {
        props = props || this.props;

        var names = props.weekDayNames;
        var weekStartDay = this.weekStartDay;

        if (typeof names == 'function') {
            names = names(weekStartDay, props.locale);
        } else if (Array.isArray(names)) {

            names = [].concat(names);

            var index = weekStartDay;

            while (index > 0) {
                names.push(names.shift());
                index--;
            }
        }

        return names;
    },

    renderWeekDayNames: function renderWeekDayNames() {
        var weekNumber = this.props.weekNumbers ? [''] : [];
        var names = weekNumber.concat(this.getWeekDayNames());

        return React.createElement(
            'tr',
            { className: 'dp-row dp-week-day-names' },
            names.map(function (name, index) {
                return React.createElement(
                    'td',
                    { key: index, className: 'dp-cell dp-week-day-name' },
                    name
                );
            })
        );
    },

    handleClick: function handleClick(props, date, timestamp, event) {

        var weekDates = null;

        if (props.minDate && timestamp < props.minDate) {
            return;
        }
        if (props.maxDate && timestamp > props.maxDate) {
            return;
        }

        if (Array.isArray(date)) {
            weekDates = date;
            date = date[0];
        }

        event.target.value = date;

        if (weekDates) {
            ;(props.onWeekChange || emptyFn)(weekDates, event);
        }

        ;(props.onChange || emptyFn)(date, event);
    }
});

MonthView.getHeaderText = function (moment, props) {
    return toMoment(moment, null, { locale: props.locale }).format('MMMM YYYY');
};

module.exports = MonthView;

// debugger
// clone.add(this.props.weekStartDay, 'days')