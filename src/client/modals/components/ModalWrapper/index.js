import React, { Component } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classNames from 'classnames'
import Modal from 'react-modal'

import { ICONS_TYPES } from 'components/TIcon/constants'
import TIcon from 'components/TIcon'

import style from './index.css'


class ModalWrapper extends Component {
  static defaultProps = {
    show: true,
    shouldCloseOnOverlayClick: true,
    className: '',
    closeAction: () => {},
  }

  static propTypes = {
    show: React.PropTypes.bool,
    shouldCloseOnOverlayClick: React.PropTypes.bool,
    className: React.PropTypes.string,
    closeAction: React.PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render() {
    const {
      show,
      shouldCloseOnOverlayClick,
      closeAction,
      className,
      children,
    } = this.props

    return (
      <Modal {...{
        isOpen: show,
        onRequestClose: closeAction,
        shouldCloseOnOverlayClick,
        className: classNames(style.root, className),
        overlayClassName: style.overlay,
        contentLabel: 'Modal',
      }} >
        {children}
        {closeAction &&
          <TIcon {...{
            type: ICONS_TYPES.clear,
            className: style.close,
            onClick: closeAction,
          }} />
        }
      </Modal>
    )
  }
}

export default ModalWrapper
