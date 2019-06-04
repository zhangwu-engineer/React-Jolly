// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { generate } from 'shortid';
import { capitalize } from 'lodash-es';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import UserCard from 'components/UserCard';
import Icon from 'components/Icon';
import Link from 'components/Link';
import ConnectIcon from 'images/sprite/connect_white.svg';
import ConnectSentIcon from 'images/sprite/connect_sent.svg';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ListItemText from '@material-ui/core/ListItemText';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import { history } from 'components/ConnectedRouter';
import ConnectIconBlue from 'images/sprite/connect.svg';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: '25px 40px',
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      padding: 25,
      borderTop: '1px solid #979797',
      marginBottom: 0,
    },
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: '#2c2c2c',
    marginBottom: 30,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      fontWeight: 700,
    },
  },
  count: {
    fontSize: 20,
    fontWeight: 600,
    textDecoration: 'none',
    color: theme.palette.primary.main,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
    },
  },
  emptyCount: {
    color: '#999999',
    '&:hover': {
      color: '#999999',
    },
    fontWeight: 500,
  },
  user: {
    marginBottom: 15,
  },
  connectBox: {
    paddingTop: 30,
    paddingBottom: 30,
  },
  desc: {
    fontSize: 20,
    fontWeight: 600,
    color: '#2c2c2c',
    marginBottom: 20,
  },
  connectButton: {
    textTransform: 'none',
    padding: '10px 45px 10px 40px',
    borderRadius: 0,
    fontWeight: 600,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  connectIcon: {
    marginRight: 5,
    position: 'relative',
    top: -1,
  },
  findConnectionsButton: {
    borderRadius: 0,
    fontWeight: 600,
    textTransform: 'none',
    borderWidth: 2,
    borderColor: theme.palette.primary.main,
    paddingLeft: 46,
    paddingRight: 46,
    marginBottom: 25,
    '&:hover': {
      borderWidth: 2,
    },
  },
  emptyText: {
    marginBottom: 20,
    fontSize: 14,
    fontWeight: 500,
    color: '#6f6f73',
    paddingLeft: 20,
    paddingRight: 20,
  },
  moreButton: {
    borderRadius: 0,
    fontWeight: 600,
    textTransform: 'none',
    borderWidth: 2,
    fontSize: 12,
    paddingTop: 6,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 6,
    borderColor: theme.palette.primary.main,
    '&:hover': {
      borderWidth: 2,
    },
  },
  connectSentButton: {
    backgroundColor: '#14a384',
    borderColor: '#14a384',
    borderRadius: 0,
  },
});

type Props = {
  coworkers: Object,
  currentUser: Object,
  user: Object,
  isPrivate: boolean,
  isConnectionSent: boolean,
  classes: Object,
  connect: Function,
};

type State = {
  isMenuOpen: boolean,
};

class UserCoworkers extends Component<Props, State> {
  state = {
    isMenuOpen: false,
  };

  handleToggle = () => {
    const { isConnectionSent } = this.props;
    if (!isConnectionSent) {
      this.setState(state => ({ isMenuOpen: !state.isMenuOpen }));
    }
  };
  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ isMenuOpen: false });
  };
  connect = () => {
    const { currentUser, user } = this.props;
    if (currentUser && currentUser.get('id') !== user.get('id')) {
      this.props.connect(user.get('id'));
    } else {
      history.push('/freelancer-signup');
    }
  };
  openUrl = url => {
    window.open(url, '_blank');
  };
  render() {
    const {
      coworkers,
      user,
      isPrivate,
      isConnectionSent,
      classes,
    } = this.props;
    const coworkersToShow = coworkers && coworkers.slice(0, 6);
    return (
      <div className={classes.root}>
        <Grid container justify="space-between" alignItems="baseline">
          <Grid item>
            <Typography className={classes.title}>
              Coworkers ·&nbsp;
              <Link
                to={isPrivate ? '/network/coworkers' : ''}
                className={cx(classes.count, {
                  [classes.emptyCount]: coworkers && coworkers.size === 0,
                })}
              >
                {coworkers ? coworkers.size : ''}
              </Link>
            </Typography>
          </Grid>
          {coworkers &&
            coworkers.size > 0 && (
              <React.Fragment>
                {isPrivate ? (
                  <Grid item>
                    <Button
                      className={classes.moreButton}
                      variant="outlined"
                      size="large"
                      color="primary"
                      component={props => <Link to="/network" {...props} />}
                    >
                      Find More
                    </Button>
                  </Grid>
                ) : (
                  <Grid item className={classes.connectButtonBox}>
                    <Button
                      onClick={this.handleToggle}
                      buttonRef={node => {
                        this.anchorEl = node;
                      }}
                      className={
                        user.get('role') === 'USER'
                          ? classes.moreButton
                          : (classes.moreButton, classes.connectSentButton)
                      }
                      variant="outlined"
                      size="large"
                      color="primary"
                    >
                      <Icon
                        glyph={
                          user.get('role') === 'USER'
                            ? ConnectIconBlue
                            : ConnectSentIcon
                        }
                        width={23}
                        height={13}
                        className={classes.connectIcon}
                      />
                    </Button>
                    <Popper
                      open={this.state.isMenuOpen}
                      anchorEl={this.anchorEl}
                      transition
                      placement="bottom-end"
                    >
                      {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                          <Paper square classes={{ root: classes.menu }}>
                            <ClickAwayListener onClickAway={this.handleClose}>
                              <MenuList className={classes.menuList}>
                                <MenuItem
                                  className={classes.menuItem}
                                  onClick={e => {
                                    this.handleClose(e);
                                    this.connect();
                                  }}
                                >
                                  <ListItemText
                                    classes={{ primary: classes.menuItemText }}
                                    primary={`I've worked with ${capitalize(
                                      user.get('firstName')
                                    )} before`}
                                  />
                                </MenuItem>
                              </MenuList>
                            </ClickAwayListener>
                          </Paper>
                        </Fade>
                      )}
                    </Popper>
                  </Grid>
                )}
              </React.Fragment>
            )}
        </Grid>
        {coworkers && coworkers.size === 0 ? (
          <React.Fragment>
            {isPrivate ? (
              <Grid container justify="center">
                <Grid item xs={12}>
                  <Typography className={classes.emptyText} align="center">
                    You haven’t connected with any coworkers
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    className={classes.findConnectionsButton}
                    variant="outlined"
                    size="large"
                    color="primary"
                    component={props => <Link to="/network" {...props} />}
                  >
                    Find Connections
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Grid container justify="center">
                <Grid item xs={12}>
                  <Typography className={classes.emptyText} align="center">
                    {`Have you worked with ${capitalize(
                      user.get('firstName')
                    )} before?`}
                  </Typography>
                </Grid>
                <Grid item className={classes.connectButtonBox}>
                  <Button
                    className={cx(classes.connectButton, {
                      [classes.connectionSentButton]: isConnectionSent,
                    })}
                    onClick={this.handleToggle}
                    buttonRef={node => {
                      this.anchorEl = node;
                    }}
                    variant="contained"
                    color="primary"
                  >
                    <Icon
                      glyph={isConnectionSent ? ConnectSentIcon : ConnectIcon}
                      width={23}
                      height={13}
                      className={classes.connectIcon}
                    />
                    {isConnectionSent ? 'Request Sent' : 'Connect'}
                  </Button>
                  <Popper
                    open={this.state.isMenuOpen}
                    anchorEl={this.anchorEl}
                    transition
                    placement="bottom-end"
                  >
                    {({ TransitionProps }) => (
                      <Fade {...TransitionProps} timeout={350}>
                        <Paper square classes={{ root: classes.menu }}>
                          <ClickAwayListener onClickAway={this.handleClose}>
                            <MenuList className={classes.menuList}>
                              <MenuItem
                                className={classes.menuItem}
                                onClick={e => {
                                  this.handleClose(e);
                                  this.connect();
                                }}
                              >
                                <ListItemText
                                  classes={{ primary: classes.menuItemText }}
                                  primary={`I've worked with ${capitalize(
                                    user.get('firstName')
                                  )} before`}
                                />
                              </MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Fade>
                    )}
                  </Popper>
                </Grid>
              </Grid>
            )}
          </React.Fragment>
        ) : (
          <Grid container spacing={8}>
            {coworkersToShow &&
              coworkersToShow.map(coworker => (
                <Grid
                  item
                  key={generate()}
                  xs={12}
                  lg={6}
                  className={classes.user}
                  onClick={() => this.openUrl(`/f/${coworker.get('slug')}`)}
                >
                  <UserCard user={coworker} size="small" />
                </Grid>
              ))}
          </Grid>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(UserCoworkers);
