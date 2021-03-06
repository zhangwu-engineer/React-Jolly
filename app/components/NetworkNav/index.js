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

    const findLink = isBusinessNetwork ? '/b/network' : '/network';
    const connectionsLink = isBusinessNetwork
      ? '/b/network/connections'
      : '/network/connections';
    const inviteLink = '/network/invite';

    return (
      <Grid container className={classes.root}>
        <Grid item xs={4} className={classes.menuItem}>
          <Link to={`${findLink}`} className={classes.link}>
            <Icon glyph={SearchIcon} size={20} className={classes.icon} />
            Find
          </Link>
          {pathname === findLink && <Divider className={classes.activeLine} />}
        </Grid>
        <Grid item xs={4} className={classes.menuItem}>
          <Link to={`${connectionsLink}`} className={classes.link}>
            <Icon glyph={ConnectionIcon} size={20} className={classes.icon} />
            Connections
          </Link>
          {pathname === connectionsLink && (
            <Divider className={classes.activeLine} />
          )}
        </Grid>
        <Grid item xs={4} className={classes.menuItem}>
          <Link to={`${inviteLink}`} className={classes.link}>
            <Icon glyph={InviteIcon} size={20} className={classes.icon} />
            Invite
          </Link>
          {pathname === inviteLink && (
            <Divider className={classes.activeLine} />
          )}
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles)
)(NetworkNav);
