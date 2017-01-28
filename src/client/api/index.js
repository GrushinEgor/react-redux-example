import * as actions from './actions'
import * as constants from './constants'
import reducer from './reducers'
import * as selectors from './selectors'
import * as adapters from './adapters'
import { patchApiEntitiesWithDispatch } from './models'


export default { actions, constants, reducer, selectors, adapters, patchApiEntitiesWithDispatch }
