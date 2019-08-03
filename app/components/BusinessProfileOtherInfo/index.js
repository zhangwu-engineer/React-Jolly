// @flow

import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { lowerCase } from 'lodash-es';
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

function isVowel(x) {
  return /[aeiouAEIOU]/.test(x);
}

function generateAboutUs(business) {
  const name = business.get('name');
  const category = business.get('category');
  const location = business.get('location')
    ? ` based in ${business.get('location')}`
    : ``;
  const theArticle = isVowel(category ? category.substring(0, 1) : '')
    ? 'an'
    : 'a';
  return `${name} is ${theArticle} ${lowerCase(category)} business${location}.`;
}

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
    const aboutUs = business.get('aboutUs')
      ? business.get('aboutUs')
      : generateAboutUs(business);
    const freelancerPaymentTerms = business.get('freelancerPaymentTerms')
      ? business.get('freelancerPaymentTerms')
      : 'Payment terms not disclosed';
    return (
      <div className={classes.root}>
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
          <Grid className={classes.contentWrapper}>{aboutUs}</Grid>
        </div>
        <Grid container alignItems="center" className={classes.websiteWrapper}>
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
              {business.get('website') && (
                <Typography
                  onClick={this.openWebsite}
                  className={classes.websiteTitleWrapper}
                >
                  Website
                </Typography>
              )}
              {!business.get('website') && (
                <Typography
                  onClick={this.gotoSettingsProfile}
                  className={classes.websiteTitleWrapper}
                >
                  Add website
                </Typography>
              )}
            </Fragment>
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
            {freelancerPaymentTerms}
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(BusinessProfileOtherInfo);
