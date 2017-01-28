import { ACTIONS_TYPES } from '../constants'


export const init = {
  uploadsCount: 0,
  downloadsCount: 0,
  loadingProgress: 0,
  uploadUrls: {},
  downloadUrls: {},
}

const loadsManager = (state = init, action) => {
  switch (action.type) {
    case ACTIONS_TYPES.loadsManager.setUploadsCount:
      return {
        ...state,
        uploadsCount: action.count,
        uploadUrls: {
          ...state.uploadUrls,
          [action.url]: !state.uploadUrls[action.url],
        },
      }
    case ACTIONS_TYPES.loadsManager.setDownloadsCount:
      return {
        ...state,
        downloadsCount: action.count,
        downloadUrls: {
          ...state.downloadUrls,
          [action.url]: !state.downloadUrls[action.url],
        },
      }
    case ACTIONS_TYPES.loadsManager.setProgress:
      return {
        ...state,
        loadingProgress: action.progress,
      }
    case ACTIONS_TYPES.loadsManager.reset:
      return init
    default:
      return state
  }
}

export default loadsManager
