// @flow
import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';

import Icon from 'components/Icon';
import EmptyAvatar from 'images/sprite/empty_avatar.svg';

type Props = {
  className?: string,
  src?: string,
  alt: string,
};

class UserAvatar extends Component<Props> {
  static defaultProps = {
    alt: 'avatar',
  };
  render() {
    const { className, src, alt } = this.props;
    if (src) {
      return <Avatar className={className} src={src} alt={alt} />;
    }
    return <Icon glyph={EmptyAvatar} className={className} />;
  }
}

export default UserAvatar;
