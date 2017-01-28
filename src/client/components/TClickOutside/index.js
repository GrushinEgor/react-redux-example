import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import { bind, unbind } from 'helpers/events'


const clickEvents = ['mouseup', 'touchend']

class TClickOutside extends Component {
  static propTypes = {
    onClick: React.PropTypes.func,
    children: React.PropTypes.node,
  }

  static defaultProps = {
    onClick: () => {},
  }

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
  }

  componentDidMount() {
    bind(clickEvents, this.handleOutsideClick)
  }

  componentWillUnmount() {
    unbind(clickEvents, this.handleOutsideClick)
  }

  handleOutsideClick(e) {
    if (!findDOMNode(this).contains(e.target)) {
      this.props.onClick()
    }
  }

  render() {
    return this.props.children
  }
}

export default TClickOutside
