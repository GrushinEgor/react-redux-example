import React, { Component } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classNames from 'classnames'

import { LABEL_POSITION_TYPES } from './constants'
import TIcon from 'components/TIcon'

import style from './tcheckbox.css'

class TCheckbox extends Component {
  static propTypes = {
    className: React.PropTypes.string,
    value: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    error: React.PropTypes.string,
    type: React.PropTypes.oneOf([
      LABEL_POSITION_TYPES.right,
      LABEL_POSITION_TYPES.left,
    ]),
    onChange: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    tooltip: React.PropTypes.string,
    label: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element,
    ]),
  }
  static defaultProps = {
    value: false,
    disabled: false,
    type: LABEL_POSITION_TYPES.right,
    onChange: () => {},
    onBlur: () => {},
  }
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }
  render() {
    const {
      className,
      value,
      disabled,
      error,
      type,
      label,
      onBlur,
      onChange,
    } = this.props
    return (
      <div>
        <label
          className={classNames(
            style.root,
            className,
          )}>
          <input
            type="checkbox"
            className={style.checkBox}
            checked={value}
            onChange={e => onChange(e.target.checked)}
            onBlur={onBlur}
            disabled={disabled}
          />
          <span
            className={classNames(
            style.checkboxCustom,
              {
                [style.checkboxCustomError]: error === '',
              },
            style[type],
          )}>
            {value &&
              <TIcon type="arrow" />
            }
          </span>
          {label &&
            <span className={style.label}>
              {label}
            </span>
          }
          <div className={classNames(
            {
              [style.errorBox]: error,
              [style.errorBoxHidden]: !error,
            }
          )}>
            <span className={style.msg} />
            <span className={style.errorMsg}> {error} </span>
          </div>
        </label>
      </div>
    )
  }
}

export default TCheckbox
