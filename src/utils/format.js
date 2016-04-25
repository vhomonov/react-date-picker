import CONFIG from '../config'
import toMoment from '../toMoment'

const f = (mom, format) => toMoment(mom).format(format)

export default {

  day(mom, format) {
    return f(mom, format || CONFIG.dayFormat)
  },

  month(mom, format) {
    return f(mom, format || CONFIG.monthFormat)
  },

  year(mom, format) {
    return f(mom, format || CONFIG.yearFormat)
  }
}
