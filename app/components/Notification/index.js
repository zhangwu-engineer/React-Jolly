// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Icon from 'components/Icon';
import CheckIcon from 'images/sprite/white_checkmark.svg';

const styles = () => ({
  root: {
    backgroundColor: '#14a384',
    padding: '15px 25px',
  },
  content: {
    maxWidth: 1064,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

type Props = {
  msg: string,
  classes: Object,
  close: Function,
};

class Notification extends Component<Props> {
  componentDidMount() {
    this.timerID = setTimeout(() => this.props.close(), 5000);
  }
  componentWillUnmount() {
    clearTimeout(this.timerID);
  }
  render() {
    const { msg, classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <Icon glyph={CheckIcon} className={classes.icon} />
          <Typography className={classes.text}>{msg}</Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Notification);
