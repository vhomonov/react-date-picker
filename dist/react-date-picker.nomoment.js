(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("moment"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "moment"], factory);
	else if(typeof exports === 'object')
		exports["DatePicker"] = factory(require("React"), require("moment"));
	else
		root["DatePicker"] = factory(root["React"], root["moment"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict'

	var React  = __webpack_require__(1)

	var moment    = __webpack_require__(2)
	var asConfig = __webpack_require__(7)

	var MonthView  = __webpack_require__(3)
	var YearView   = __webpack_require__(4)
	var DecadeView = __webpack_require__(5)
	var Header = __webpack_require__(6)

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

	var getWeekDayNames = __webpack_require__(8)

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
	        return asConfig()
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
	        return this.state.viewMoment || this.props.viewDate || this.props.date || this.now
	    },

	    render: function() {

	        this.now = +new Date()

	        var view     = this.getViewFactory()
	        var props    = asConfig(this.props)

	        props.viewDate  = this.getViewDate()

	        props.renderDay   = this.props.renderDay
	        props.onRenderDay = this.props.onRenderDay

	        props.onChange  = this.handleChange
	        props.onSelect  = this.handleSelect

	        var className = (this.props.className || '') + ' date-picker'

	        return (
	            React.createElement("div", React.__spread({className: className},  this.props), 
	                React.createElement("div", {className: "dp-inner"}, 
	                    this.renderHeader(view), 

	                    React.createElement("div", {className: "dp-body"}, 
	                        React.createElement("div", {className: "dp-anim-target"}, 
	                        view(props)
	                        )
	                    ), 

	                    this.renderFooter(props)
	                )
	            )
	        )
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

	        return React.createElement(Header, {
	                prevText: prev, 
	                nextText: next, 
	                colspan: colspan, 
	                onPrev: this.handlePrevNav, 
	                onNext: this.handleNextNav, 
	                onChange: this.handleViewChange
	            }, 
	            headerText
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

	        return ({
	            month: function() {
	                return moment(current).add(1, 'month')
	            },
	            year: function() {
	                return moment(current).add(1, 'year')
	            },
	            decade: function() {
	                return moment(current).add(10, 'year')
	            }
	        })[this.getViewName()]()
	    },

	    getPrev: function() {
	        var current = this.getViewDate()

	        return ({
	            month: function() {
	                return moment(current).add(-1, 'month')
	            },
	            year: function() {
	                return moment(current).add(-1, 'year')
	            },
	            decade: function() {
	                return moment(current).add(-10, 'year')
	            }
	        })[this.getViewName()]()
	    },

	    handlePrevNav: function(event) {
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

	    handleNextNav: function(event) {
	        var viewMoment = this.getNext()

	        this.setState({
	            viewMoment: viewMoment
	        })

	        if (typeof this.props.onNav === 'function'){
	            var text = viewMoment.format(this.props.dateFormat)
	            var view = this.getViewName()

	            this.props.onNav(viewMoment, text, view, 1, event)
	        }
	    },

	    handleChange: function(date, event) {
	        date = moment(date)

	        var text = date.format(this.props.dateFormat)

	        ;(this.props.onChange || emptyFn)(date, text, event)
	    },

	    handleSelect: function(date, event) {
	        var viewName = this.getViewName()

	        var property = ({
	            decade: 'year',
	            year  : 'month'
	        })[viewName]

	        var value      = date.get(property)
	        var viewMoment = moment(this.getViewDate()).set(property, value)
	        var view       = this.getPrevViewName()

	        this.setState({
	            viewMoment: viewMoment,
	            view      : view
	        })

	        if (typeof this.props.onSelect === 'function'){
	            var text = viewMoment.format(this.props.dateFormat)
	            this.props.onSelect(viewMoment, text, view, event)
	        }
	    }

	})

	module.exports = DatePicker

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict'

	var React  = __webpack_require__(1)
	var moment = __webpack_require__(2)

	var FORMAT   = __webpack_require__(9)
	var asConfig = __webpack_require__(7)
	var toMoment = __webpack_require__(10)

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
	        var clone = moment(value).startOf('week')

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
	        var first = moment(value).startOf('month')
	        var start = this.getWeekStartMoment(first)
	        var result = []
	        var i = 0

	        if (first.add(-1, 'days').isBefore(start)){
	            //make sure the last day of prev month is included
	            start.add(-1, 'weeks')
	        }

	        for (; i < 42; i++){
	            result.push(moment(start))
	            start.add(1, 'days')
	        }

	        return result
	    },

	    render: function() {

	        TODAY = +moment().startOf('day')

	        var viewMoment = this.props.viewMoment = toMoment(this.props.viewDate, this.props.dateFormat)

	        this.props.minDate && (this.props.minDate = +toMoment(this.props.minDate, this.props.dateFormat))
	        this.props.maxDate && (this.props.maxDate = +toMoment(this.props.maxDate, this.props.dateFormat))

	        if (this.props.minDate){
	            // debugger
	        }

	        this.monthFirst = moment(viewMoment).startOf('month')
	        this.monthLast  = moment(viewMoment).endOf('month')

	        if (this.props.date){
	            this.props.moment = moment(this.props.date).startOf('day')
	        }

	        var daysInView = this.getDaysInMonth(viewMoment)

	        return (
	            React.createElement("table", {className: "dp-table dp-month-view"}, 
	                React.createElement("tbody", null, 
	                    this.renderWeekDayNames(), 

	                    this.renderDays(daysInView)

	                )
	            )
	        )
	    },

	    /**
	     * Render the given array of days
	     * @param  {Moment[]} days
	     * @return {React.DOM}
	     */
	    renderDays: function(days) {
	        var nodes      = days.map(this.renderDay, this)
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

	    renderDay: function(date) {
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

	        if (this.props.minDate && date < this.props.minDate){
	            classes.push('dp-disabled dp-before-min')
	        }
	        if (this.props.maxDate && date > this.props.maxDate){
	            classes.push('dp-disabled dp-after-max')
	        }

	        if (dateTimestamp == this.props.moment){
	            classes.push('dp-value')
	        }

	        var renderDayProps = {
	            key      : dayText,
	            text     : dayText,
	            date     : date,
	            className: classes.join(' '),
	            style    : {},
	            onClick  : this.handleClick.bind(this, date, dateTimestamp),
	            children : dayText
	        }

	        if (typeof this.props.onRenderDay === 'function'){
	            renderDayProps = this.props.onRenderDay(renderDayProps)
	        }

	        var defaultRenderFunction = React.DOM.td
	        var renderFunction = this.props.renderDay || defaultRenderFunction

	        var result = renderFunction(renderDayProps)

	        if (result === undefined){
	            result = defaultRenderFunction(renderDayProps)
	        }

	        return result
	    },

	    renderWeekDayNames: function(){
	        var names = this.props.weekDayNames

	        return (
	            React.createElement("tr", {className: "dp-row dp-week-day-names"}, 
	                names.map(function(name)  {return React.createElement("td", {key: name, className: "dp-cell dp-week-day-name"}, name);})
	            )
	        )
	    },

	    handleClick: function(date, timestamp, event) {
	        if (this.props.minDate && timestamp < this.props.minDate){
	            return
	        }
	        if (this.props.maxDate && timestamp > this.props.maxDate){
	            return
	        }

	        event.target.value = date

	        ;(this.props.onChange || emptyFn)(date, event)
	    }
	})

	MonthView.getHeaderText = function(moment) {
	    return toMoment(moment).format('MMMM YYYY')
	}

	module.exports = MonthView

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict'

	var React  = __webpack_require__(1)
	var moment = __webpack_require__(2)

	var FORMAT   = __webpack_require__(9)
	var asConfig = __webpack_require__(7)
	var toMoment = __webpack_require__(10)

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

	        var viewMoment = this.props.viewMoment = moment(this.props.viewDate)

	        if (this.props.date){
	            this.props.moment = moment(this.props.date).startOf('month')
	        }

	        var monthsInView = this.getMonthsInYear(viewMoment)

	        return (
	            React.createElement("table", {className: "dp-table dp-year-view"}, 
	                React.createElement("tbody", null, 
	                    this.renderMonths(monthsInView)

	                )
	            )
	        )
	    },

	    /**
	     * Render the given array of days
	     * @param  {Moment[]} days
	     * @return {React.DOM}
	     */
	    renderMonths: function(days) {
	        var nodes      = days.map(this.renderMonth, this)
	        var len        = days.length
	        var buckets    = []
	        var bucketsLen = Math.ceil(len / 4)

	        var i = 0

	        for ( ; i < bucketsLen; i++){
	            buckets.push(nodes.slice(i * 4, (i + 1) * 4))
	        }

	        return buckets.map(function(bucket, i){
	            return React.createElement("tr", {key: "row" + i}, bucket)
	        })
	    },

	    renderMonth: function(date) {
	        var monthText = FORMAT.month(date)
	        var classes = ["dp-cell dp-month"]

	        var dateTimestamp = +date

	        if (dateTimestamp == this.props.moment){
	            classes.push('dp-value')
	        }

	        return (
	            React.createElement("td", {key: monthText, className: classes.join(' '), onClick: this.handleClick.bind(this, date)}, 
	                monthText
	            )
	        )
	    },

	    handleClick: function(date, event) {
	        event.target.value = date
	        ;(this.props.onSelect || emptyFn)(date, event)
	    }
	})

	YearView.getHeaderText = function(moment) {
	    return toMoment(moment).format('YYYY')
	}

	module.exports = YearView

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict'

	var React  = __webpack_require__(1)
	var moment = __webpack_require__(2)

	var FORMAT   = __webpack_require__(9)
	var asConfig = __webpack_require__(7)
	var toMoment = __webpack_require__(10)

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

	        TODAY = +moment().startOf('day')

	        var viewMoment = this.props.viewMoment = moment(this.props.viewDate)

	        if (this.props.date){
	            this.props.moment = moment(this.props.date).startOf('year')
	        }

	        var yearsInView = this.getYearsInDecade(viewMoment)

	        return (
	            React.createElement("table", {className: "dp-table dp-decade-view"}, 
	                React.createElement("tbody", null, 
	                    this.renderYears(yearsInView)

	                )
	            )
	        )
	    },

	    /**
	     * Render the given array of days
	     * @param  {Moment[]} days
	     * @return {React.DOM}
	     */
	    renderYears: function(days) {
	        var nodes      = days.map(this.renderYear, this)
	        var len        = days.length
	        var buckets    = []
	        var bucketsLen = Math.ceil(len / 4)

	        var i = 0

	        for ( ; i < bucketsLen; i++){
	            buckets.push(nodes.slice(i * 4, (i + 1) * 4))
	        }

	        return buckets.map(function(bucket, i){
	            return React.createElement("tr", {key: "row" + i}, bucket)
	        })
	    },

	    renderYear: function(date, index, arr) {
	        var yearText = FORMAT.year(date)
	        var classes = ["dp-cell dp-year"]

	        var dateTimestamp = +date

	        if (dateTimestamp == this.props.moment){
	            classes.push('dp-value')
	        }

	        if (!index){
	            classes.push('dp-prev')
	        }

	        if (index == arr.length - 1){
	            classes.push('dp-next')
	        }

	        return (
	            React.createElement("td", {key: yearText, className: classes.join(' '), onClick: this.handleClick.bind(this, date)}, 
	                yearText
	            )
	        )
	    },

	    handleClick: function(date, event) {
	        event.target.value = date
	        ;(this.props.onSelect || emptyFn)(date, event)
	    }
	})

	DecadeView.getHeaderText = function(value) {
	    var year = moment(value).get('year')
	    var offset = year % 10

	    year = year - offset - 1

	    return year + ' - ' + (year + 11)
	}

	module.exports = DecadeView

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React = __webpack_require__(1)

	module.exports = React.createClass({

		displayName: 'DatePickerHeader',

		render: function() {

			var props = this.props

			return React.createElement("div", {className: "dp-header"}, 
	            React.createElement("table", {className: "dp-nav-table"}, 
	            	React.createElement("tbody", null, 
		                React.createElement("tr", {className: "dp-row"}, 
		                    React.createElement("td", {
		                    	className: "dp-prev-nav dp-nav-cell dp-cell", 
		                    	onClick: props.onPrev
		                    }, props.prevText
		                    ), 

		                    React.createElement("td", {
		                    	className: "dp-nav-view dp-cell", 
		                    	colSpan: props.colspan, 
		                    	onClick: props.onChange
		                    }, props.children), 

		                    React.createElement("td", {
		                    	className: "dp-next-nav dp-nav-cell dp-cell", 
		                    	onClick: props.onNext
		                    }, props.nextText)
		                )
	            	)
	            )
	        )
		}

	})

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var assign = __webpack_require__(12)

	var CONFIG = __webpack_require__(11)
	var KEYS   = Object.keys(CONFIG)

	function copyList(src, target, list){
		if (src){
			list.forEach(function(key){
				target[key] = src[key]
			})
		}

		return target
	}

	/**
	 * Returns an object that copies from given source object
	 * on the resulting object only the properties also found in cfg.
	 *
	 * If no cfg specified, CONFIG is assumed
	 *
	 * @param  {object} source
	 * @param  {Object} [cfg] If not specied, CONFIG will be used
	 *
	 * @return {Object}
	 */
	module.exports = function asConfig(source, cfg){

	    var keys = KEYS

	    if (cfg){
	        keys = Object.keys(cfg)
	    }

	    cfg = cfg || CONFIG

	    if (!source){
	        return assign({}, cfg)
	    }

	    return copyList(source, assign({}, cfg), keys)
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var moment = __webpack_require__(2)

	var DEFAULT_WEEK_START_DAY = moment().startOf('week').format('d') * 1

	module.exports = function getWeekDayNames(startDay){

	    var names = moment.weekdaysShort()
	    var index = startDay || DEFAULT_WEEK_START_DAY

	    while (index > 0){
	        names.push(names.shift())
	        index--
	    }

	    return names
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var CONFIG   = __webpack_require__(11)
	var toMoment = __webpack_require__(10)

	function f(mom, format){
	    return toMoment(mom).format(format)
	}

	module.exports = {
	    day: function(mom, format) {
	        return f(mom, format || CONFIG.dayFormat)
	    },

	    month: function(mom, format) {
	        return f(mom, format || CONFIG.monthFormat)
	    },

	    year: function(mom, format) {
	        return f(mom, format || CONFIG.yearFormat)
	    }
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var moment = __webpack_require__(2)
	var CONFIG = __webpack_require__(11)

	/**
	 * This function will be used to convert a date to a moment.
	 *
	 * It accepts input as sring, date or moment
	 *
	 * @param  {String/Date/Moment} value
	 * @param  {String} [dateFormat] if value is string, it will be parsed to a moment using this format
	 * @param  {Object} [config]
	 * @param  {Boolean} [config.strict] whether to perform strict parsing on strings
	 * @return {Moment}
	 */
	module.exports = function(value, dateFormat, config){
	    var strict = !!(config && config.strict)

	    dateFormat = dateFormat || CONFIG.dateFormat

	    if (typeof value == 'string'){
	        return moment(value, dateFormat, strict)
	    }

	    return moment(value == null? new Date(): value)
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var getWeekDayNames = __webpack_require__(8)

	module.exports = {

	    //the names of week days to be displayed in month view - first should be sunday
	    weekDayNames: getWeekDayNames(),

	    //the day to display as first day of week. defaults to 0, which is sunday
	    weekStartDay: 0,

	    //the format in which days should be displayed in month view
	    dayFormat: 'D',

	    //the format in which months should be displayed in year view
	    monthFormat: 'MMMM',

	    //the format in which years should be displayed in decade view
	    yearFormat: 'YYYY',

	    //text for navigating to prev period
	    navPrev      : '‹',

	    //text for navigating to next period
	    navNext      : '›',

	    //the view to render initially. Possible values are: 'month', 'year', 'decade'
	    view: 'month',

	    //the date to mark as selected in the date picker.
	    //Can be a Date object, a moment object or a string.
	    //If it's a string, it will be parsed using dateFormat
	    date: null,

	    minDate: null,

	    maxDate: null,

	    //the date where to open the picker. defaults to today if no date and no viewDate specified
	    viewDate: null,

	    //if the date property is given as string, it will be parsed using this format
	    dateFormat: 'YYYY-MM-DD'
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ }
/******/ ])
});
