// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  root: {
    backgroundColor: '#14a384',
    paddingTop: 15,
    paddingBottom: 15,
  },
  content: {
    maxWidth: 830,
    margin: '0 auto',
    display: 'flex',
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
          <Typography className={classes.text}>{msg}</Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Notification);
