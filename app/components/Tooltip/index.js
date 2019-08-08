// @flow

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Popup from 'reactjs-popup';

const styles = () => ({
  root: {
    '& .popup-content': {
      color: 'white',
      background: '#1575d9 !important',
      border: 'none !important',
      boxShadow: 'none !important',
      padding: '19px !important',
      marginTop: 5,
      width: '238px !important',
      fontSize: 16,
      fontWeight: 600,
      '& .popup-arrow': {
        background: '#1575d9 !important',
        border: 'none !important',
        boxShadow: 'none !important',
      },
    },
  },
});

type Props = {
  classes: Object,
  trigger: string,
  position: string,
  content: string,
};

class Tooltip extends Component<Props> {
  render() {
    const { classes, trigger, position, content } = this.props;
    return (
      <Grid className={classes.root}>
        <Popup trigger={trigger} position={position} closeOnDocumentClick>
          <div>{content}</div>
        </Popup>
      </Grid>
    );
  }
}

export default withStyles(styles)(Tooltip);
