import React, { Component } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classNames from 'classnames'

import { ICONS_TYPES, ICON_COMPS, LABEL_POSITION_TYPES, ROTATE_TYPES, ROTATE_VALUES } from './constants'

import style from './index.css'


class TIcon extends Component {
  static propTypes = {
    size: React.PropTypes.number,
    type: React.PropTypes.oneOf(Object.keys(ICONS_TYPES)).isRequired,
    rotate: React.PropTypes.oneOfType([
      React.PropTypes.oneOf(Object.values(ROTATE_TYPES)),
      React.PropTypes.number,
    ]),
    label: React.PropTypes.string,
    labelPosition: React.PropTypes.oneOf(Object.keys(LABEL_POSITION_TYPES)),
    className: React.PropTypes.string,
    onClick: React.PropTypes.func,
  }

  static defaultProps = {
    className: '',
    rotate: ROTATE_TYPES.up,
    labelPosition: LABEL_POSITION_TYPES.tooltip,
    onClick: () => {},
  }

  constructor(props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render() {
    const {
      size,
      type,
      className,
      rotate,
      label,
      labelPosition,
      onClick,
    } = this.props

    const inlineStyle = {
      transform: `rotate(${typeof rotate === 'string' ? ROTATE_VALUES[rotate] : rotate}deg)`,
      width: size,
      height: size,
    }
    return (
      <div {...{
        className: classNames(style.root, className),
        onClick,
      }} >
        <div {...{
          className: style.svgWrapper,
          style: inlineStyle,
        }} >
          {React.createElement(ICON_COMPS[type])}
        </div>
        {label &&
          <div {...{
            className: style[labelPosition],
          }}>
            {label}
          </div>
        }
      </div>
    )
  }
}

export default TIcon
