import assign from 'object-assign'
import CONFIG from '../config'

const KEYS = Object.keys(CONFIG)

const copyList = (src, target, list) => {
  if (src){
    list.forEach(function(key){
      target[key] = src[key]
    })
  }

  return target
}

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
export default (source, cfg) => {

  const keys = cfg? Object.keys(cfg): KEYS

  cfg = cfg || CONFIG

  if (!source){
    return assign({}, cfg)
  }

  return copyList(source, assign({}, cfg), keys)
}
