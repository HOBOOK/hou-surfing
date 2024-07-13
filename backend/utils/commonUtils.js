


function convertToDotNotation(obj, parent = '', result = {}) {
    for (let [key, value] of Object.entries(obj)) {
        let newKey = parent ? `${parent}.${key}` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          convertToDotNotation(value, newKey, result);
        } else {
          result[newKey] = value;
        }
      }
    return result;
}


module.exports = {
    convertToDotNotation
};