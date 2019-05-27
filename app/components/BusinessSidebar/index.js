// @flow

import React, { PureComponent, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { capitalize } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuList from '@material-ui/core/MenuList';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';

import Link from 'components/Link';
import UserAvatar from 'components/UserAvatar';

import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';

const styles = () => ({
  sideTop: {
    width: 291,
    paddingTop: 15,
    paddingLeft: 26,
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 20,
  },
  greetings: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#373737',
  },
  link: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.3px',
    textTransform: 'none',
    textDecoration: 'none',
  },
  menuItem: {
    paddingLeft: 26,
  },
  menuItemIcon: {
    margin: 0,
  },
  menuItemNoIcon: {
    paddingLeft: 66,
  },
  menuItemBottom: {
    position: 'fixed',
    bottom: 0,
    backgroundColor: '#f1f1f1',
    width: 259,
    textAlign: 'center',
    height: 65,
  },
});

type Props = {
  user: Object,
  classes: Object,
};

class BusinessSidebar extends PureComponent<Props> {
  render() {
    const { user, classes } = this.props;
    return (
      <Fragment>
        <Grid container alignItems="center" className={classes.sideTop}>
          <Grid item>
            <UserAvatar
              className={classes.avatar}
              src={user.getIn(['profile', 'avatar'])}
            />
          </Grid>
          <Grid item>
            <Typography variant="h6" className={classes.greetings}>
              {`${capitalize(user.get('firstName'))} 
                ${capitalize(user.get('lastName'))}`}
            </Typography>
            <Link className={classes.link}>View Business Profile</Link>
          </Grid>
        </Grid>
        <MenuList className={classes.menuList}>
          <MenuItem className={classes.menuItem}>
            <ListItemIcon className={classes.menuItemIcon}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.menuItemText }}
              primary="My business network"
            />
          </MenuItem>
          <MenuItem className={classes.menuItemNoIcon}>
            <ListItemText
              classes={{ primary: classes.menuItemText }}
              primary="Pending (6)"
            />
          </MenuItem>
          <MenuItem className={classes.menuItemNoIcon}>
            <ListItemText
              classes={{ primary: classes.menuItemText }}
              primary="My connections"
            />
          </MenuItem>
          <MenuItem className={classes.menuItemNoIcon}>
            <ListItemText
              classes={{ primary: classes.menuItemText }}
              primary="Discover"
            />
          </MenuItem>
          <MenuItem className={classes.menuItem}>
            <ListItemIcon className={classes.menuItemIcon}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.menuItemText }}
              primary="My business network"
            />
          </MenuItem>
        </MenuList>
        <MenuItem className={classes.menuItemBottom}>
          <ListItemText
            classes={{ primary: classes.menuItemText }}
            primary="GET HELP"
          />
        </MenuItem>
      </Fragment>
    );
  }
}

export default withStyles(styles)(BusinessSidebar);
