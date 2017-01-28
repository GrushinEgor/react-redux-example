import { connect } from 'react-redux'

import Test from './components/Test'
import * as commonSelectors from 'selectors'


const test = state => ({
  query: commonSelectors.getQuery(state),
})

export default connect(test)(Test)
