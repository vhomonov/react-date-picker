'use strict'

var React  = require('react')

var moment    = require('moment')
var copyUtils = require('copy-utils')

var copy     = copyUtils.copy
var copyList = copyUtils.copyList

var asConfig = require('./utils/asConfig')

var MonthView  = require('./MonthView')
var YearView   = require('./YearView')
var DecadeView = require('./DecadeView')

// if (React.createFactory){
//     MonthView  = React.createFactory(MonthView)
//     YearView   = React.createFactory(YearView)
//     DecadeView = React.createFactory(DecadeView)
// }

var Views = {
    month : MonthView,
    year  : YearView,
    decade: DecadeView
}

var getWeekDayNames = require('./utils/getWeekDayNames')

function emptyFn(){}

var DatePicker = React.createClass({

    displayName: 'DatePicker',

    propTypes: {
        todayText: React.PropTypes.string,
        gotoSelectedText: React.PropTypes.string,

        renderFooter: React.PropTypes.func,
        onChange: React.PropTypes.func,

        date: React.PropTypes.any,
        viewDate: React.PropTypes.any
    },

    getInitialState: function() {
        return {
        }
    },

    getDefaultProps: function() {
<<<<<<< HEAD
        var props = assign({}, asConfig(), {
            navOnDateClick: true,
            defaultStyle: {
                boxSizing: 'border-box'
            }
        })

        delete props.viewDate
        delete props.date

        return props
=======
        return asConfig()
>>>>>>> 44a5e8fac98c6fd460a2f67fce1fdd9ee937f6fb
    },

    getViewName: function() {
        return this.state.view || this.props.view || 'month'
    },

    getViewOrder: function() {
        return ['month', 'year', 'decade']
    },

    addViewIndex: function(amount) {
        var viewName = this.getViewName()

        var order = this.getViewOrder()
        var index = order.indexOf(viewName)

        index += amount

        return index % order.length
    },

    getNextViewName: function() {
        return this.getViewOrder()[this.addViewIndex(1)]
    },

    getPrevViewName: function() {
        return this.getViewOrder()[this.addViewIndex(-1)]
    },

    getView: function() {
        return Views[this.getViewName()] || Views.month
    },

    getViewFactory: function() {
        var view = this.getView()

        if (React.createFactory){
            view.__factory = view.__factory || React.createFactory(view)
            view = view.__factory
        }

        return view
    },

    getViewDate: function() {
<<<<<<< HEAD
        var date = hasOwn(this.props, 'viewDate')?
                        this.props.viewDate:
                        this.state.viewDate

        date = this.toMoment(date || this.viewMoment || this.props.date || new Date())

        return date
=======
        return this.state.viewMoment || this.viewMoment || this.props.viewDate || this.props.date || this.now
>>>>>>> 44a5e8fac98c6fd460a2f67fce1fdd9ee937f6fb
    },

    render: function() {

<<<<<<< HEAD
        var props = asConfig(this.props)

        this.toMoment = function(value, dateFormat){
            return toMoment(value, dateFormat || props.dateFormat, { locale: props.locale })
        }

        var view  = this.getViewFactory()

        props.viewDate   = this.viewMoment = this.getViewDate()
        props.locale     = this.props.locale
        props.localeData = moment.localeData(props.locale)
=======
        this.now = +new Date()

        var view     = this.getViewFactory()
        var props    = asConfig(this.props)

        props.viewDate  = this.viewMoment = this.getViewDate()
>>>>>>> 44a5e8fac98c6fd460a2f67fce1fdd9ee937f6fb

        props.renderDay = this.props.renderDay
        props.onRenderDay = this.props.onRenderDay

        props.onChange  = this.handleChange
        props.onSelect  = this.handleSelect

        var className = (this.props.className || '') + ' date-picker'

        props.style = this.prepareStyle(props)

        return (
            React.createElement("div", React.__spread({className: className, style: props.style},  this.props), 
                React.createElement("div", {className: "dp-inner", style: {width: '100%', height: '100%', display: 'flex', flexFlow: 'column'}}, 
                    this.renderHeader(view), 

                    React.createElement("div", {className: "dp-body", style: {flex: 1}}, 
                        React.createElement("div", {className: "dp-anim-target"}, 
                        view(props)
                        )
                    ), 

                    this.renderFooter(props)
                )
            )
        )
    },

    prepareStyle: function(props) {
        var style = assign({}, props.defaultStyle, props.style)

        return style
    },

    renderFooter: function(props) {
        if (this.props.hideFooter){
            return
        }

        if (this.props.today){
            console.warn('Please use "todayText" prop instead of "today"!')
        }
        if (this.props.gotoSelected){
            console.warn('Please use "gotoSelectedText" prop instead of "gotoSelected"!')
        }

        var todayText    = this.props.todayText || 'Today'
        var gotoSelectedText = this.props.gotoSelectedText || 'Go to selected'

        var footerProps = {
            todayText          : todayText,
            gotoSelectedText   : gotoSelectedText,
            onTodayClick       : this.gotoNow,
            onGotoSelectedClick: this.gotoSelected,
            date               : props.date,
            viewDate           : props.viewDate
        }

        var result
        if (typeof this.props.renderFooter == 'function'){
            result = this.props.renderFooter(footerProps)
        }

        if (result !== undefined){
            return result
        }

        return (
            React.createElement("div", {className: "dp-footer"}, 
                React.createElement("div", {className: "dp-footer-today", onClick: this.gotoNow}, 
                    todayText
                ), 
                React.createElement("div", {className: "dp-footer-selected", onClick: this.gotoSelected}, 
                    gotoSelectedText
                )
            )
        )
    },

    gotoNow: function() {
        this.gotoDate(+new Date())
    },

    gotoSelected: function() {
        this.gotoDate(this.props.date || +new Date())
    },

    gotoDate: function(value) {
        this.setState({
            view: 'month',
            viewMoment: moment(value)
        })
    },

    getViewColspan: function(){
        var map = {
            month : 5,
            year  : 2,
            decade: 2
        }

        return map[this.getViewName()]
    },

    renderHeader: function(view) {

        var viewDate   = this.getViewDate()
        var headerText = this.getView().getHeaderText(viewDate)

        var colspan = this.getViewColspan()
        var prev    = this.props.navPrev
        var next    = this.props.navNext

<<<<<<< HEAD
        return React.createElement(Header, {
                prevText: prev, 
                nextText: next, 
                colspan: colspan, 
                onPrev: this.handleNavPrev, 
                onNext: this.handleNavNext, 
                onChange: this.handleViewChange
            }, 
            headerText
=======
        return (
            React.createElement("div", {className: "dp-header"}, 
                React.createElement("table", {className: "dp-nav-table"}, React.createElement("tbody", null, 
                    React.createElement("tr", {className: "dp-row"}, 
                        React.createElement("td", {className: "dp-prev-nav dp-nav-cell dp-cell", onClick: this.handleNavPrev}, prev), 

                        React.createElement("td", {className: "dp-nav-view dp-cell ", colSpan: colspan, onClick: this.handleViewChange}, headerText), 

                        React.createElement("td", {className: "dp-next-nav dp-nav-cell dp-cell", onClick: this.handleNavNext}, next)
                    )
                ))
            )
>>>>>>> 44a5e8fac98c6fd460a2f67fce1fdd9ee937f6fb
        )
    },

    handleRenderDay: function (date) {
        return (this.props.renderDay || emptyFn)(date) || []
    },

    handleViewChange: function() {
        this.setState({
            view: this.getNextViewName()
        })
    },

    getNext: function() {
        var current = this.getViewDate()
        var toMoment = this.toMoment

        return ({
            month: function() {
                return toMoment(current).add(1, 'month')
            },
            year: function() {
                return toMoment(current).add(1, 'year')
            },
            decade: function() {
                return toMoment(current).add(10, 'year')
            }
        })[this.getViewName()]()
    },

    getPrev: function() {
        var current = this.getViewDate()
        var toMoment = this.toMoment

        return ({
            month: function() {
                return toMoment(current).add(-1, 'month')
            },
            year: function() {
                return toMoment(current).add(-1, 'year')
            },
            decade: function() {
                return toMoment(current).add(-10, 'year')
            }
        })[this.getViewName()]()
    },

    handleNavPrev: function(event) {
        var viewMoment = this.getPrev()

        this.setState({
            viewMoment: viewMoment
        })

        if (typeof this.props.onNav === 'function'){
            var text = viewMoment.format(this.props.dateFormat)
            var view = this.getViewName()

            this.props.onNav(viewMoment, text, view, -1, event)
        }
    },

<<<<<<< HEAD
    handleNavPrev: function(event) {
        this.handleNavigation(-1, event)
    },

    handleNavNext: function(event) {
        this.handleNavigation(1, event)
=======
    handleNavNext: function(event) {
        var viewMoment = this.getNext()

        this.setState({
            viewMoment: viewMoment
        })

        if (typeof this.props.onNav === 'function'){
            var text = viewMoment.format(this.props.dateFormat)
            var view = this.getViewName()

            this.props.onNav(viewMoment, text, view, 1, event)
        }
>>>>>>> 44a5e8fac98c6fd460a2f67fce1fdd9ee937f6fb
    },

    handleChange: function(date, event) {
        date = this.toMoment(date)

        if (this.props.navOnDateClick){
            var viewDate = this.toMoment(this.getViewDate())

            //it's not enough to compare months, since the year can change as well
            //
            //also it's ok to hardcode the format here
            var viewMonth = viewDate.format('YYYY-MM')
            var dateMonth = date.format('YYYY-MM')

            if (dateMonth > viewMonth){
                this.handleNavNext(event)
            } else if (dateMonth < viewMonth){
                this.handleNavPrev(event)
            }
        }

        var viewDate = moment(this.getViewDate())

        //it's not enough to compare months, since the year can change as well
        //
        //also it's ok to hardcode the format here
        var viewMonth = viewDate.format('YYYY-MM')
        var dateMonth = date.format('YYYY-MM')

        if (dateMonth > viewMonth){
            this.handleNavNext(event)
        } else if (dateMonth < viewMonth){
            this.handleNavPrev(event)
        }

        var text = date.format(this.props.dateFormat)

        ;(this.props.onChange || emptyFn)(date, text, event)
    },

    handleSelect: function(date, event) {
        var viewName = this.getViewName()
        var property = ({
            decade: 'year',
            year  : 'month'
        })[viewName]

<<<<<<< HEAD
        var value      = date.get(property)
        var viewMoment = this.toMoment(this.getViewDate()).set(property, value)
        var view       = this.getPrevViewName()

        this.setViewDate(viewMoment)
=======
        var value = date.get(property)
        var viewMoment = moment(this.getViewDate()).set(property, value)
        var view = this.getPrevViewName()
>>>>>>> 44a5e8fac98c6fd460a2f67fce1fdd9ee937f6fb

        this.setState({
            viewMoment: viewMoment,
            view: view
        })

        if (typeof this.props.onSelect === 'function'){
            var text = viewMoment.format(this.props.dateFormat)
            this.props.onSelect(viewMoment, text, view, event)
        }
    }

})

module.exports = DatePicker