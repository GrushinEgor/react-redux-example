import React, { Component } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classNames from 'classnames'
import { Link } from 'react-router'

import style from './index.css'
import { BUTTON_TYPES, BUTTON_COLORS } from './constants'


class TButton extends Component {
  static propTypes = {
    type: React.PropTypes.oneOf(Object.values(BUTTON_TYPES)),
    color: React.PropTypes.oneOf(Object.values(BUTTON_COLORS)),
    link: React.PropTypes.string,
    label: React.PropTypes.node,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    className: React.PropTypes.string,
  }

  static defaultProps = {
    type: BUTTON_TYPES.fill,
    color: BUTTON_COLORS.blue,
    disabled: false,
    className: '',
    onClick: () => {},
  }

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render() {
    const {
      type,
      color,
      label,
      disabled,
      onClick,
      className,
      link,
    } = this.props

    return (
      <div className={classNames(style.root, className, {
        [style[type]]: !!type,
        [style[color]]: !!color,
        [style.disabled]: disabled,
      })}>
        {!link &&
          <button {...{
            className: style.button,
            disabled,
            onClick,
          }} >
          </button>
        }
        {link &&
          <Link {...{
            to: link,
            className: style.link,
            onClick,
          }} />
        }
        {label}
      </div>
    )
  }
}

export default TButton
