'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactClass = require('react-class');

var _reactClass2 = _interopRequireDefault(_reactClass);

var _onEnter = require('./onEnter');

var _onEnter2 = _interopRequireDefault(_onEnter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DatePickerHeader = function (_Component) {
  _inherits(DatePickerHeader, _Component);

  function DatePickerHeader() {
    _classCallCheck(this, DatePickerHeader);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DatePickerHeader).apply(this, arguments));
  }

  _createClass(DatePickerHeader, [{
    key: 'render',
    value: function render() {

      var props = this.props;

      return _react2.default.createElement(
        'div',
        { className: 'dp-header' },
        _react2.default.createElement(
          'div',
          { className: 'dp-nav-table' },
          _react2.default.createElement(
            'div',
            { className: 'dp-row' },
            _react2.default.createElement(
              'div',
              {
                tabIndex: '1',
                role: 'link',
                className: 'dp-prev-nav dp-nav-cell dp-cell',
                onClick: props.onPrev,
                onKeyUp: (0, _onEnter2.default)(props.onPrev)
              },
              props.prevText
            ),
            _react2.default.createElement(
              'div',
              {
                tabIndex: '1',
                role: 'link',
                className: 'dp-nav-view dp-cell',
                colSpan: props.colspan,
                onClick: props.onChange,
                onKeyUp: (0, _onEnter2.default)(props.onChange)
              },
              props.children
            ),
            _react2.default.createElement(
              'div',
              {
                tabIndex: '1',
                role: 'link',
                className: 'dp-next-nav dp-nav-cell dp-cell',
                onClick: props.onNext,
                onKeyUp: (0, _onEnter2.default)(props.onNext)
              },
              props.nextText
            )
          )
        )
      );
    }
  }]);

  return DatePickerHeader;
}(_reactClass2.default);

exports.default = DatePickerHeader;


DatePickerHeader.propTypes = {
  onChange: _react.PropTypes.func,
  onPrev: _react.PropTypes.func,
  onNext: _react.PropTypes.func,
  colspan: _react.PropTypes.number,
  children: _react.PropTypes.node
};