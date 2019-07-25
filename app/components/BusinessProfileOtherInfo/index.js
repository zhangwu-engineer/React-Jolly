// @flow

import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PenIcon from '@material-ui/icons/CreateOutlined';
import OpenIcon from '@material-ui/icons/OpenInNew';

import { history } from 'components/ConnectedRouter';
import isMobile from 'utils/checkMobile';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: '30px 25px 25px 30px',
    [theme.breakpoints.down('xs')]: {
      padding: '30px 25px',
    },
  },
  title: {
    fontWeight: 'bold',
    color: '#2c2c2c',
  },
  position: {
    marginBottom: 29,
  },
  position2: {
    marginBottom: 80,
  },
  positionHeader: {
    marginBottom: 12,
  },
  contentWrapper: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.5,
    color: '#373737',
  },
  websiteWrapper: {
    marginBottom: 29,
  },
  websiteTitleWrapper: {
    color: theme.palette.primary.main,
    fontWeight: 500,
    cursor: 'pointer',
  },
  editButton: {
    padding: 0,
    marginLeft: 12,
    '&:hover': {
      backgroundColor: 'white',
    },
    '& svg': {
      width: 16,
      height: 16,
      color: theme.palette.primary.main,
      fill: theme.palette.primary.main,
    },
  },
  openButton: {
    padding: 10,
    marginRight: 13,
    backgroundColor: '#f2f9ff',
    '&:hover': {
      backgroundColor: '#f2f9ff',
    },
    '& svg': {
      width: 14,
      height: 14,
      color: theme.palette.primary.main,
      fill: theme.palette.primary.main,
    },
  },
});

type Props = {
  business: Object,
  isPrivate: ?boolean,
  classes: Object,
};

class BusinessProfileOtherInfo extends Component<Props> {
  static defaultProps = {
    isPrivate: true,
  };
  gotoSettingsProfile = () => {
    const profileSettingsUrl = isMobile()
      ? '/b/settings/profile'
      : '/b/settings#profile';
    history.push(profileSettingsUrl);
  };
  openWebsite = () => {
    const { business } = this.props;
    window.open(business.get('website'), '_blank');
  };
  render() {
    const { business, isPrivate, classes } = this.props;
    return (
      <div className={classes.root}>
        {business.get('aboutUs') && (
          <div className={classes.position}>
            <Grid
              container
              alignItems="center"
              className={classes.positionHeader}
            >
              <Grid item>
                <Typography className={classes.title}>About Us</Typography>
              </Grid>
              {isPrivate && (
                <Grid item>
                  <IconButton
                    classes={{ root: classes.editButton }}
                    onClick={this.gotoSettingsProfile}
                  >
                    <PenIcon fontSize="small" className={classes.icon} />
                  </IconButton>
                </Grid>
              )}
            </Grid>
            <Grid className={classes.contentWrapper}>
              {business.get('aboutUs')}
            </Grid>
          </div>
        )}
        {business.get('website') && (
          <Grid
            container
            alignItems="center"
            className={classes.websiteWrapper}
          >
            <Grid item>
              <IconButton
                classes={{ root: classes.openButton }}
                onClick={this.openWebsite}
              >
                <OpenIcon fontSize="small" />
              </IconButton>
            </Grid>
            <Grid item>
              <Fragment>
                <Typography
                  onClick={this.openWebsite}
                  className={classes.websiteTitleWrapper}
                >
                  Website
                </Typography>
              </Fragment>
            </Grid>
          </Grid>
        )}
        {business.get('freelancerPaymentTerms') && (
          <div className={classes.position2}>
            <Grid
              container
              alignItems="center"
              className={classes.positionHeader}
            >
              <Grid item>
                <Typography className={classes.title}>
                  Freelancer Payment Terms
                </Typography>
              </Grid>
              {isPrivate && (
                <Grid item>
                  <IconButton
                    classes={{ root: classes.editButton }}
                    onClick={this.gotoSettingsProfile}
                  >
                    <PenIcon fontSize="small" />
                  </IconButton>
                </Grid>
              )}
            </Grid>
            <Grid className={classes.contentWrapper}>
              {business.get('freelancerPaymentTerms')}
            </Grid>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(BusinessProfileOtherInfo);
