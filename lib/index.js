'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DatePicker$propTypes;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactClass = require('react-class');

var _reactClass2 = _interopRequireDefault(_reactClass);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _asConfig = require('./utils/asConfig');

var _asConfig2 = _interopRequireDefault(_asConfig);

var _MonthView = require('./MonthView');

var _MonthView2 = _interopRequireDefault(_MonthView);

var _YearView = require('./YearView');

var _YearView2 = _interopRequireDefault(_YearView);

var _DecadeView = require('./DecadeView');

var _DecadeView2 = _interopRequireDefault(_DecadeView);

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

var _toMoment = require('./toMoment');

var _toMoment2 = _interopRequireDefault(_toMoment);

var _onEnter = require('./onEnter');

var _onEnter2 = _interopRequireDefault(_onEnter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var hasOwn = function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

var Views = {
  month: _MonthView2.default,
  year: _YearView2.default,
  decade: _DecadeView2.default
};

var emptyFn = function emptyFn() {};

var DatePicker = function (_Component) {
  _inherits(DatePicker, _Component);

  function DatePicker(props) {
    _classCallCheck(this, DatePicker);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DatePicker).call(this, props));

    _this.state = {
      view: _this.props.defaultView,
      viewDate: _this.props.defaultViewDate,
      defaultDate: _this.props.defaultDate,
      defaultRange: _this.props.defaultRange
    };
    return _this;
  }

  _createClass(DatePicker, [{
    key: 'getViewOrder',
    value: function getViewOrder() {
      return this.props.viewOrder || ['month', 'year', 'decade'];
    }
  }, {
    key: 'getViewName',
    value: function getViewName() {
      var view = this.props.view != null ? this.props.view : this.state.view;

      return view || 'month';
    }
  }, {
    key: 'addViewIndex',
    value: function addViewIndex(amount) {
      var viewName = this.getViewName();

      var order = this.getViewOrder();
      var index = order.indexOf(viewName);

      index += amount;

      return index % order.length;
    }
  }, {
    key: 'getNextViewName',
    value: function getNextViewName() {
      return this.getViewOrder()[this.addViewIndex(1)];
    }
  }, {
    key: 'getPrevViewName',
    value: function getPrevViewName() {
      return this.getViewOrder()[this.addViewIndex(-1)];
    }
  }, {
    key: 'getView',
    value: function getView() {
      var views = this.props.views || Views;

      return views[this.getViewName()] || views.month;
    }
  }, {
    key: 'getViewFactory',
    value: function getViewFactory() {
      var view = this.getView();

      if (_react2.default.createFactory && view && view.prototype && typeof view.prototype.render == 'function') {
        view.__factory = view.__factory || _react2.default.createFactory(view);
        view = view.__factory;
      }

      return view;
    }
  }, {
    key: 'getViewDate',
    value: function getViewDate() {
      var date = hasOwn(this.props, 'viewDate') ? this.props.viewDate : this.state.viewDate;

      date = date || this.viewMoment || this.getDate() || new Date();

      if (_moment2.default.isMoment(date)) {
        //in order to strip the locale - the date picker may have had its locale changed
        //between two render calls. If we don't strip this, moment(mom) returns a new moment
        //with the locale of mom, which is not what we want
        date = +date;
      }

      date = this.toMoment(date);

      return date;
    }
  }, {
    key: 'getDate',
    value: function getDate() {
      var date = hasOwn(this.props, 'date') ? this.props.date : this.state.defaultDate;

      return date ? this.toMoment(date) : null;
    }
  }, {
    key: 'getRange',
    value: function getRange() {
      var _this2 = this;

      var range = void 0;

      if (hasOwn(this.props, 'range')) {
        range = this.props.range;
      } else if (this.state.defaultRange) {
        range = this.state.defaultRange;
      }
      if (range) {
        return range.map(function (r) {
          return r ? _this2.toMoment(r) : null;
        }) || null;
      } else {
        return null;
      }
    }
  }, {
    key: 'render',
    value: function render() {

      var props = this.p = (0, _objectAssign2.default)({}, this.props);

      this.toMoment = function (value, dateFormat) {
        return (0, _toMoment2.default)(value, dateFormat || props.dateFormat, { locale: props.locale });
      };

      var view = this.getViewFactory();

      props.date = this.getDate();
      props.range = this.getRange();

      var dateString = props.date == null ? '' : props.date.format(this.props.dateFormat);

      props.viewDate = this.viewMoment = this.getViewDate();
      props.locale = this.props.locale;
      props.localeData = _moment2.default.localeData(props.locale);

      props.renderDay = this.props.renderDay;
      props.onRenderDay = this.props.onRenderDay;

      var className = (this.props.className || '') + ' date-picker react-date-picker';

      props.style = this.prepareStyle(props);

      var viewProps = (0, _asConfig2.default)(props);

      viewProps.toMoment = this.toMoment;
      viewProps.highlightWeekends = this.props.highlightWeekends;
      viewProps.weekNumbers = this.props.weekNumbers;
      viewProps.weekNumberName = this.props.weekNumberName;
      viewProps.dateString = dateString;
      viewProps.localeData = props.localeData;
      viewProps.onSelect = this.handleSelect;
      viewProps.onChange = this.handleChange;
      viewProps.onWeekChange = this.props.onWeekChange;
      viewProps.renderWeekNumber = this.props.renderWeekNumber;

      viewProps.highlightRangeOnMouseMove = this.props.highlightRangeOnMouseMove;
      viewProps.range = props.range;

      return _react2.default.createElement(
        'div',
        _extends({}, this.props, { className: className, style: props.style }),
        this.renderHeader(view, props),
        _react2.default.createElement(
          'div',
          { className: 'dp-body', style: { flex: 1 } },
          view(viewProps)
        ),
        this.renderFooter(props)
      );
    }
  }, {
    key: 'prepareStyle',
    value: function prepareStyle(props) {
      return (0, _objectAssign2.default)({}, props.defaultStyle, props.style);
    }
  }, {
    key: 'renderFooter',
    value: function renderFooter(props) {
      if (this.props.hideFooter) {
        return;
      }

      if (this.props.today) {
        console.warn('Please use "todayText" prop instead of "today"!');
      }
      if (this.props.gotoSelected) {
        console.warn('Please use "gotoSelectedText" prop instead of "gotoSelected"!');
      }

      var todayText = this.props.todayText || 'Today';
      var gotoSelectedText = this.props.gotoSelectedText || 'Go to selected';

      var footerProps = {
        todayText: todayText,
        gotoSelectedText: gotoSelectedText,
        gotoToday: this.gotoNow,
        gotoSelected: this.gotoSelected.bind(this, props),
        date: props.date,
        viewDate: props.viewDate
      };

      var result = void 0;

      if (typeof this.props.footerFactory == 'function') {
        result = this.props.footerFactory(footerProps);
      }

      if (result !== undefined) {
        return result;
      }

      return _react2.default.createElement(
        'div',
        { className: 'dp-footer' },
        _react2.default.createElement(
          'div',
          {
            tabIndex: '1',
            role: 'link',
            className: 'dp-footer-today',
            onClick: footerProps.gotoToday,
            onKeyUp: (0, _onEnter2.default)(footerProps.gotoToday)
          },
          todayText
        ),
        _react2.default.createElement(
          'div',
          {
            tabIndex: '1',
            role: 'link',
            className: 'dp-footer-selected',
            onClick: footerProps.gotoSelected,
            onKeyUp: (0, _onEnter2.default)(footerProps.gotoSelected)
          },
          gotoSelectedText
        )
      );
    }
  }, {
    key: 'gotoNow',
    value: function gotoNow() {
      this.gotoDate(+new Date());
    }
  }, {
    key: 'gotoSelected',
    value: function gotoSelected(props) {
      this.gotoDate(props.date || +new Date());
    }
  }, {
    key: 'gotoDate',
    value: function gotoDate(value) {
      this.setView('month');
      this.setViewDate(value);
    }
  }, {
    key: 'getViewColspan',
    value: function getViewColspan() {
      var map = {
        month: 5,
        year: 2,
        decade: 2
      };

      return map[this.getViewName()];
    }
  }, {
    key: 'renderHeader',
    value: function renderHeader(view, props) {

      if (this.props.hideHeader) {
        return;
      }

      props = props || this.props;

      var viewDate = this.getViewDate();
      var headerText = this.getView().getHeaderText(viewDate, props);

      var colspan = this.getViewColspan();
      var prev = this.props.navPrev;
      var next = this.props.navNext;

      return _react2.default.createElement(
        _Header2.default,
        {
          prevText: prev,
          nextText: next,
          colspan: colspan,
          onPrev: this.handleNavPrev,
          onNext: this.handleNavNext,
          onChange: this.handleViewChange
        },
        headerText
      );
    }
  }, {
    key: 'handleRenderDay',
    value: function handleRenderDay(date) {
      return (this.props.renderDay || emptyFn)(date) || [];
    }
  }, {
    key: 'handleViewChange',
    value: function handleViewChange() {
      this.setView(this.getNextViewName());
    }

    /**
     * Use this method to set the view.
     *
     * @param {String} view 'month'/'year'/'decade'
     *
     * It calls onViewChange, and if the view is uncontrolled, also sets it is state,
     * so the datepicker gets re-rendered view the new view
     *
     */

  }, {
    key: 'setView',
    value: function setView(view) {

      if (typeof this.props.onViewChange == 'function') {
        this.props.onViewChange(view);
      }

      if (this.props.view == null) {
        this.setState({
          view: view
        });
      }
    }
  }, {
    key: 'setViewDate',
    value: function setViewDate(moment) {

      moment = this.toMoment(moment);

      var fn = this.props.onViewDateChange;

      if (typeof fn == 'function') {

        var text = moment.format(this.props.dateFormat);
        var view = this.getViewName();

        fn(text, moment, view);
      }

      if (!hasOwn(this.props, 'viewDate')) {
        this.setState({
          viewDate: moment
        });
      }
    }
  }, {
    key: 'getNext',
    value: function getNext() {
      var current = this.getViewDate();
      var toMoment = this.toMoment;

      return {
        month: function month() {
          return toMoment(current).add(1, 'month');
        },
        year: function year() {
          return toMoment(current).add(1, 'year');
        },
        decade: function decade() {
          return toMoment(current).add(10, 'year');
        }
      }[this.getViewName()]();
    }
  }, {
    key: 'getPrev',
    value: function getPrev() {
      var current = this.getViewDate();
      var toMoment = this.toMoment;

      return {
        month: function month() {
          return toMoment(current).add(-1, 'month');
        },
        year: function year() {
          return toMoment(current).add(-1, 'year');
        },
        decade: function decade() {
          return toMoment(current).add(-10, 'year');
        }
      }[this.getViewName()]();
    }
  }, {
    key: 'handleNavigation',
    value: function handleNavigation(direction, event) {
      var viewMoment = direction == -1 ? this.getPrev() : this.getNext();

      this.setViewDate(viewMoment);

      if (typeof this.props.onNav === 'function') {
        var text = viewMoment.format(this.props.dateFormat);
        var view = this.getViewName();

        this.props.onNav(text, viewMoment, view, direction, event);
      }
    }
  }, {
    key: 'handleNavPrev',
    value: function handleNavPrev(event) {
      this.handleNavigation(-1, event);
    }
  }, {
    key: 'handleNavNext',
    value: function handleNavNext(event) {
      this.handleNavigation(1, event);
    }
  }, {
    key: 'handleChange',
    value: function handleChange(date, event) {
      if (date.dateMoment && date.timestamp) {
        date = date.dateMoment;
      } else {
        date = this.toMoment(date);
      }

      if (this.props.navOnDateClick) {
        var viewDate = this.toMoment(this.getViewDate());

        //it's not enough to compare months, since the year can change as well
        //
        //also it's ok to hardcode the format here
        var viewMonth = viewDate.format('YYYY-MM');
        var dateMonth = date.format('YYYY-MM');

        if (dateMonth > viewMonth) {
          this.handleNavNext(event);
        } else if (dateMonth < viewMonth) {
          this.handleNavPrev(event);
        }
      }

      var text = date.format(this.props.dateFormat);

      if (!hasOwn(this.props, 'date')) {
        this.setState({
          defaultDate: text
        });
      }

      ;(this.props.onChange || emptyFn)(text, date, event);

      if (this.p.range) {
        this.handleRangeChange(date, event);
      }
    }
  }, {
    key: 'handleRangeChange',
    value: function handleRangeChange(mom) {
      var _this3 = this;

      var range = this.p.range;

      if (range.length < 2) {
        range = [].concat(_toConsumableArray(range), [mom]);
      } else {
        range = [mom];
      }

      range.sort(function (a, b) {
        return a - b;
      });

      if (!this.props.range) {
        this.setState({
          defaultRange: range
        });
      }

      var rangeText = range.map(function (date) {
        return date.format(_this3.props.dateFormat);
      });

      this.props.onRangeChange(rangeText, range, event);
    }
  }, {
    key: 'handleSelect',
    value: function handleSelect(date, event) {
      var viewName = this.getViewName();

      var property = {
        decade: 'year',
        year: 'month'
      }[viewName];

      var value = date.get(property);
      var viewMoment = this.toMoment(this.getViewDate()).set(property, value);
      var view = this.getPrevViewName();

      this.setViewDate(viewMoment);

      this.setView(view);

      if (typeof this.props.onSelect === 'function') {
        var text = viewMoment.format(this.props.dateFormat);
        this.props.onSelect(text, viewMoment, view, event);
      }
    }
  }]);

  return DatePicker;
}(_reactClass2.default);

DatePicker.defaultProps = function () {
  var props = (0, _objectAssign2.default)({}, (0, _asConfig2.default)(), {
    highlightWeekends: false,
    weekNumberName: '',
    isDatePicker: true,
    navOnDateClick: true,
    highlightRangeOnMouseMove: true,

    onRangeChange: function onRangeChange() {}
  });

  delete props.viewDate;
  delete props.date;

  return props;
}();

DatePicker.views = Views;

DatePicker.propTypes = (_DatePicker$propTypes = {
  todayText: _react.PropTypes.string,
  gotoSelectedText: _react.PropTypes.string,

  renderFooter: _react.PropTypes.func,
  onChange: _react.PropTypes.func,

  date: _react.PropTypes.any,
  viewDate: _react.PropTypes.any,

  highlightWeekends: _react.PropTypes.bool

}, _defineProperty(_DatePicker$propTypes, 'onChange', _react.PropTypes.func), _defineProperty(_DatePicker$propTypes, 'onNav', _react.PropTypes.func), _defineProperty(_DatePicker$propTypes, 'onSelect', _react.PropTypes.func), _defineProperty(_DatePicker$propTypes, 'renderDay', _react.PropTypes.func), _defineProperty(_DatePicker$propTypes, 'onRenderDay', _react.PropTypes.func), _defineProperty(_DatePicker$propTypes, 'defaultView', _react.PropTypes.string), _defineProperty(_DatePicker$propTypes, 'view', _react.PropTypes.string), _defineProperty(_DatePicker$propTypes, 'onViewDateChange', _react.PropTypes.func), _defineProperty(_DatePicker$propTypes, 'onViewChange', _react.PropTypes.func), _defineProperty(_DatePicker$propTypes, 'navOnDateClick', _react.PropTypes.bool), _defineProperty(_DatePicker$propTypes, 'highlightRangeOnMouseMove', _react.PropTypes.bool), _DatePicker$propTypes);

exports.default = DatePicker;


module.exports = DatePicker;