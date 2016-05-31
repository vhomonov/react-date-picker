export default (count) => (count >= 0 ? [...new Array(count)] : []).map((v, i) => i)
