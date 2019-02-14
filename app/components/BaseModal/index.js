// @flow
import React, { Component } from 'react';

import Modal from 'react-modal';
import cx from 'classnames';

import './styles.scss';

type Props = {
  children: React.Node,
  className?: string,
  isOpen: boolean,
  shouldCloseOnOverlayClick?: boolean,
  onCloseModal: Function,
};

class BaseModal extends Component<Props, {}> {
  static defaultProps = {
    shouldCloseOnOverlayClick: true,
  };
  componentWillMount() {
    Modal.setAppElement('#app');
  }
  render() {
    const {
      children,
      isOpen,
      shouldCloseOnOverlayClick,
      className,
    } = this.props;
    return (
      <Modal
        overlayClassName="baseModal__layout"
        className={cx('baseModal__content', className)}
        isOpen={isOpen}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        onRequestClose={() => {
          this.props.onCloseModal();
        }}
      >
        {children}
      </Modal>
    );
  }
}

export default BaseModal;
