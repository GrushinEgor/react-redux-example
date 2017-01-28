import { combineReducers } from 'redux'
import deepEqual from 'deep-equal'

import {
  ACTIONS_TYPES,
  MODELS_TYPES,
  MODELS_OBJECTS,
} from '../constants'
import { ROUTER_LOCATION_CHANGE_ACTION } from 'constants'


const makeIdObj = obj => ({ [obj.id]: obj })
const hash = items => items.reduce((memo, item) => ({
  ...memo,
  ...makeIdObj(item),
}), {})

const compareConfig = (state, action) => {
  return deepEqual(state.filter, action.filter) && deepEqual(state.sort, action.sort)
}

const init = {
  count: 0,
  singleEntities: {},
  loadErrorEntities: {},
  pages: {},
  filter: {},
  sort: {},
}

const entityManager = MODELS_TYPES.reduce((memo, modelType) => ({
  ...memo,
  [modelType]: (state = init, action) => {
    switch (action.type) {
      case ACTIONS_TYPES[modelType].updateData:
        // We should clear singleEntities if we got them in pages
        const hashedData = hash(action.data)
        const singleIdsToClear = Object.keys(state.singleEntities).reduce((currentObj, item) => {
          if (hashedData[item] === undefined) return currentObj
          return {
            ...currentObj,
            [item]: undefined,
          }
        }, {})
        return {
          ...state,
          count: action.count,
          singleEntities: {
            ...state.singleEntities,
            ...singleIdsToClear,
          },
          pages: {
            ...(compareConfig(state, action) ? state.pages : {}),
            [action.page]: hash(action.data),
          },
          filter: action.filter,
          sort: action.sort,
        }
      case ACTIONS_TYPES[modelType].updateById:
        // Define, if the entity is stored as single, or in pages
        const currentPage = Object.keys(state.pages).find(page => state.pages[page][action.id] !== undefined)
        if (currentPage !== undefined) {
          return {
            ...state,
            singleEntities: {
              ...state.singleEntities,
              [action.id]: undefined,
            },
            pages: {
              ...state.pages,
              [currentPage]: {
                ...state.pages[currentPage],
                [action.id]: action.data,
              },
            },
          }
        }
        return {
          ...state,
          singleEntities: {
            ...state.singleEntities,
            [action.id]: action.data,
          },
        }
      case ACTIONS_TYPES[modelType].setLoadErrorForId:
        return {
          ...state,
          loadErrorEntities: {
            ...state.loadErrorEntities,
            [action.id]: action.error,
          },
        }
      // TODO by @deylak: manage number of pages and entities on route change
      case ROUTER_LOCATION_CHANGE_ACTION:
        return state
      default:
        return state
    }
  },
}), {})

export default combineReducers(entityManager)
