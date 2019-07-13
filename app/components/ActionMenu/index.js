// @flow

import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing.unit * 2,
    zIndex: 1,
  },
});

type Props = {
  data: Object,
  classes: Object,
  handleTrustFreelancerAction: Function,
};

type State = {
  open: boolean,
};

class ActionMenu extends Component<Props, State> {
  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  viewProfile = () => {
    const { data } = this.props;
    this.setState({ open: false }, () => {
      window.open(`/f/${data._original.get('slug')}`, '_blank'); // eslint-disable-line
    });
  };

  render() {
    const { classes, data } = this.props;
    const { open } = this.state;
    const userId = data._original.get('_id'); // eslint-disable-line
    return (
      <div className={classes.root}>
        <div>
          <Button
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={this.handleToggle}
          >
            Actions
          </Button>
          <Popper
            className={classes.paper}
            open={open}
            anchorEl={this.anchorEl}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      <MenuItem onClick={this.viewProfile}>
                        Go To Profile
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      {data._original.get('trusted') ? ( // eslint-disable-line
                        <MenuItem>Trusted Freelancer</MenuItem>
                      ) : (
                        <MenuItem
                          onClick={() =>
                            this.props.handleTrustFreelancerAction(userId)
                          }
                        >
                          Trust Freelancer
                        </MenuItem>
                      )}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ActionMenu);
