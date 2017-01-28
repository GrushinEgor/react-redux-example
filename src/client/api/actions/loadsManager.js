import { ACTIONS_TYPES } from '../constants'
import * as selectors from '../selectors'


const addLoad = (type, count, url) => ({
  type,
  count: count + 1,
  url,
})

const removeLoad = (type, count, url) => ({
  type,
  count: count - 1 < 0 ? 0 : count - 1,
  url,
})

const manageUpload = changeFunc => (url) => (dispatch, getState) => {
  return dispatch(changeFunc(
    ACTIONS_TYPES.loadsManager.setUploadsCount,
    selectors.loadsManager.getUploadsCount(getState()),
    url,
  ))
}

const manageDownload = changeFunc => (url) => (dispatch, getState) => {
  return dispatch(changeFunc(
    ACTIONS_TYPES.loadsManager.setDownloadsCount,
    selectors.loadsManager.getDownloadsCount(getState()),
    url,
  ))
}

export const addUpload = manageUpload(addLoad)
export const removeUpload = manageUpload(removeLoad)
export const addDownload = manageDownload(addLoad)
export const removeDownload = manageDownload(removeLoad)

export const setLoadingProgress = (progress) => ({
  type: ACTIONS_TYPES.loadsManager.setProgress,
  progress,
})

// TODO: We should handle errors somehow
export const setLoadingError = (error) => ({
  type: ACTIONS_TYPES.loadsManager.error,
  error,
})
