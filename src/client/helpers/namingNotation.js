export const snakeToCamel = s => s.toLowerCase().replace(/_(.)/g, (match, group) => group.toUpperCase())
const camelToSnake = s => s.replace(/([a-z])([A-Z]+)/g, '$1_$2')
export const camelToLowerSnake = s => camelToSnake(s).toLowerCase()
export const camelToUpperSnake = s => camelToSnake(s).toUpperCase()

const objectToCase = convertingFunc => obj => {
  if (typeof obj !== 'object') return obj
  return Object.keys(obj || []).reduce((memo, key) => {
    const currentObj = obj[key]
    const currentKey = convertingFunc(key)
    if (Array.isArray(currentObj)) {
      return {
        ...memo,
        [currentKey]: currentObj.map(item => objectToCase(convertingFunc)(item)),
      }
    }
    return {
      ...memo,
      [currentKey]: objectToCase(convertingFunc)(currentObj),
    }
  }, {})
}

export const objectToCamel = objectToCase(snakeToCamel)
export const objectToLowerSnake = objectToCase(camelToLowerSnake)
export const objectToUpperSnake = objectToCase(camelToUpperSnake)
