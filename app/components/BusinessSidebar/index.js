// @flow

import React, { PureComponent, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuList from '@material-ui/core/MenuList';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Collapse from '@material-ui/core/Collapse';

import { history } from 'components/ConnectedRouter';
import Link from 'components/Link';
import UserAvatar from 'components/UserAvatar';

import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';

const styles = theme => ({
  sideTop: {
    width: 291,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 26,
  },
  sideTopColorful: {
    backgroundColor: `#f2f9ff`,
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 20,
    paddingTop: 2,
    backgroundColor: theme.palette.primary.main,
    fontWeight: 600,
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
  unreadStatus: {
    width: 5,
    height: 5,
    backgroundColor: `#ea4545`,
    borderRadius: '50%',
    marginLeft: 10,
  },
});

type Props = {
  business: Object,
  classes: Object,
  colorfulSideTop: Boolean,
  isFromHeader: Boolean,
  onClose: Function,
};

type State = {
  isNested: boolean,
};

class BusinessSidebar extends PureComponent<Props, State> {
  state = {
    isNested: true,
  };

  toggleNestedMenu = () => {
    this.setState(state => ({ isNested: !state.isNested }));
  };
  goToNetworkPage = () => {
    if (this.props.isFromHeader) {
      this.props.onClose();
    }
    history.push('/b/network');
  };
  goToProfilePage = slug => {
    if (this.props.isFromHeader) {
      this.props.onClose();
    }
    history.push(`/b/${slug}`);
  };
  render() {
    const { business, classes, colorfulSideTop } = this.props;
    const { isNested } = this.state;
    return (
      <Fragment>
        <Grid
          container
          alignItems="center"
          className={
            colorfulSideTop
              ? cx(classes.sideTop, classes.sideTopColorful)
              : classes.sideTop
          }
        >
          <Grid item>
            <UserAvatar
              className={classes.avatar}
              content={business && business.name}
            />
          </Grid>
          <Grid item>
            <Typography variant="h6" className={classes.greetings}>
              {business && business.name}
            </Typography>
            <Link
              className={classes.link}
              onClick={() => this.goToProfilePage(business.slug)}
            >
              View Business Profile
            </Link>
          </Grid>
        </Grid>
        <MenuList className={classes.menuList}>
          <MenuItem
            className={classes.menuItem}
            onClick={this.toggleNestedMenu}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.menuItemText }}
              primary="My business network"
            />
          </MenuItem>
          <Collapse in={isNested} timeout="auto" unmountOnExit>
            <MenuItem className={classes.menuItemNoIcon}>
              <ListItemText
                classes={{ primary: classes.menuItemText }}
                primary={
                  <Grid container alignItems="center">
                    <span>Pending (6)</span>
                    <Typography className={classes.unreadStatus} />
                  </Grid>
                }
              />
            </MenuItem>
            <MenuItem className={classes.menuItemNoIcon}>
              <ListItemText
                classes={{ primary: classes.menuItemText }}
                primary="Find Connections"
                onClick={this.goToNetworkPage}
              />
            </MenuItem>
          </Collapse>
          <MenuItem className={classes.menuItem}>
            <ListItemIcon className={classes.menuItemIcon}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.menuItemText }}
              primary="Business settings"
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