'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _toMoment = require('../toMoment');

var _toMoment2 = _interopRequireDefault(_toMoment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var f = function f(mom, format) {
  return (0, _toMoment2.default)(mom).format(format);
};

exports.default = {
  day: function day(mom, format) {
    return f(mom, format || _config2.default.dayFormat);
  },
  month: function month(mom, format) {
    return f(mom, format || _config2.default.monthFormat);
  },
  year: function year(mom, format) {
    return f(mom, format || _config2.default.yearFormat);
  }
};