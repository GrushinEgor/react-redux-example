import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import { routerReducer as routing } from 'react-router-redux'

import app from 'app'
import api from 'api'

import { STATE_REPLACE_ACTION } from 'constants'


export default reduceReducers(
  (state, action) => {
    if (action.type === STATE_REPLACE_ACTION) {
      return {
        routing: state.routing,
        ...action.state,
      }
    }
    return state
  },
  combineReducers({
    routing,
    [app.constants.NAME]: app.reducer,
    [api.constants.NAME]: api.reducer,
  })
)
