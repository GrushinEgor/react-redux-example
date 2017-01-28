import classNames from 'classnames'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import union from 'lodash/union'

import { EMAIL_REGEXP } from 'constants'
import {
  INPUT_TYPES,
  ERROR_TYPES,
  formatToFunctions,
  formatFromFunctions,
  includeForTypes,
  excludeForTypes,
  ROW_HEIGHT,
} from './constants'

import style from './index.css'


class TInput extends Component {
  static propTypes = {
    className: React.PropTypes.string,
    defaultValue: React.PropTypes.string,
    replaceValue: React.PropTypes.string,
    type: React.PropTypes.oneOf(Object.values(INPUT_TYPES)),
    disabled: React.PropTypes.bool,
    errors: React.PropTypes.arrayOf(React.PropTypes.string),
    onChange: React.PropTypes.func,
    onInvalid: React.PropTypes.func,
    onValid: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    placeHolder: React.PropTypes.string,
    tooltip: React.PropTypes.string,
    label: React.PropTypes.string,
    include: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.string),
      React.PropTypes.instanceOf(RegExp),
    ]),
    exclude: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.string),
      React.PropTypes.instanceOf(RegExp),
    ]),
    validate: React.PropTypes.shape({
      checkOnBlur: React.PropTypes.bool,
      required: React.PropTypes.bool,
      maxLen: React.PropTypes.number,
      minLen: React.PropTypes.number,
      format: React.PropTypes.oneOfType([
        React.PropTypes.instanceOf(RegExp),
        React.PropTypes.shape({
          regexp: React.PropTypes.instanceOf(RegExp),
          error: React.PropTypes.string,
        }),
      ]),
    }),

    // Only for multi
    minRows: React.PropTypes.number,
    maxRows: React.PropTypes.number,
  }

  static defaultProps = {
    className: '',
    defaultValue: '',
    type: 'text',
    disabled: false,
    errors: [],
    onChange: () => {},
    onInvalid: () => {},
    onValid: () => {},
    onBlur: () => {},
    onKeyDown: () => {},
    placeHolder: '',
    validate: {},
    minRows: 1,
  }

  constructor(props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this.handleChange = this.handleChange.bind(this)
    this.handleHeightChange = this.handleHeightChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.defineValidate = this.defineValidate.bind(this)
    this.defineFormat = this.defineFormat.bind(this)
    this.defineIncludeAndExclude = this.defineIncludeAndExclude.bind(this)
    this.validate = this.validate.bind(this)
    this.setValue = this.setValue.bind(this)
    this.onValueUpdate = this.onValueUpdate.bind(this)
    this.onValidationUpdate = this.onValidationUpdate.bind(this)

    this.defineValidate()
    this.defineFormat()
    this.defineIncludeAndExclude()

    this.state = {
      innerErrors: [],
      value: '',
      wasBlured: false,
      height: this.props.minRows * ROW_HEIGHT,
    }
  }

  componentDidMount() {
    this.setValue(this.props.defaultValue) // For validation
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      height: Math.max(nextProps.minRows * ROW_HEIGHT, this.state.height),
    })
    if (nextProps.replaceValue && nextProps.replaceValue !== this.getValue()) {
      this.setValue(nextProps.replaceValue)
    }
  }

  onValidationUpdate() {
    const { innerErrors } = this.state
    if (innerErrors.length) {
      this.props.onInvalid(innerErrors)
    } else {
      this.props.onValid()
    }
  }

  onValueUpdate(newCaretPosition) {
    if (newCaretPosition) this.refs.input.setSelectionRange(newCaretPosition, newCaretPosition)
    this.onValidationUpdate()
  }

  setValue(value, caretPosition) {
    const innerErrors = this.validate(value)
    const formatted = this.formatTo(value)
    let newCaretPosition
    if (caretPosition && this.state.value !== formatted) {
      const diff = this.state.value.length - formatted.length
      let additionDiff = 0
      if (diff !== 0) {
        additionDiff = diff > 0 ? 1 : -1
      }
      newCaretPosition = caretPosition - diff + additionDiff
    }
    this.setState({
      value: formatted,
      innerErrors,
    }, () => this.onValueUpdate(newCaretPosition))
  }

  getValue() {
    return this.formatFrom(this.state.value)
  }

  getErrors() {
    const { errors } = this.props
    const { innerErrors } = this.state
    return errors ? innerErrors.concat(errors) : innerErrors
  }

  defineValidate() {
    const defaultValidate = {
      format: this.props.type !== INPUT_TYPES.email ? undefined : {
        regexp: EMAIL_REGEXP,
        error: ERROR_TYPES.email,
      },
      maxLen: this.props.validate.maxLen,
      minLen: this.props.validate.minLen,
      required: this.props.validate.required,
    }
    if (this.props.validate.format) {
      defaultValidate.format = this.props.validate.format
    }

    this.validateObj = defaultValidate
  }

  defineFormat() {
    this.formatTo = formatToFunctions[this.props.type] || (val => val)
    this.formatFrom = formatFromFunctions[this.props.type] || (val => val)
  }

  defineIncludeAndExclude() {
    this.include = includeForTypes[this.props.type] || this.props.include
    this.exclude = excludeForTypes[this.props.type] || this.props.exclude
  }

  validate(value) {
    const errors = []

    // Required validation, overrides all other errors
    if (this.props.validate.required && /^\s*$/.test(value)) {
      errors.push(ERROR_TYPES.required)
      return errors
    }

    // RegExp validation
    const regexpToMatch = this.validateObj.format ?
      this.validateObj.format.regexp || this.validateObj.format :
      undefined
    if (regexpToMatch && !regexpToMatch.test(value)) {
      errors.push(this.validateObj.format.error || ERROR_TYPES.format)
    }

    const templateLen = '${number}'
    const {
      maxLen,
      minLen,
    } = this.props.validate
    // MaxLen validation
    if (maxLen && value.length > maxLen) {
      errors.push(ERROR_TYPES.maxLen.replace(templateLen, maxLen))
    }

    // MinLen validation
    if (minLen && value.length < minLen) {
      errors.push(ERROR_TYPES.minLen.replace(templateLen, minLen))
    }

    return errors
  }

  handleKeyPress(e) {
    let shouldPreventDefault = false
    if (this.props.type === INPUT_TYPES.money) {
      shouldPreventDefault = (e.key === '.' || e.key === ',') && this.state.value.includes(',')
    }
    if (this.exclude && !this.include) {
      shouldPreventDefault = shouldPreventDefault ||
        (Array.isArray(this.exclude) ? this.exclude.includes(e.key) : this.exclude.test(e.key))
    }
    if (this.include) {
      shouldPreventDefault = shouldPreventDefault ||
        (Array.isArray(this.include) ? !this.include.includes(e.key) : !this.include.test(e.key))
    }
    if (shouldPreventDefault) {
      e.preventDefault()
    }
  }

  handleBlur(e) {
    this.setState({
      wasBlured: true,
    }, () => {
      if (this.props.validate.checkOnBlur) {
        const innerErrors = this.validate(this.getValue())
        this.setState({
          innerErrors: union(this.props.errors, innerErrors),
        }, () => this.onValidationUpdate())
      }
    })
    this.props.onBlur(e)
  }

  handleHeightChange(value) {
    const shadow = findDOMNode(this.refs.shadow)
    shadow.value = value
    const maxHeight = (this.props.maxRows || this.props.minRows) * ROW_HEIGHT
    const minHeight = this.props.minRows * ROW_HEIGHT
    let newHeight = shadow.scrollHeight

    if (maxHeight >= this.state.height) {
      newHeight = Math.min(maxHeight, newHeight)
    }
    newHeight = Math.max(minHeight, newHeight)

    if (this.state.height !== newHeight) {
      this.setState({
        height: newHeight,
      })
    }
  }

  handleChange(e) {
    let value = this.formatFrom(e.target.value)
    this.props.onChange(value)
    if (this.props.type === INPUT_TYPES.money && (e.target.value.endsWith(',') || e.target.value.endsWith('.'))) {
      value = `${value},`
    }
    if (this.props.type === INPUT_TYPES.multi) {
      this.handleHeightChange(value)
    }
    this.setValue(value, e.target.selectionStart)
  }

  render() {
    const {
      type,
      className,
      disabled,
      placeholder,
      label,
      errors,
    } = this.props

    const {
      value,
      height,
      wasBlured,
    } = this.state

    this.defineValidate()
    this.defineFormat()
    this.defineIncludeAndExclude()

    let currentErrors = errors
    if (this.props.validate.checkOnBlur && !wasBlured) {
      currentErrors = []
    }

    return (
      <div className={classNames(
        style.rootWrapper,
        className,
      )}>
        {label &&
          <span className={style.label}>
            {label}
          </span>
        }
        <div className={classNames(
          style.root,
          {
            [style.error]: currentErrors.length > 0,
          },
        )}>
          {type === INPUT_TYPES.phone &&
            <span className={style.phoneCode}>
              +7
            </span>
          }
          {type === INPUT_TYPES.multi &&
            <textarea {...{
              ref: 'shadow',
              className: style.shadow,
              style: {
                lineHeight: `${ROW_HEIGHT}px`,
              },
              value,
              tabIndex: -1,
              readOnly: true,
            }} />
          }
          {type === INPUT_TYPES.multi ?
            <textarea {...{
              ref: 'input',
              className: style.textarea,
              style: {
                lineHeight: `${ROW_HEIGHT}px`,
                height,
              },
              placeholder,
              disabled,
              value,
              onKeyPress: this.handleKeyPress,
              onChange: this.handleChange,
              onKeyDown: this.props.onKeyDown,
              onBlur: this.handleBlur,
            }} />
            :
            <input {...{
              ref: 'input',
              type: type === INPUT_TYPES.password ? 'password' : 'text',
              className: style.input,
              placeholder,
              disabled,
              value,
              onKeyPress: this.handleKeyPress,
              onChange: this.handleChange,
              onKeyDown: this.props.onKeyDown,
              onBlur: this.handleBlur,
            }} />
          }
        </div>
        <div className={style.errors}>
          {currentErrors.map((error, index) => (
            <div className={style.errorText} key={index}>
              {error}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default TInput
