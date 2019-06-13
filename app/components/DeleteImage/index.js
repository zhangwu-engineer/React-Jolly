// @flow

import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Popper from '@material-ui/core/Popper';

class DeleteImage extends Component<Props, State> {
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
  deleltePhoto = () => {
    this.props.deletePhoto(
      this.props.userId,
      this.props.image,
      this.props.avatar,
      this.props.backgroundImage
    );
  };
  anchorEl: HTMLElement;
  render() {
    const { open } = this.state;
    return (
      <React.Fragment>
        <Button
          buttonRef={node => {
            this.anchorEl = node;
          }}
          style={{ minWidth: 0, padding: 4, color: '#FFFFFF' }}
          onClick={this.handleToggle}
        >
          <MoreVertIcon />
        </Button>
        <Popper
          open={open}
          anchorEl={this.anchorEl}
          transition
          placement="bottom-end"
          style={{ zIndex: 9999 }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper square>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList>
                    <MenuItem
                      onClick={e => {
                        this.handleClose(e);
                        this.deleltePhoto();
                      }}
                    >
                      <ListItemText primary="Delete" />
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>
      </React.Fragment>
    );
  }
}

export default DeleteImage;
