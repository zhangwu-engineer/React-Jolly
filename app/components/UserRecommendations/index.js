// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import { groupBy, toPairs, fromPairs, zip, capitalize } from 'lodash-es';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import cx from 'classnames';

import { history } from 'components/ConnectedRouter';
import BaseModal from 'components/BaseModal';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';

import MedalIcon from 'images/sprite/medal.svg';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: '25px 40px',
    marginBottom: 40,
    [theme.breakpoints.down('xs')]: {
      padding: 25,
      borderTop: '1px solid #979797',
      marginBottom: 30,
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
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0074d7',
  },
  modal: {
    padding: 25,
    width: 380,
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100% - 50px)',
      padding: 20,
    },
  },
  modalTitle: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 30,
    textAlign: 'center',
  },
  icon: {
    margin: '0 auto',
  },
  endorserGroup: {
    position: 'relative',
    marginBottom: 30,
  },
  endorseQuality: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0d0d0d',
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    cursor: 'pointer',
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
  emptyText: {
    marginBottom: 20,
    fontSize: 14,
    fontWeight: 500,
    color: '#6f6f73',
    marginTop: 31,
    paddingLeft: 40,
    paddingRight: 40,
  },
  getEndorsedButton: {
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
  emptyCount: {
    color: '#999999',
    '&:hover': {
      color: '#999999',
    },
    fontWeight: 500,
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
  endorsedButton: {
    textTransform: 'none',
    padding: '10px 45px 10px 40px',
    borderRadius: 0,
    fontWeight: 600,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
});

type Props = {
  endorsements: Object,
  classes: Object,
  publicMode?: boolean,
  user: Object,
};

type State = {
  isOpen: boolean,
};

class UserRecommendations extends Component<Props, State> {
  state = {
    isOpen: false,
  };
  closeModal = () => {
    this.setState({ isOpen: false });
  };
  openModal = () => {
    this.setState({ isOpen: true });
  };
  openUrl = url => {
    window.open(url, '_blank');
  };
  render() {
    const { endorsements, user, publicMode, classes } = this.props;
    const { isOpen } = this.state;
    const qualityNames = {
      hardest_worker: 'Hardest Worker',
      most_professional: 'Most Professional',
      best_attitude: 'Best Attitude',
      team_player: 'Team Player',
    };
    const result = toPairs(groupBy(endorsements.toJS(), 'quality'));
    const groupedEndorsers = result.map(currentItem =>
      fromPairs(zip(['quality', 'users'], currentItem))
    );
    return (
      <div className={classes.root}>
        <Grid container justify="space-between" alignItems="baseline">
          <Grid item>
            <Typography inline className={classes.title}>
              Coworker Recommendations ·
            </Typography>
            &nbsp;
            <Typography
              inline
              // eslint-disable-next-line no-undef
              className={cx(classes.count, {
                [classes.emptyCount]: endorsements && endorsements.size === 0,
              })}
            >
              {endorsements ? endorsements.size : 0}
            </Typography>
          </Grid>
          {endorsements &&
            endorsements.size > 0 && (
              <Grid item>
                <Button
                  className={classes.moreButton}
                  variant="outlined"
                  size="large"
                  color="primary"
                  onClick={this.openModal}
                >
                  {!publicMode ? `Get More` : `Endorse`}
                </Button>
              </Grid>
            )}
        </Grid>
        {endorsements && endorsements.size === 0 ? (
          <React.Fragment>
            {publicMode ? (
              <Grid container justify="center">
                <Grid item xs={12}>
                  <Typography className={classes.emptyText} align="center">
                    {`Did you enjoy working with ${capitalize(
                      user.get('firstName')
                    )}?`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    className={classes.endorsedButton}
                    variant="contained"
                    size="large"
                    color="primary"
                    onClick={this.openModal}
                  >
                    {`Endorse ${capitalize(user.get('firstName'))}`}
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Grid container justify="center">
                <Grid item xs={12}>
                  <Typography className={classes.emptyText} align="center">
                    You haven’t been recommended by any coworkers
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    className={classes.getEndorsedButton}
                    variant="outlined"
                    size="large"
                    color="primary"
                    onClick={this.openModal}
                  >
                    Get Endorsed
                  </Button>
                </Grid>
              </Grid>
            )}
          </React.Fragment>
        ) : (
          <div className={classes.endorsersSection}>
            {groupedEndorsers.map(group => (
              <div key={generate()} className={classes.endorserGroup}>
                <Typography className={classes.endorseQuality}>
                  {qualityNames[group.quality]}
                </Typography>
                <Grid container className={classes.endorseUsers} spacing={8}>
                  {group.users.map(u => (
                    <Grid
                      item
                      key={generate()}
                      onClick={() => this.openUrl(`/f/${u.from.slug}`)}
                    >
                      <UserAvatar
                        className={classes.avatar}
                        src={u.from.profile.avatar}
                      />
                    </Grid>
                  ))}
                </Grid>
              </div>
            ))}
            {publicMode && (
              <Grid container justify="center">
                <Grid item>
                  <Typography className={classes.emptyText} align="center">
                    {`Did you enjoy working with ${capitalize(
                      user.get('firstName')
                    )}?`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    className={classes.endorsedButton}
                    variant="contained"
                    size="large"
                    color="primary"
                    onClick={this.openModal}
                  >
                    {`Endorse ${capitalize(user.get('firstName'))}`}
                    {user.get('role') !== 'USER' ? ' Again' : ''}
                  </Button>
                </Grid>
              </Grid>
            )}
          </div>
        )}
        <BaseModal
          className={classes.modal}
          isOpen={isOpen}
          onCloseModal={this.closeModal}
        >
          <Icon
            glyph={MedalIcon}
            width={40}
            height={70}
            className={classes.icon}
          />
          <Typography
            variant="h6"
            component="h1"
            className={classes.modalTitle}
          >
            To Get Endorsements...
          </Typography>
          <Typography component="p" className={classes.modalText}>
            Add an event you worked in the past,
            <br />
            and tag your coworkers—they’ll be able
            <br />
            to endorse you for the role you worked
          </Typography>
          <Grid container justify="space-between">
            <Grid item>
              <Button onClick={this.closeModal}>Back</Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  this.setState({ isOpen: false }, () => {
                    history.push('/add');
                  });
                }}
              >
                Add Experience
              </Button>
            </Grid>
          </Grid>
        </BaseModal>
      </div>
    );
  }
}

export default withStyles(styles)(UserRecommendations);
