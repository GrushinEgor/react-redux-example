import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import App from './components/App'
import * as actions from './actions'

import * as selectors from './selectors'
import * as commonSelectors from 'selectors'


const app = state => ({
  pathname: commonSelectors.getPathname(state),
})

const dispatchProvider = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
})

export default connect(app, dispatchProvider)(App)
