import React from 'react'

import style from './index.css'
import Header from '../Header'


const App = ({
  pathname,
  children,
}) => {
  return (
    <div className={style.root}>
      <Header {...{
        pathname,
      }} />
      {children}
    </div>
  )
}

export default App
