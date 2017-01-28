import React, { Component } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classNames from 'classnames'
import Modal from 'react-modal'

import TIcon from 'components/TIcon'
import { ICONS_TYPES } from 'components/TIcon/constants'

import style from './index.css'


class TModal extends Component {
  static defaultProps = {
    show: true,
    shouldCloseOnOverlayClick: true,
    className: '',
    onClose: () => {},
  }

  static propTypes = {
    show: React.PropTypes.bool,
    shouldCloseOnOverlayClick: React.PropTypes.bool,
    className: React.PropTypes.string,
    onClose: React.PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render() {
    const { show, shouldCloseOnOverlayClick, onClose, className, children } = this.props

    return (
      <Modal {...{
        isOpen: show,
        onRequestClose: onClose,
        shouldCloseOnOverlayClick,
        className: classNames(style.root, className),
        overlayClassName: style.overlay,
      }} >
        {children}
        {onClose &&
          <TIcon {...{
            type: ICONS_TYPES.clear,
            className: style.close,
            onClick: onClose,
          }} />
        }
      </Modal>
    )
  }
}

export default TModal
