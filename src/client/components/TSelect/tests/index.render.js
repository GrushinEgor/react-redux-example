import React, { Component } from 'react'
import TSelect from '../'


const selectItems = count => (new Array(count).fill(0)).map((a, b) => ({
  value: b,
  label: `item ${b}`,
}))

class Test extends Component {
  constructor(props) {
    super(props)
    this.state = { value: selectItems(30) }
  }

  render() {
    return (
      <TSelect {...{
        multi: true,
        items: this.state.value,
        showClearButton: true,
        label: 'label',
        maxRows: 8,
        placeHolder: 'Все',
      }}>
        <button onClick={() => console.log('button click')}>Test Button</button>
      </TSelect>
      )
  }
}

export default Test
