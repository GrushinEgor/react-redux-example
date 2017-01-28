import 'babel-polyfill'
import 'styles/reset.css'
import 'styles/fonts.css'
import 'styles/global.css'

import React from 'react'
import ReactDOM from 'react-dom'

import { syncHistoryWithStore } from 'react-router-redux'
import { browserHistory } from 'react-router'
import { AppContainer } from 'react-hot-loader'

import store from 'store'
import Root from 'Root'
import { stateKey, readStorage } from 'storage'
import addStorageWriter from 'storeSerializer'
import { STATE_REPLACE_ACTION } from 'constants'


if (!process.env.TEST) {
  const history = syncHistoryWithStore(
    browserHistory,
    store,
  )

  const container = document.getElementById('container')

  addStorageWriter(store.getState)

  ReactDOM.render(
    <AppContainer>
      <Root {...{ store, history }} />
    </AppContainer>,
    container,
  )

  window.addEventListener('storage', e => {
    if (e.key === stateKey) {
      store.dispatch({
        type: STATE_REPLACE_ACTION,
        state: readStorage(),
      })
    }
  })

  if (module.hot) {
    module.hot.accept('Root', () => {
      const NextRoot = require('Root').default
      ReactDOM.render(
        <AppContainer>
          <NextRoot {...{ store, history }} />
        </AppContainer>,
        container,
      )
    })
  }
}
