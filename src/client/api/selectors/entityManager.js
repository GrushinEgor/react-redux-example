import { createSelector } from 'reselect'

import {
  ACTIONS_TYPES,
  MODELS_TYPES,
  MODELS_OBJECTS,
  DEFAULT_PAGE_SIZE,
} from '../constants'
import apiEntities from '../models'


const globalSelectors = {
  getPages: (modelType) => (state) => state.api.entityManager[modelType].pages,
  getSingles: (modelType) => (state) => state.api.entityManager[modelType].singleEntities,
  getLoadErrors: (modelType) => (state) => state.api.entityManager[modelType].loadErrorEntities,

  getCurrentCount: (modelType) => (state) => state.api.entityManager[modelType].count,
  getCurrentFilter: (modelType) => (state) => state.api.entityManager[modelType].filter,
  getCurrentSort: (modelType) => (state) => state.api.entityManager[modelType].sort,
  getLastPage: (modelType) => createSelector(
    [globalSelectors.getPages(modelType)],
    (pages) => Object.keys(pages).map(x => +x).sort((a, b) => b - a)[0] || 1,
  ),
  getNextPage: (modelType) => createSelector(
    [
      globalSelectors.getPages(modelType),
      globalSelectors.getLastPage(modelType),
      globalSelectors.getCurrentCount(modelType),
    ],
    (pages, lastPage, count) => {
      return Object.keys(pages).length < count / (lastPage * DEFAULT_PAGE_SIZE) ? lastPage + 1 : undefined
    },
  ),
  getEntities: (modelType) => createSelector(
    [
      globalSelectors.getPages(modelType),
      globalSelectors.getSingles(modelType),
      globalSelectors.getLoadErrors(modelType),
    ],
    (pages, singles, errors) => {
      apiEntities[modelType].setSource(pages, singles, errors)
      return apiEntities[modelType].getArray()
    },
  ),
}

const getModelSelectors = (modelType) => {
  return Object.keys(globalSelectors).reduce((memo, key) => ({
    ...memo,
    [key]: globalSelectors[key](modelType),
  }), {})
}

const entityManager = MODELS_TYPES.reduce((memo, modelType) => ({
  ...memo,
  [modelType]: getModelSelectors(modelType),
}), {})

export default entityManager
