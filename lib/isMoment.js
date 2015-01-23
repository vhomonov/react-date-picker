'use strict';

var moment = require('moment')

module.exports = function(value){
    return moment.isMoment(value)
}