/* global __webpack_hash__ */
/* eslint-disable camelcase */

export const stateKey = 'example-state'
export const buildKey = 'example-build'
export const tokenKey = 'example-token'

export const clearStorage = () => {
  window.localStorage.removeItem(stateKey)
}

export const writeStorage = getState => {
  const filter = ['routing']
  const filtered = Object.entries(getState())
    .filter(([k]) => !filter.includes(k))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
  const state = JSON.stringify(filtered)
  window.localStorage.setItem(stateKey, state)
}

export const setToken = (token) => {
  window.localStorage.setItem(tokenKey, token)
}

export const getToken = () => {
  return window.localStorage.getItem(tokenKey)
}

export const readStorage = () => {
  let state
  try {
    state = JSON.parse(window.localStorage.getItem(stateKey))
  } catch (err) {
    // saved data is not valid
  }
  if (process.env.PROD) {
    const currentBuildHash = window.localStorage.getItem(buildKey)
    if (currentBuildHash !== __webpack_hash__) {
      clearStorage()
      state = {}
      window.localStorage.setItem(buildKey, __webpack_hash__)
    }
  }
  return state || {}
}
