import React, { Component } from 'react'

import style from './index.css'
import { DEFAULT_MAX_ROWS, EMPTY_ITEMS_LABEL } from './constants'

import TClickOutside from 'components/TClickOutside'
import TIcon from 'components/TIcon'
import { ROTATE_TYPES, ICONS_TYPES } from 'components/TIcon/constants'


const valueTypes = React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])

class TSelect extends Component {
  static propTypes = {
    multi: React.PropTypes.bool,
    autoscroll: React.PropTypes.bool,
    items: React.PropTypes.arrayOf(
      React.PropTypes.shape({ value: valueTypes.isRequired, label: React.PropTypes.node })
    ),
    replaceSelectValues: React.PropTypes.arrayOf(valueTypes),
    disabled: React.PropTypes.bool,
    label: React.PropTypes.node,
    placeHolder: React.PropTypes.string,
    defaultValue: valueTypes,
    tooltip: React.PropTypes.string,
    maxRows: React.PropTypes.number,
    showClearButton: React.PropTypes.bool,
    children: React.PropTypes.node,
    className: React.PropTypes.string,
    onChange: React.PropTypes.func,
  }

  static defaultProps = {
    multi: false,
    autoscroll: true,
    items: [],
    replaceSelectValues: [],
    disabled: false,
    maxRows: DEFAULT_MAX_ROWS,
    showClearButton: false,
    className: '',
    onChange: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectValues: this.props.defaultValue ? [this.props.defaultValue] : [],
      maxHeight: 0,
    }
    this.select = this.select.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.clear = this.clear.bind(this)
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.open) {
      const maxHeight = this.refs.options.firstChild.offsetHeight * this.props.maxRows - 1
      if (nextState.maxHeight !== maxHeight) this.setState({ maxHeight })
    }
    if (nextProps.disabled && nextProps.disabled !== this.props.disabled) {
      this.setState({ open: false })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.autoscroll && this.state.open && prevState.open !== this.state.open) {
      const selectValues = this.props.replaceSelectValues.lenght > 0 ?
        this.props.replaceSelectValues : this.state.selectValues
      if (selectValues.length > 0) {
        const firstSelected = this.props.items.find(item => selectValues.some(val => val === item.value))
        if (firstSelected) {
          this.refs[`option${firstSelected.value}`].scrollIntoView()
        }
      }
    }
  }

  select(value) {
    let newSelectValues = []
    if (this.props.multi) {
      newSelectValues = this.state.selectValues.filter(el => el !== value)
      if (newSelectValues.length === this.state.selectValues.length) {
        newSelectValues.push(value)
      }
    } else {
      newSelectValues = [value]
    }
    if (!newSelectValues.length && this.props.defaultValue) newSelectValues.push(this.props.defaultValue)
    this.setState({
      open: this.props.multi, // don't hide list if component in multi mode
      selectValues: newSelectValues,
    }, () => this.props.onChange(this.state.selectValues))
  }

  clear() {
    this.setState({
      open: false,
      selectValues: [],
    }, () => this.props.onChange(this.state.selectValues))
  }

  open() {
    this.setState({
      open: !this.props.disabled && !this.state.open,
    })
  }

  close() {
    this.setState({ open: false })
  }

  render() {
    const {
      multi,
      items,
      replaceSelectValues,
      disabled,
      label,
      placeHolder,
      showClearButton,
      children,
      className,
    } = this.props
    const { open, selectValues, maxHeight } = this.state
    const realSelectedValues = replaceSelectValues.length ? replaceSelectValues : selectValues

    const isSelected = item => (realSelectedValues).some(el => el === item.value)

    const displayValue = values => {
      if (!realSelectedValues.length && placeHolder) return placeHolder
      if (realSelectedValues.length === 1) {
        return (items.find(el => el.value === realSelectedValues[0]).label || realSelectedValues[0])
      }
      return values.length
    }

    return (
      <TClickOutside onClick={this.close}>
        <div className={`${style.root} ${disabled ? style.disabled : ''} ${className}`}>
          <span className={style.content} onClick={this.open}>
            {!!label &&
              <span className={style.label}>
                {label}
              </span>
            }
            <span className={realSelectedValues.length ? style.input : style.placeholder}>
              {displayValue(realSelectedValues)}
            </span>
          </span>
          <span className={style.controls}>
            <TIcon {...{
              type: ICONS_TYPES.arrow,
              rotate: open ? ROTATE_TYPES.down : ROTATE_TYPES.up,
              onClick: this.open,
              className: style.arrow,
            }} />
            {showClearButton && !!realSelectedValues.length &&
              <TIcon {...{
                type: ICONS_TYPES.clear,
                onClick: this.clear,
                className: style.clear,
              }} />
            }
          </span>
          <div className={style.border} />
          <div className={open ? style.optionsContainer : style.optionsContainerHide}>
            <ul className={style.options} ref="options" style={{ maxHeight }}>
              {items.map(item => (
                <li key={item.value} onClick={() => this.select(item.value)} ref={`option${item.value}`}
                  className={isSelected(item) ? style.active : ''}>
                  {multi &&
                    <TIcon {...{
                      type: ICONS_TYPES.confirm,
                      className: style.check,
                    }} />
                  }
                  <span>{item.label || item.value}</span>
                </li>
              ))}
              {!items.length &&
                <li>
                  <span>{EMPTY_ITEMS_LABEL}</span>
                </li>
              }
            </ul>
            {!!children &&
              <div className={style.children}>
                {children}
              </div>
            }
          </div>
        </div>
      </TClickOutside>
    )
  }
}

export default TSelect
