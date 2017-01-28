import { combineReducers } from 'redux'

import loadsManager from './loadsManager'
import entityManager from './entityManager'

export default combineReducers({
  loadsManager,
  entityManager,
})
