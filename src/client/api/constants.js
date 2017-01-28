import { makeActionsBundle } from 'helpers/actions'


export const NAME = 'api'

const context = require.context('../', true, /.*\/models\/[A-z0-9-_]*\.model\.js$/)
export const MODELS_OBJECTS = context.keys().reduce((memo, key) => ({
  ...memo,
  [key
    .replace('.model', '')
    .replace(/\.\/|\.js/g, '')
    .split('/')
    .reverse()[0]
  ]: context(key).default,
}), {})

export const MODELS_TYPES = Object.keys(MODELS_OBJECTS)

const actionsTypesLoadsManager = [
  'SET_PROGRESS',
  'SET_UPLOADS_COUNT',
  'SET_DOWNLOADS_COUNT',
  'ERROR',
  'RESET',
]

const actionsTypesEntityManager = [
  'UPDATE_DATA',
  'UPDATE_BY_ID',
  'SET_LOAD_ERROR_FOR_ID',
]

export const ACTIONS_TYPES = MODELS_TYPES.reduce((memo, modelType) => ({
  ...memo,
  [modelType]: makeActionsBundle(NAME, modelType, actionsTypesEntityManager),
}), {
  loadsManager: makeActionsBundle(NAME, 'loadsManager', actionsTypesLoadsManager),
})

export const DEFAULT_PAGE_SIZE = 10
