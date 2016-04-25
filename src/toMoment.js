import moment from 'moment'
import CONFIG from './config'

/**
 * This function will be used to convert a date to a moment.
 *
 * It accepts input as sring, date or moment
 *
 * @param  {String/Date/Moment} value
 * @param  {String} [dateFormat] if value is string, it will be parsed to a moment using this format
 * @param  {Object} [config]
 * @param  {Boolean} [config.strict] whether to perform strict parsing on strings
 * @return {Moment}
 */
export default (value, dateFormat, config) => {
  const strict = !!(config && config.strict)
  const locale = config && config.locale

  dateFormat = dateFormat || CONFIG.dateFormat

  if (typeof value == 'string'){
    return moment(value, dateFormat, locale, strict)
  }

  return moment(value == null? new Date(): value, undefined, locale, strict)
}
