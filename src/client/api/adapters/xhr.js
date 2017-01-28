import { getToken } from 'storage'
import { camelToLowerSnake, objectToCamel } from 'helpers/namingNotation'
import * as actions from '../actions/loadsManager'
import { server } from 'constants'


const allow = [200, 201, 203, 204, 400, 401, 403]

export const apiUrl = '/api/v1.0/'

const checkStatus = api => {
  if (allow.includes(api.status) && api.responseText && api.responseText !== '') {
    return objectToCamel(JSON.parse(api.responseText))
  }
  if (api.status === 404) return null
  return undefined
}

const queryFormat = query => {
  let formatedQuery = ''
  Object.entries(query).forEach(([key, val]) => {
    const snakeKey = camelToLowerSnake(key)
    if (Array.isArray(val)) {
      val.forEach(v => (formatedQuery += `&${snakeKey}=${v}`))
    } else {
      formatedQuery += `&${snakeKey}=${val}`
    }
  })
  return formatedQuery.slice(1)
}

const call = dispatch => (baseUrl, method, config = {}) => {
  return new Promise((res, rej) => {
    const api = new XMLHttpRequest()
    const token = getToken()
    if (!token) {
      rej({ status: 401 })
      return
    }
    let url = baseUrl
    if (config.query) {
      url += `?${queryFormat(config.query)}`
    }
    const slash = url.endsWith('/') || url.includes('?') ? '' : '/'

    api.open(method, `${server}${apiUrl}${url}${slash}`)
    if (token) {
      api.setRequestHeader('Authorization', `Token ${token}`)
    }

    let form
    if (config.data) {
      const dataArr = Object.entries(config.data)
      const checkFile = dataArr.some(val => val[1] instanceof File)
      if (checkFile) {
        form = new FormData()
        dataArr.forEach(([key, val]) => {
          form.append(key, val)
        })
      } else {
        form = JSON.stringify(config.data)
        api.setRequestHeader('Content-type', 'application/json; charset=utf-8')
      }
    }
    api.upload.onprogress = (e) => {
      const progress = (e.loaded / e.total) * 100
      dispatch(actions.setLoadingProgress(progress))
    }
    const addLoadAct = method === 'GET' ? actions.addDownload : actions.addUpload
    const removeLoadAct = method === 'GET' ? actions.removeDownload : actions.removeUpload
    api.onloadstart = () => dispatch(addLoadAct(baseUrl))
    api.onload = () => {
      dispatch(removeLoadAct(baseUrl))
      res({
        status: api.status,
        data: checkStatus(api),
      })
    }
    api.onerror = (e) => {
      dispatch(removeLoadAct(baseUrl))
      console.log('ERROR', e)
      dispatch(actions.setLoadingError(e.error))
      rej({
        status: api.status,
        data: JSON.parse(api.responseText || '{}'),
      })
    }
    api.send(form)
  })
}

const post = dispatch => (url, config) => call(dispatch)(url, 'POST', config)
const put = dispatch => (url, config) => call(dispatch)(url, 'PUT', config)
const patch = dispatch => (url, config) => call(dispatch)(url, 'PATCH', config)
const get = dispatch => (url, config) => call(dispatch)(url, 'GET', config)
const del = dispatch => (url, config) => call(dispatch)(url, 'DELETE', config)

const xhr = {
  call,
  post,
  put,
  patch,
  get,
  del,
}

export default xhr
