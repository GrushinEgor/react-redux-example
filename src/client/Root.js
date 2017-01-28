import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'

import app from 'app'


let test = app.components.NotFound
if (process.env.DEV) {
  test = require('test').default.container
}

const Root = ({
  store,
  history,
}) => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route path="/test" component={test} />
        <Route path="/*" component={app.components.NotFound} />
      </Router>
    </Provider>
  )
}

export default Root
