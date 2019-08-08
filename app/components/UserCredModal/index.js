// @flow

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { generate } from 'shortid';
import { capitalize } from 'lodash-es';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

import Tooltip from 'components/Tooltip';
import BaseModal from 'components/BaseModal';
import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import CredIcon from 'images/sprite/cred_filled.svg';
import CredJollyIcon from 'images/sprite/cred_jolly.svg';

const styles = theme => ({
  modal: {
    padding: 0,
    width: 581,
    borderRadius: '0px !important',
    top: '96px !important',
    transform: 'translateX(-50%) !important',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      transform: 'none !important',
      top: 'initial !important',
      left: '0px !important',
      bottom: '0px !important',
      height: '100%',
    },
  },
  blueLine: {
    backgroundColor: theme.palette.primary.main,
    height: 10,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  content: {
    position: 'relative',
    padding: 30,
    maxHeight: '100vh',
    overflow: 'scroll',
    [theme.breakpoints.down('xs')]: {
      padding: '30px 20px 20px',
    },
  },
  titleSection: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#464646',
    display: 'flex',
  },
  stats: {
    borderTop: '1px solid #f1f1f1',
    borderBottom: '1px solid #f1f1f1',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 20,
  },
  topStatsWrapper: {
    borderBottom: '1px solid #f1f1f1',
    marginBottom: 30,
    paddingBottom: 8,
  },
  topStats: {
    marginTop: 16,
    marginBottom: 16,
  },
  viewMoreCTA: {
    paddingTop: 5,
    paddingBottom: 14,
  },
  primaryTitle: {
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  avatar: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  nameWrapper: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1e1e24',
  },
  headingTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#6f6f73',
    marginBottom: 18,
  },
  credTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2b2b2b',
    marginLeft: 8,
  },
  cred: {
    fontSize: 14,
    color: '#6f6f73',
    marginLeft: 3,
  },
  desc: {
    fontSize: 16,
    fontWeight: 600,
    color: '#2b2b2b',
    marginBottom: 20,
  },
  createPostButton: {
    borderRadius: 0,
    fontWeight: 700,
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
  closeButton: {
    position: 'absolute',
    padding: 5,
    right: 10,
    top: 10,
  },
  descWrapper: {
    backgroundColor: '#f1f1f1',
    padding: '25px 20px',
    marginTop: 30,
    marginBottom: 30,
  },
  text: {
    fontSize: 13,
    fontWeight: 500,
    color: '#7f7f7f',
    marginBottom: 10,
  },
});

type Props = {
  user: Object,
  topUsers: List<Map>,
  isOpen: boolean,
  classes: Object,
  onCloseModal: Function,
  openPostModal: Function,
};

type State = {
  isMoreOpen: boolean,
};

class UserCredModal extends Component<Props, State> {
  state = {
    isMoreOpen: false,
  };
  onPostClick = () => {
    this.props.onCloseModal();
    this.props.openPostModal();
  };
  onViewMore = () => {
    const { isMoreOpen } = this.state;
    this.setState({ isMoreOpen: !isMoreOpen });
  };
  render() {
    const { user, topUsers, isOpen, classes } = this.props;
    const { isMoreOpen } = this.state;
    return (
      <BaseModal
        className={classes.modal}
        isOpen={isOpen}
        onCloseModal={this.props.onCloseModal}
        shouldCloseOnOverlayClick={false}
      >
        <div className={classes.blueLine} />
        <div className={classes.content}>
          <IconButton
            className={classes.closeButton}
            onClick={this.props.onCloseModal}
          >
            <ClearIcon />
          </IconButton>
          <Grid container className={classes.titleSection}>
            <Typography className={classes.title}>
              <Icon glyph={CredJollyIcon} size={19} />
              <Grid item className={classes.nameWrapper}>
                <Typography className={classes.credTitle}>Cred</Typography>
              </Grid>
            </Typography>
            <Tooltip
              trigger={
                <Typography
                  className={classes.primaryTitle}
                  color="primary"
                  size="large"
                >
                  {`What's cred?`}
                </Typography>
              }
              position="bottom right"
              content="Cred is a measure of how helpful you are to the community.
              Increase your cred by helping others: post gigs and job
              opportunities, answer questions, or comment in the feed. Earn cred
              when people mark your posts as helpful."
              closeOnDocumentClick
            />
          </Grid>
          <Grid container alignItems="center" className={classes.stats}>
            <Grid item>
              <UserAvatar
                src={user.getIn(['profile', 'avatar'])}
                className={classes.avatar}
              />
            </Grid>
            <Grid item className={classes.nameWrapper}>
              <Typography className={classes.name}>You</Typography>
            </Grid>
            <Grid item>
              <Grid container alignItems="center">
                <Grid item>
                  <Icon glyph={CredIcon} />
                </Grid>
                <Grid item>
                  <Typography className={classes.cred}>
                    {user.getIn(['profile', 'cred'])}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Typography className={classes.headingTitle}>
            Most helpful in {user.getIn(['profile', 'location'])}
          </Typography>
          <Grid className={classes.topStatsWrapper}>
            {topUsers &&
              topUsers.toJSON().map((topUser, index) => {
                if (index < 5 || (index > 4 && isMoreOpen))
                  return (
                    <Grid
                      container
                      alignItems="center"
                      className={classes.topStats}
                      key={generate()}
                    >
                      <Grid item>
                        <UserAvatar
                          src={topUser.user.profile.avatar}
                          className={classes.avatar}
                        />
                      </Grid>
                      <Grid item className={classes.nameWrapper}>
                        <Typography className={classes.name}>
                          {`${capitalize(topUser.user.firstName)}
                          ${capitalize(topUser.user.lastName.charAt(0))}.`}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center">
                          <Grid item>
                            <Icon glyph={CredIcon} />
                          </Grid>
                          <Grid item>
                            <Typography className={classes.cred}>
                              {topUser.cred}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                return null;
              })}
            {!isMoreOpen &&
              topUsers &&
              topUsers.size > 5 && (
                <Grid className={classes.viewMoreCTA}>
                  <Typography
                    className={classes.primaryTitle}
                    color="primary"
                    size="large"
                    onClick={this.onViewMore}
                  >
                    View More
                  </Typography>
                </Grid>
              )}
          </Grid>
          <Typography className={classes.desc} align="center">
            Build your cred by helping
            <br />
            your community
          </Typography>
          <Grid container justify="center">
            <Grid item>
              <Button
                className={classes.createPostButton}
                variant="outlined"
                color="primary"
                size="large"
                onClick={this.onPostClick}
              >
                Post
              </Button>
            </Grid>
          </Grid>
        </div>
      </BaseModal>
    );
  }
}

export default withStyles(styles)(UserCredModal);
