// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import { groupBy, toPairs, fromPairs, zip } from 'lodash-es';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

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
  },
  count: {
    position: 'absolute',
    textAlign: 'center',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 14,
    color: '#0d0d0d',
    fontWeight: 600,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0d0d0d',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
});

type Props = {
  endorsements: Object,
  classes: Object,
  publicMode?: boolean,
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
  render() {
    const { endorsements, publicMode, classes } = this.props;
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
        <Typography className={classes.title}>
          {`${endorsements ? endorsements.size : 0} Coworker Recommendations`}
        </Typography>
        {endorsements && endorsements.size === 0 ? (
          <React.Fragment>
            {!publicMode && (
              <Grid container justify="center">
                <Grid item>
                  <Button
                    color="primary"
                    classes={{
                      label: classes.buttonLabel,
                    }}
                    onClick={this.openModal}
                  >
                    + Get Endorsed
                  </Button>
                </Grid>
              </Grid>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className={classes.endorsersSection}>
              {groupedEndorsers.map(group => (
                <div key={generate()} className={classes.endorserGroup}>
                  <Typography className={classes.endorseQuality}>
                    {qualityNames[group.quality]}
                  </Typography>
                  <Grid container className={classes.endorseUsers} spacing={8}>
                    {group.users.map(u => (
                      <Grid item key={generate()}>
                        <UserAvatar
                          className={classes.avatar}
                          src={u.from.profile.avatar}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </div>
              ))}
            </div>
          </React.Fragment>
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
