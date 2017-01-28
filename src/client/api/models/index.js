import {
  MODELS_TYPES,
  MODELS_OBJECTS,
} from '../constants'
import EntityList from './EntityList'


const apiEntities = MODELS_TYPES.reduce((memo, modelType) => ({
  ...memo,
  [modelType]: new EntityList(modelType),
}), {})

export const patchApiEntitiesWithDispatch = (dispatch) => {
  Object.values(apiEntities).forEach(item => item.setDispatch(dispatch))
}

export default apiEntities
