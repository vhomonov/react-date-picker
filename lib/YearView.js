'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactClass = require('react-class');

var _reactClass2 = _interopRequireDefault(_reactClass);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _format = require('./utils/format');

var _format2 = _interopRequireDefault(_format);

var _asConfig = require('./utils/asConfig');

var _asConfig2 = _interopRequireDefault(_asConfig);

var _toMoment = require('./toMoment');

var _toMoment2 = _interopRequireDefault(_toMoment);

var _onEnter = require('./onEnter');

var _onEnter2 = _interopRequireDefault(_onEnter);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _isInRange = require('./utils/isInRange');

var _isInRange2 = _interopRequireDefault(_isInRange);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TODAY = void 0;

var emptyFn = function emptyFn() {};

var YearView = function (_Component) {
  _inherits(YearView, _Component);

  function YearView() {
    _classCallCheck(this, YearView);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(YearView).apply(this, arguments));
  }

  _createClass(YearView, [{
    key: 'getMonthsInYear',


    /**
     * Returns all the days in the specified month.
     *
     * @param  {Moment/Date/Number} value
     * @return {Moment[]}
     */
    value: function getMonthsInYear(value) {
      var start = (0, _moment2.default)(value).startOf('year');
      var result = [];

      var i = 0;

      for (; i < 12; i++) {
        result.push((0, _moment2.default)(start));
        start.add(1, 'month');
      }

      return result;
    }
  }, {
    key: 'render',
    value: function render() {

      TODAY = +(0, _moment2.default)().startOf('day');

      var props = (0, _objectAssign2.default)({}, this.props);

      var viewMoment = props.viewMoment = (0, _moment2.default)(this.props.viewDate);

      if (!this.props.range) {
        props.moment = (0, _moment2.default)(props.date).startOf('month');
      }

      var monthsInView = this.getMonthsInYear(viewMoment);

      return _react2.default.createElement(
        'div',
        { className: 'dp-table dp-year-view' },
        this.renderMonths(props, monthsInView)
      );
    }

    /**
     * Render the given array of days
     * @param  {Moment[]} days
     * @return {React.DOM}
     */

  }, {
    key: 'renderMonths',
    value: function renderMonths(props, days) {
      var _this2 = this;

      var nodes = days.map(function (date) {
        return _this2.renderMonth(props, date);
      });
      var len = days.length;

      var buckets = [];
      var bucketsLen = Math.ceil(len / 4);

      var i = 0;

      for (; i < bucketsLen; i++) {
        buckets.push(nodes.slice(i * 4, (i + 1) * 4));
      }

      return buckets.map(function (bucket, i) {
        return _react2.default.createElement(
          'div',
          { key: "row" + i, className: 'dp-row' },
          bucket
        );
      });
    }
  }, {
    key: 'renderMonth',
    value: function renderMonth(props, date) {
      var monthText = _format2.default.month(date, props.monthFormat);
      var classes = ["dp-cell dp-month"];

      var dateTimestamp = +date;

      if (props.range) {
        var start = date;
        var end = (0, _moment2.default)(start).endOf('month');

        var _props$range = _slicedToArray(props.range, 2);

        var rangeStart = _props$range[0];
        var rangeEnd = _props$range[1];


        if ((0, _isInRange2.default)(start, props.range) || (0, _isInRange2.default)(end, props.range) || rangeStart && (0, _isInRange2.default)(rangeStart, [start, end]) || rangeEnd && (0, _isInRange2.default)(rangeEnd, [start, end])) {
          classes.push('dp-in-range');
        }
      }

      if (dateTimestamp == props.moment) {
        classes.push('dp-value');
      }

      var onClick = this.handleClick.bind(this, props, date);

      return _react2.default.createElement(
        'div',
        {
          tabIndex: '1',
          role: 'link',
          key: monthText,
          className: classes.join(' '),
          onClick: onClick,
          onKeyUp: (0, _onEnter2.default)(onClick)
        },
        monthText
      );
    }
  }, {
    key: 'handleClick',
    value: function handleClick(props, date, event) {
      event.target.value = date;(props.onSelect || emptyFn)(date, event);
    }
  }]);

  return YearView;
}(_reactClass2.default);

exports.default = YearView;


YearView.defaultProps = (0, _asConfig2.default)();

YearView.getHeaderText = function (moment, props) {
  return (0, _toMoment2.default)(moment, null, { locale: props.locale }).format('YYYY');
};