'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var KEYS = Object.keys(_config2.default);

var copyList = function copyList(src, target, list) {
  if (src) {
    list.forEach(function (key) {
      target[key] = src[key];
    });
  }

  return target;
};

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

exports.default = function (source, cfg) {

  var keys = cfg ? Object.keys(cfg) : KEYS;

  cfg = cfg || _config2.default;

  if (!source) {
    return (0, _objectAssign2.default)({}, cfg);
  }

  return copyList(source, (0, _objectAssign2.default)({}, cfg), keys);
};