// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import UserAvatar from 'components/UserAvatar';
import UserCredStats from 'components/UserCredStats';
import PostFormModal from 'components/PostFormModal';

const styles = theme => ({
  root: {
    width: 1106,
    margin: '0 auto',
    paddingTop: 25,
    display: 'flex',
  },
  leftPanel: {
    width: 254,
    marginRight: 19,
  },
  content: {
    flex: 1,
  },
  createPostPanel: {
    backgroundColor: theme.palette.common.white,
    padding: '15px 20px 18px 21px',
    boxShadow: '0 10px 15px 5px rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
  },
  createPostAvatar: {
    width: 45,
    height: 45,
    marginRight: 20,
  },
  createPostTitle: {
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 0.3,
    color: '#9f9f9f',
  },
  rightPanel: {
    width: 254,
    marginLeft: 20,
  },
});

type Props = {
  user: Object,
  classes: Object,
};

type State = {
  isOpen: boolean,
};

class FeedPage extends Component<Props, State> {
  state = {
    isOpen: false,
  };
  openModal = () => {
    this.setState({ isOpen: true });
  };
  closeModal = () => {
    this.setState({ isOpen: false });
  };
  render() {
    const { user, classes } = this.props;
    const { isOpen } = this.state;
    return (
      <React.Fragment>
        <div className={classes.root}>
          <div className={classes.leftPanel} />
          <div className={classes.content}>
            <Grid
              container
              alignItems="center"
              className={classes.createPostPanel}
              onClick={this.openModal}
            >
              <Grid item>
                <UserAvatar
                  src={user.getIn(['profile', 'avatar'])}
                  className={classes.createPostAvatar}
                />
              </Grid>
              <Grid item>
                <Typography className={classes.createPostTitle}>
                  Create a post...
                </Typography>
              </Grid>
            </Grid>
          </div>
          <div className={classes.rightPanel}>
            <UserCredStats user={user} onClick={this.openModal} />
          </div>
        </div>
        <PostFormModal
          isOpen={isOpen}
          user={user}
          onCloseModal={this.closeModal}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
});

const mapDispatchToProps = () => ({});
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(FeedPage);
