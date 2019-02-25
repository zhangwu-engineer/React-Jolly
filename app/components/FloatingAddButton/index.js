// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import { history } from 'components/ConnectedRouter';

const styles = theme => ({
  root: {
    position: 'fixed',
    right: 'calc(50% - 400px)',
    bottom: 100,
    backgroundColor: '#01874b',
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: '#01874b',
    },
    [theme.breakpoints.down('xs')]: {
      right: 20,
      bottom: 50,
    },
  },
});

type Props = {
  classes: Object,
};

class FloatingAddButton extends Component<Props> {
  handleClick = () => {
    history.push('/add');
  };
  render() {
    const { classes } = this.props;
    return (
      <Fab color="inherit" className={classes.root} onClick={this.handleClick}>
        <AddIcon />
      </Fab>
    );
  }
}

export default withStyles(styles)(FloatingAddButton);
