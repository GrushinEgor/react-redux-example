import React from 'react'
import { Link } from 'react-router'

import app from 'app'

import style from './index.css'
const context = require.context('../../../', true, /.*\/tests\/[A-z0-9-_]*\.render\.js$/)


const Test = ({
  query = {},
}) => {
  const component = query.component || ''
  const ext = Object.entries(query)
    .filter(([key]) => key !== 'component')
    .reduce((acc, [key, val]) => ({
      ...acc,
      [key]: val === 'false' ? false : val,
    }), {})

  const folder = component.replace(/\/[a-zA-Z0-9-_.]*$/, '')
  const list = context.keys()
    .filter(file => file.includes(folder))
    .map(file => file.slice(2, -3))

  let Comp
  try {
    Comp = require(`../../../${component}`).default
  } catch (e) {
    Comp = app.components.NotFound
  }

  return (
    <div className={style.root}>
      <div className={style.list}>
        <ul>
          {[''].concat(list).map((li, i) => (
            <li key={i} >
              <Link to={{
                pathname: '/test',
                query: {
                  component: li,
                },
              }} >
                {li === '' ? 'ROOT-TO-SHOW-ALL' : li}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={style.target} >
        <Comp {...ext} />
      </div>
    </div>
  )
}

export default Test
