'use strict'

var moment = require('moment')

var DEFAULT_WEEK_START_DAY = moment().startOf('week').format('d') * 1

module.exports = function getWeekDayNames(startDay){

    var names = moment.weekdaysShort()
    var index = startDay || DEFAULT_WEEK_START_DAY

    if (index) {
        while (index > 0){
            names.push(names.shift())
            index--
        }
    }

    return names
}