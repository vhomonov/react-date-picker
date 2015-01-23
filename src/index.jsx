'use strict'

var React  = require('react')

var moment   = require('moment')
var asConfig = require('./utils/asConfig')
var assign   = require('object-assign')

var MonthView  = require('./MonthView')
var YearView   = require('./YearView')
var DecadeView = require('./DecadeView')
var Header = require('./Header')

var toMoment = require('./toMoment')
var isMoment = require('./isMoment')

var hasOwn = function(obj, key){
    return Object.prototype.hasOwnProperty.call(obj, key)
}

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

    getViewOrder: function() {
        return ['month', 'year', 'decade']
    },

    getDefaultProps: function() {
        var props = assign({}, asConfig())

        delete props.viewDate
        delete props.date

        return props
    },

    getInitialState: function() {
        return {
            view: this.props.defaultView,
            viewDate: this.props.defaultViewDate
        }
    },

    getViewName: function() {
        return this.props.view != null?
                    this.props.view:
                    this.state.view || 'month'
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
        var date = hasOwn(this.props, 'viewDate')?
                        this.props.viewDate:
                        this.state.viewDate

        date = this.toMoment(date || this.props.date || new Date())

        return date
    },

    render: function() {

        this.toMoment = function(value){
            return toMoment(value, this.props.dateFormat)
        }.bind(this)

        var view     = this.getViewFactory()
        var props    = asConfig(this.props)

        props.viewDate  = this.getViewDate()

        props.renderDay   = this.props.renderDay
        props.onRenderDay = this.props.onRenderDay

        props.onChange  = this.handleChange
        props.onSelect  = this.handleSelect

        var className = (this.props.className || '') + ' date-picker'

        return (
            <div className={className} {...this.props}>
                <div className="dp-inner">
                    {this.renderHeader(view)}

                    <div className="dp-body">
                        <div className="dp-anim-target">
                        {view(props)}
                        </div>
                    </div>

                    {this.renderFooter(props)}
                </div>
            </div>
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
            <div className="dp-footer">
                <div className="dp-footer-today" onClick={this.gotoNow}>
                    {todayText}
                </div>
                <div className="dp-footer-selected" onClick={this.gotoSelected}>
                    {gotoSelectedText}
                </div>
            </div>
        )
    },

    gotoNow: function() {
        this.gotoDate(+new Date())
    },

    gotoSelected: function() {
        this.gotoDate(this.props.date || +new Date())
    },

    gotoDate: function(value) {
        this.setView('month')

        this.setViewDate(value)
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

        return <Header 
                prevText={prev}
                nextText={next}
                colspan={colspan}
                onPrev={this.handlePrevNav}
                onNext={this.handleNextNav}
                onChange={this.handleViewChange}
            >
            {headerText}
        </Header>
    },

    handleRenderDay: function (date) {
        return (this.props.renderDay || emptyFn)(date) || []
    },

    handleViewChange: function() {
        this.setView(this.getNextViewName())
    },

    /**
     * Use this method to set the view.
     * 
     * @param {String} view 'month'/'year'/'decade'
     *
     * It calls onViewChange, and if the view is uncontrolled, also sets it is state,
     * so the datepicker gets re-rendered view the new view
     * 
     */
    setView: function(view) {

        if (typeof this.props.onViewChange == 'function'){
            this.props.onViewChange(view)
        }

        if (this.props.view == null){
            this.setState({
                view: view
            })
        }
    },

    setViewDate: function(moment) {

        moment = this.toMoment(moment)

        var fn = this.props.onViewDateChange

        if (typeof fn == 'function'){

            var text = moment.format(this.props.dateFormat)
            var view = this.getViewName()

            fn(moment, text, view)
        }

        if (!hasOwn(this.props, 'viewDate')){
            this.setState({
                viewDate: moment
            })
        }
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

    handleNavigation: function(direction, event) {
        var viewMoment = direction == -1?
                            this.getPrev():
                            this.getNext()

        this.setViewDate(viewMoment)

        if (typeof this.props.onNav === 'function'){
            var text = viewMoment.format(this.props.dateFormat)
            var view = this.getViewName()

            this.props.onNav(viewMoment, text, view, direction, event)
        }
    },

    handlePrevNav: function(event) {
        this.handleNavigation(-1, event)
    },

    handleNextNav: function(event) {
        this.handleNavigation(1, event)
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

        this.setViewDate(viewMoment)

        this.setView(view)

        if (typeof this.props.onSelect === 'function'){
            var text = viewMoment.format(this.props.dateFormat)
            this.props.onSelect(viewMoment, text, view, event)
        }
    }

})

module.exports = DatePicker