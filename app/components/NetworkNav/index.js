// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import Link from 'components/Link';
import Icon from 'components/Icon';

import SearchIcon from 'images/sprite/search_white.svg';
import ConnectionIcon from 'images/sprite/connection.svg';
import InviteIcon from 'images/sprite/person_add.svg';

const styles = theme => ({
  root: {
    backgroundColor: '#083f76',
    height: 55,
    textAlign: 'center',
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
  menuItem: {
    position: 'relative',
  },
  activeLine: {
    position: 'absolute',
    width: '100%',
    height: 5,
    backgroundColor: theme.palette.common.white,
    bottom: 0,
    left: 0,
  },
  icon: {
    marginRight: 5,
  },
  link: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    color: theme.palette.common.white,
    fontSize: 14,
    textTransform: 'none',
    '&:hover, &:focus': {
      color: theme.palette.common.white,
    },
  },
});

type Props = {
  location: Object,
  classes: Object,
  isBusinessNetwork: Boolean,
};

class NetworkNav extends Component<Props> {
  render() {
    const {
      location: { pathname },
      classes,
      isBusinessNetwork,
    } = this.props;
    return (
      <Grid container className={classes.root}>
        <Grid item xs={4} className={classes.menuItem}>
          {(isBusinessNetwork && (
            <Link to="/b/network" className={classes.link}>
              <Icon glyph={SearchIcon} size={20} className={classes.icon} />
              Find
            </Link>
          )) || (
            <Link to="/network" className={classes.link}>
              <Icon glyph={SearchIcon} size={20} className={classes.icon} />
              Find
            </Link>
          )}
          {(pathname === '/network' || pathname === '/b/network') && (
            <Divider className={classes.activeLine} />
          )}
        </Grid>
        {!isBusinessNetwork && (
          <Grid item xs={4} className={classes.menuItem}>
            <Link to="/network/coworkers" className={classes.link}>
              <Icon glyph={ConnectionIcon} size={20} className={classes.icon} />
              Connections
            </Link>
            {pathname === '/network/coworkers' && (
              <Divider className={classes.activeLine} />
            )}
          </Grid>
        )}
        {!isBusinessNetwork && (
          <Grid item xs={4} className={classes.menuItem}>
            <Link to="/network/invite" className={classes.link}>
              <Icon glyph={InviteIcon} size={20} className={classes.icon} />
              Invite
            </Link>
            {pathname === '/network/invite' && (
              <Divider className={classes.activeLine} />
            )}
          </Grid>
        )}
      </Grid>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles)
)(NetworkNav);
