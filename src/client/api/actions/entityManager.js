import * as selectors from '../selectors'
import {
  ACTIONS_TYPES,
  MODELS_TYPES,
  MODELS_OBJECTS,
  DEFAULT_PAGE_SIZE,
} from '../constants'
import * as apiGeneralActions from './general'


const globalActions = {
  updateData: (modelType) => (data, page, count, filter, sort) => ({
    type: ACTIONS_TYPES[modelType].updateData,
    data,
    page,
    count,
    filter,
    sort,
  }),

  updateById: (modelType) => (id, data) => ({
    type: ACTIONS_TYPES[modelType].updateById,
    id,
    data,
  }),

  setLoadErrorForId: (modelType) => (id, error) => ({
    type: ACTIONS_TYPES[modelType].setLoadErrorForId,
    id,
    error,
  }),

  loadData: (modelType) => (page = 1, filter = {}, sort = {}) => (dispatch, getState) => {
    const state = getState()
    const currentModel = MODELS_OBJECTS[modelType]

    return dispatch(apiGeneralActions.callGet({
      url: currentModel.endpoint,
      onSuccess: (data) => globalActions.updateData(modelType)(data.items, data.page, data.count, filter, sort),
      query: {
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        ...filter,
        ...sort,
      },
    }))
  },

  loadNextPage: (modelType) => () => (dispatch, getState) => {
    const state = getState()
    const nextPage = selectors.entityManager[modelType].getNextPage(state)
    if (!nextPage) return Promise.resolve()
    const currentFilter = selectors.entityManager[modelType].getCurrentFilter(state)
    const currentSort = selectors.entityManager[modelType].getCurrentSort(state)
    return dispatch(globalActions.loadData(modelType)(nextPage, currentFilter, currentSort))
  },

  loadById: (modelType) => (id) => (dispatch, getState) => {
    const state = getState()
    const currentModel = MODELS_OBJECTS[modelType]
    const urlToLoad = `${currentModel.endpoint}${id}`
    if (selectors.loadsManager.getIsDownloadingUrl(urlToLoad)(state)) return Promise.resolve()

    return dispatch(apiGeneralActions.callGet({
      url: urlToLoad,
      onSuccess: (data) => globalActions.updateById(modelType)(id, data.items),
      onError: globalActions.setLoadErrorForId(modelType)(id, true),
    }))
  },

  deleteById: (modelType) => (id) => (dispatch, getState) => {
    const currentModel = MODELS_OBJECTS[modelType]
    const urlToLoad = `${currentModel.endpoint}${id}`

    return dispatch(apiGeneralActions.callDel({
      url: urlToLoad,
      onSuccess: () => globalActions.updateById(modelType)(id, undefined),
    }))
  },
}

export const getModelsActions = (modelType) => {
  return Object.keys(globalActions).reduce((memo, key) => ({
    ...memo,
    [key]: globalActions[key](modelType),
  }), {})
}

const entityManager = MODELS_TYPES.reduce((memo, modelType) => ({
  ...memo,
  [modelType]: getModelsActions(modelType),
}), {
  ...globalActions,
})

export default entityManager
