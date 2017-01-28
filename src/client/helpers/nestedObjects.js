import { isDefAndNotNull } from 'helpers/def'


// Replacing given value in given path in object, path can be just single key, or array of keys
export const getRecursiveObjectReplacement = (obj, name, value) => {
  if (!isDefAndNotNull(obj)) return obj
  if (typeof name === 'string' || name.length === 1) {
    const currentName = typeof name === 'string' ? name : name[0]
    return {
      ...obj,
      [currentName]: value,
    }
  }
  const currentName = name[0]
  if (!Array.isArray(obj)) {
    return {
      ...obj,
      [currentName]: getRecursiveObjectReplacement(obj[currentName], name.slice(1), value),
    }
  }
  const newArray = obj.slice()
  newArray.splice(currentName, 1, getRecursiveObjectReplacement(obj[currentName], name.slice(1), value))
  return newArray
}

export const getNestedObjectField = (obj, name) => {
  if (!obj) return undefined
  if (typeof name === 'string') return obj[name]
  return name.reduce((memo, item) => {
    return memo ? memo[item] : undefined
  }, obj)
}
