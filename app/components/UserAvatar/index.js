// @flow
import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';

import Icon from 'components/Icon';
import EmptyAvatar from 'images/sprite/empty_avatar.svg';

type Props = {
  className?: string,
  src?: string,
  alt?: string,
  content?: string,
};

class UserAvatar extends Component<Props> {
  static defaultProps = {
    alt: 'avatar',
  };
  letterTruncate(letters) {
    const matches = letters.match(/\b(\w)/g);
    return matches.join('').slice(0, 2);
  }
  render() {
    const { className, src, alt, content } = this.props;
    if (src) {
      return <Avatar className={className} src={src} alt={alt} />;
    } else if (content) {
      return (
        <Avatar className={className}>{this.letterTruncate(content)}</Avatar>
      );
    }
    return <Icon glyph={EmptyAvatar} className={className} />;
  }
}

export default UserAvatar;
