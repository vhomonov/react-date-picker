'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactClass = require('react-class');

var _reactClass2 = _interopRequireDefault(_reactClass);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _toMoment = require('./toMoment');

var _toMoment2 = _interopRequireDefault(_toMoment);

var _join = require('./join');

var _join2 = _interopRequireDefault(_join);

var _isInRange = require('./utils/isInRange');

var _isInRange2 = _interopRequireDefault(_isInRange);

var _NavBar = require('./NavBar');

var _NavBar2 = _interopRequireDefault(_NavBar);

var _bemFactory = require('./bemFactory');

var _bemFactory2 = _interopRequireDefault(_bemFactory);

var _BasicMonthView = require('./BasicMonthView');

var _BasicMonthView2 = _interopRequireDefault(_BasicMonthView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TODAY = void 0;

var emptyFn = function emptyFn() {};

var RENDER_DAY = function RENDER_DAY(props) {
  return _react2.default.createElement('div', props);
};

var MonthView = function (_Component) {
  _inherits(MonthView, _Component);

  function MonthView(props) {
    _classCallCheck(this, MonthView);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MonthView).call(this, props));

    _this.state = {
      range: props.defaultRange,
      date: props.defaultDate,
      activeDate: props.defaultActiveDate,
      viewDate: props.defaultViewDate
    };
    return _this;
  }

  _createClass(MonthView, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.updateBem(this.props);
      this.updateToMoment(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.defaultClassName != this.props.defaultClassName) {
        this.updateBem(nextProps);
      }

      this.updateToMoment(nextProps);
    }
  }, {
    key: 'updateBem',
    value: function updateBem(props) {
      this.bem = (0, _bemFactory2.default)(props.defaultClassName);
    }
  }, {
    key: 'updateToMoment',
    value: function updateToMoment(props) {

      this.toMoment = function (value, dateFormat) {
        return (0, _toMoment2.default)(value, {
          locale: props.locale,
          dateFormat: dateFormat || props.dateFormat
        });
      };

      TODAY = +this.toMoment().startOf('day');
    }
  }, {
    key: 'prepareDate',
    value: function prepareDate(props) {

      if (props.range) {
        return null;
      }

      return props.date === undefined ? this.state.date : props.date;
    }
  }, {
    key: 'prepareViewDate',
    value: function prepareViewDate(props) {
      var viewDate = props.viewDate === undefined ? this.state.viewDate : props.viewDate;

      return viewDate;
    }
  }, {
    key: 'prepareActiveDate',
    value: function prepareActiveDate(props) {
      var activeDate = props.activeDate === undefined ?
      //only fallback to date if activeDate not specified
      this.state.activeDate || this.prepareDate(props) : props.activeDate;

      var daysInView = props.daysInView;

      if (activeDate && daysInView && props.contrainActiveInView) {

        var activeMoment = this.toMoment(activeDate);

        if (!this.isInView(activeMoment, props)) {

          var date = this.prepareDate(props);
          var dateMoment = this.toMoment(date);

          if (date && this.isInView(dateMoment, props) && this.isValidActiveDate(+dateMoment)) {
            return date;
          }

          return null;
        }
      }

      return this.isValidActiveDate(+activeDate) ? activeDate : null;
    }
  }, {
    key: 'prepareProps',
    value: function prepareProps(thisProps) {
      var props = this.p = (0, _objectAssign2.default)({}, thisProps);

      var minDate = props.minDate;
      var maxDate = props.maxDate;


      if (minDate) {
        props.minDateMoment = this.toMoment(props.minDate).startOf('day');
        props.minDate = +props.minDateMoment;
      }

      if (maxDate) {
        props.maxDateMoment = this.toMoment(props.maxDate);
        props.maxDate = +props.maxDateMoment;
      }

      props.viewMoment = props.viewMoment || this.toMoment(this.prepareViewDate(props));

      if (props.constrainViewDate && props.minDate && props.viewMoment.isBefore(props.minDate)) {
        props.minContrained = true;
        props.viewMoment = this.toMoment(props.minDate);
      }

      if (props.constrainViewDate && props.maxDate && props.viewMoment.isAfter(props.maxDate)) {
        props.maxConstrained = true;
        props.viewMoment = this.toMoment(props.maxDate);
      }

      props.viewMonthStart = this.toMoment(props.viewMoment).startOf('month');
      props.viewMonthEnd = this.toMoment(props.viewMoment).endOf('month');

      var date = this.prepareDate(props);

      if (date) {
        props.moment = props.moment || (props.range ? null : this.toMoment(date).startOf('day'));
        props.timestamp = props.moment ? +props.moment : null;
      }

      props.daysInView = (0, _BasicMonthView.getDaysInMonthView)(props.viewMoment, props);

      var activeDate = this.prepareActiveDate(props);

      if (activeDate) {
        props.activeDate = +this.toMoment(activeDate);
      }

      return props;
    }
  }, {
    key: 'isInView',
    value: function isInView(moment, props) {
      props = props || this.p;

      var daysInView = props.daysInView;

      return (0, _isInRange2.default)(moment, { range: daysInView, inclusive: false });
    }
  }, {
    key: 'handleViewMouseLeave',
    value: function handleViewMouseLeave() {
      this.state.range && this.setState({ range: null });
    }
  }, {
    key: 'preparePrevNextClassName',
    value: function preparePrevNextClassName(timestamp, props) {
      var viewMonthStart = props.viewMonthStart;
      var viewMonthEnd = props.viewMonthEnd;


      var before = timestamp < viewMonthStart;
      var after = timestamp > viewMonthEnd;

      var thisMonth = !before && !after;

      return (0, _join2.default)(timestamp == TODAY && this.bem('day--today'), before && this.bem('day--prev-month'), before && !props.showDaysBeforeMonth && this.bem('day--hidden'), after && this.bem('day--next-month'), after && !props.showDaysAfterMonth && this.bem('day--hidden'), thisMonth && this.bem('day--this-month'));
    }
  }, {
    key: 'isValidActiveDate',
    value: function isValidActiveDate(timestamp, props) {
      props = props || this.p;

      if (props.minDate && timestamp < props.minDate) {
        return false;
      }
      if (props.maxDate && timestamp > props.maxDate) {
        return false;
      }

      return true;
    }
  }, {
    key: 'prepareMinMaxProps',
    value: function prepareMinMaxProps(timestamp, props) {

      var classes = [];

      var isBeforeMinDate = false;
      var isAfterMaxDate = false;

      var minDate = props.minDate;
      var maxDate = props.maxDate;


      if (minDate && timestamp < minDate) {
        classes.push(this.bem('day--disabled'), this.bem('day--disabled-min'));
        isBeforeMinDate = true;
      }

      if (maxDate && timestamp > maxDate) {
        classes.push(this.bem('day--disabled'), this.bem('day--disabled-max'));
        isAfterMaxDate = true;
      }

      return {
        className: (0, _join2.default)(classes),
        isBeforeMinDate: isBeforeMinDate,
        isAfterMaxDate: isAfterMaxDate,
        isDisabled: isBeforeMinDate || isAfterMaxDate
      };
    }
  }, {
    key: 'prepareWeekendClassName',
    value: function prepareWeekendClassName(dateMoment, _ref) {
      var highlightWeekends = _ref.highlightWeekends;


      var weekDay = dateMoment.day();

      if (weekDay === 0 /* Sunday */ || weekDay === 6 /* Saturday */) {
          return (0, _join2.default)(this.bem('day--weekend'), highlightWeekends && this.bem('day--weekend-highlight'));
        }
    }
  }, {
    key: 'prepareRangeProps',
    value: function prepareRangeProps(dateMoment, props) {
      var range = this.state.range || this.props.range;

      var inRange = false;
      var className = '';

      if (range) {
        var start = dateMoment;
        var end = (0, _moment2.default)(start).endOf('day');

        var _range = _slicedToArray(range, 2);

        var rangeStart = _range[0];
        var rangeEnd = _range[1];


        if ((0, _isInRange2.default)(start, range) || (0, _isInRange2.default)(end, range) || rangeStart && (0, _isInRange2.default)(rangeStart, [start, end]) || rangeEnd && (0, _isInRange2.default)(rangeEnd, [start, end])) {
          className = this.bem('dp-in-range');
          inRange = true;
        }
      }

      return {
        inRange: inRange,
        className: className
      };
    }
  }, {
    key: 'prepareDayProps',
    value: function prepareDayProps(renderDayProps, props) {
      var timestamp = renderDayProps.timestamp;
      var dateMoment = renderDayProps.dateMoment;
      var className = renderDayProps.className;


      props = props || this.p;
      var result = {};

      var minMaxProps = this.prepareMinMaxProps(timestamp, props);
      var rangeProps = this.prepareRangeProps(dateMoment, props);

      var weekendClassName = this.prepareWeekendClassName(dateMoment, props);
      var prevNextClassName = this.preparePrevNextClassName(timestamp, props);

      var currentTimestamp = props.timestamp;

      var eventParam = { timestamp: timestamp, dateMoment: dateMoment };

      var events = {
        onClick: this.handleClick.bind(this, eventParam)
      };

      if (!minMaxProps.isDisabled && props.activateOnHover && this.props.activeDate !== null) {
        events.onMouseEnter = this.onDayTextMouseEnter.bind(this, eventParam);
      }

      return (0, _objectAssign2.default)(result, minMaxProps, rangeProps, events, {
        children: _react2.default.createElement(
          'div',
          { className: this.bem('day-text') },
          renderDayProps.day
        ),
        className: (0, _join2.default)([minMaxProps.className, rangeProps.className, prevNextClassName, weekendClassName, timestamp == currentTimestamp ? this.bem('day--value') : null, timestamp == props.activeDate ? this.bem('day--active') : null, className])
      });
    }
  }, {
    key: 'focus',
    value: function focus() {
      (0, _reactDom.findDOMNode)(this).focus();
    }
  }, {
    key: 'onDayTextMouseEnter',
    value: function onDayTextMouseEnter(_ref2) {
      var dateMoment = _ref2.dateMoment;
      var timestamp = _ref2.timestamp;


      if (!this.state.focused) {
        this.focus();
      }

      this.onActiveDateChange({ dateMoment: dateMoment, timestamp: timestamp });
    }
  }, {
    key: 'renderDay',
    value: function renderDay(renderProps) {

      var props = this.p;

      var _renderProps = renderProps;
      var dateMoment = _renderProps.dateMoment;
      var timestamp = _renderProps.timestamp;


      (0, _objectAssign2.default)(renderProps, this.prepareDayProps(renderProps, props));

      if (props.range && props.highlightRangeOnMouseMove) {
        renderProps.onMouseEnter = this.handleDayMouseEnter.bind(this, renderProps);
      }

      if (typeof props.onRenderDay === 'function') {
        renderProps = props.onRenderDay(renderProps);
      }

      var renderFunction = props.renderDay || RENDER_DAY;

      var result = renderFunction(renderProps);

      if (result === undefined) {
        result = RENDER_DAY(renderProps);
      }

      return result;
    }
  }, {
    key: 'render',
    value: function render() {

      var props = this.p = this.prepareProps(this.props);

      return _react2.default.createElement(_BasicMonthView2.default, _extends({
        tabIndex: 0,
        renderChildren: this.renderChildren
      }, props, {

        onKeyDown: this.onViewKeyDown,
        onFocus: this.onFocus,
        onBlur: this.onBlur,

        viewMonthStart: null,
        viewMonthEnd: null,

        minDate: null,
        maxDate: null,

        viewDate: null,
        range: null,

        renderDay: this.renderDay,
        viewMoment: props.viewMoment,
        onMouseLeave: props.highlightRangeOnMouseMove && this.handleViewMouseLeave
      }));
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren(children) {

      var props = this.p;
      var navBar = this.renderNavBar(props);

      if (navBar) {
        children = [navBar, children];
      }

      return children;
    }
  }, {
    key: 'renderNavBar',
    value: function renderNavBar() {
      var _this2 = this;

      var props = this.p;

      var prevDisabled = props.minContrained || props.minDateMoment && props.viewMoment.format('YYYY-MM') == props.minDateMoment.format('YYYY-MM');
      var nextDisabled = props.maxContrained || props.maxDateMoment && props.viewMoment.format('YYYY-MM') == props.maxDateMoment.format('YYYY-MM');

      var childNavBar = _react2.default.Children.toArray(props.children).filter(function (c) {
        return c && c.props && c.props.isDatePickerNavBar;
      })[0];

      if (!childNavBar) {

        if (props.navigation) {
          return _react2.default.createElement(_NavBar2.default, {
            prevDisabled: prevDisabled,
            nextDisabled: nextDisabled,
            secondary: true,
            viewMoment: props.viewMoment,
            onViewDateChange: this.onViewDateChange
          });
        }

        return null;
      }

      var navBarProps = (0, _objectAssign2.default)({}, childNavBar.props, {
        viewMoment: props.viewMoment,
        prevDisabled: prevDisabled,
        nextDisabled: nextDisabled
      });

      var prevOnViewDateChange = navBarProps.onViewDateChange;
      var onViewDateChange = this.onViewDateChange;

      if (prevOnViewDateChange) {
        onViewDateChange = function onViewDateChange() {
          prevOnViewDateChange.apply(undefined, arguments);
          _this2.onViewDateChange.apply(_this2, arguments);
        };
      }

      navBarProps.onViewDateChange = onViewDateChange;

      if (navBarProps) {
        return _react2.default.createElement(_NavBar2.default, navBarProps);
      }
    }
  }, {
    key: 'onFocus',
    value: function onFocus() {
      this.setState({
        focused: true
      });
    }
  }, {
    key: 'onBlur',
    value: function onBlur() {
      this.setState({
        focused: false
      });
    }
  }, {
    key: 'onViewKeyDown',
    value: function onViewKeyDown(event) {
      var key = event.key;

      if (this.props.onKeyDown) {
        this.props.onKeyDown(event);
      }

      if (key == 'Enter' && this.p.activeDate) {
        this.confirm(this.p.activeDate);
      }

      var dir = {
        ArrowUp: -7,
        ArrowDown: 7,
        ArrowLeft: -1,
        ArrowRight: 1
      }[key];

      if (!dir) {
        return;
      }

      this.navigate(dir, event);
    }
  }, {
    key: 'confirm',
    value: function confirm(date) {
      this.goto({ dateMoment: this.toMoment(date) });
    }
  }, {
    key: 'navigate',
    value: function navigate(dir, event) {

      var props = this.p;

      if (props.navigate) {
        return props.navigate(dir, event);
      }

      if (props.activeDate) {

        event.preventDefault();

        var nextMoment = this.toMoment(props.activeDate).add(dir, 'day');

        this.gotoViewDate({ dateMoment: nextMoment });
      }
    }
  }, {
    key: 'handleDayMouseEnter',
    value: function handleDayMouseEnter(dayProps) {
      var range = this.props.range;

      if (range && range.length == 1) {
        var _range2 = _slicedToArray(range, 1);

        var start = _range2[0];


        this.setState({
          range: [start, dayProps.date].sort(function (a, b) {
            return a - b;
          })
        });
      } else if (this.state.range) {
        this.setState({
          range: null
        });
      }
    }
  }, {
    key: 'handleClick',
    value: function handleClick(_ref3, event) {
      var timestamp = _ref3.timestamp;
      var dateMoment = _ref3.dateMoment;

      var props = this.p;

      if (props.minDate && timestamp < props.minDate) {
        return;
      }

      if (props.maxDate && timestamp > props.maxDate) {
        return;
      }

      event.target.value = timestamp;

      this.goto({ dateMoment: dateMoment, timestamp: timestamp }, event);
    }
  }, {
    key: 'goto',
    value: function goto(_ref4, event) {
      var dateMoment = _ref4.dateMoment;
      var timestamp = _ref4.timestamp;


      if (!timestamp) {
        timestamp = +dateMoment;
      }

      this.gotoViewDate({ dateMoment: dateMoment, timestamp: timestamp });

      this.onChange({ dateMoment: dateMoment, timestamp: timestamp }, event);
    }
  }, {
    key: 'format',
    value: function format(moment) {
      return moment.format(this.props.dateFormat);
    }
  }, {
    key: 'onChange',
    value: function onChange(_ref5, event) {
      var dateMoment = _ref5.dateMoment;
      var timestamp = _ref5.timestamp;

      if (this.props.date === undefined) {
        this.setState({
          date: timestamp
        });
      }

      this.props.onChange({ dateMoment: dateMoment, timestamp: timestamp, date: this.format(dateMoment) }, event);
    }
  }, {
    key: 'onViewDateChange',
    value: function onViewDateChange(_ref6) {
      var dateMoment = _ref6.dateMoment;
      var timestamp = _ref6.timestamp;

      if (this.props.viewDate === undefined && this.props.navOnDateClick) {
        this.setState({
          viewDate: timestamp
        });
      }

      this.props.onViewDateChange({ dateMoment: dateMoment, timestamp: timestamp });
    }
  }, {
    key: 'onActiveDateChange',
    value: function onActiveDateChange(_ref7) {
      var dateMoment = _ref7.dateMoment;
      var timestamp = _ref7.timestamp;


      if (!this.isValidActiveDate(timestamp)) {
        return;
      }

      if (this.props.activeDate === undefined) {
        this.setState({
          activeDate: timestamp
        });
      }

      this.props.onActiveDateChange({ dateMoment: dateMoment, timestamp: timestamp });
    }
  }, {
    key: 'gotoViewDate',
    value: function gotoViewDate(_ref8) {
      var dateMoment = _ref8.dateMoment;
      var timestamp = _ref8.timestamp;


      if (!timestamp) {
        timestamp = +dateMoment;
      }

      this.onViewDateChange({ dateMoment: dateMoment, timestamp: timestamp });
      this.onActiveDateChange({ dateMoment: dateMoment, timestamp: timestamp });
    }
  }]);

  return MonthView;
}(_reactClass2.default);

exports.default = MonthView;


MonthView.defaultProps = {
  defaultClassName: 'react-date-picker__month-view',
  dateFormat: 'YYYY-MM-DD',

  onChange: function onChange() {},
  onViewDateChange: function onViewDateChange() {},
  onActiveDateChange: function onActiveDateChange() {},

  activateOnHover: false,
  contrainActiveInView: true,

  showDaysBeforeMonth: true,
  showDaysAfterMonth: true,

  highlightWeekends: true,
  navOnDateClick: true,
  navigation: true,

  constrainViewDate: true
};

MonthView.propTypes = {
  navOnDateClick: _react.PropTypes.bool
};

MonthView.getHeaderText = function (moment, props) {
  return (0, _toMoment2.default)(moment, { locale: props.locale }).format('MMMM YYYY');
};