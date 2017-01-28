import * as adapters from '../adapters'


const invokeCallback = (dispatch, callback, res) => {
  switch (typeof callback) {
    case 'function' :
      return dispatch(callback(res.data))
    case 'string':
      return dispatch({
        type: callback,
        data: res.data,
      })
    case 'object':
      return dispatch(callback)
    default:
      return callback
  }
}

export const callApi = method => ({
  url,
  onSuccess,
  onError,
  data,
  query,
}) => (dispatch) => {
  return adapters.xhr[method](dispatch)(url, { data, query })
    .then(res => {
      const resultActionType = res.status >= 300 ? onError : onSuccess
      const callbacks = Array.isArray(resultActionType) ? resultActionType : [resultActionType]
      callbacks.forEach(callback => invokeCallback(dispatch, callback, res))
      return res
    })
}

export const callGet = callApi('get')
export const callPost = callApi('post')
export const callPut = callApi('put')
export const callDel = callApi('del')
