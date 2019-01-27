// @flow

import React, { Component } from 'react';
import storage from 'store';
import { capitalize } from 'lodash-es';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';

import HelpIcon from '@material-ui/icons/HelpOutline';
import CloseIcon from '@material-ui/icons/Clear';

import EndorsementTip from 'components/EndorsementTip';
import EndorsementModal from 'components/EndorsementModal';

const styles = theme => ({
  root: {
    marginBottom: 20,
  },
  coworkerItem: {
    padding: 0,
  },
  avatar: {
    backgroundColor: '#afafaf',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.25,
    letterSpacing: '0.4px',
    color: '#4a4a4a',
  },
  resultDateText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#9b9b9b',
  },
  verifiable: {
    width: 24,
    height: 24,
    border: '2px solid #939393',
    borderRadius: 20,
    marginRight: 16,
  },
  invited: {
    fontSize: 12,
    fontWeight: 600,
    color: '#a7a7a7',
    textTransform: 'capitalize',
  },
  endorseButton: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.4px',
    color: '#0075d8',
    marginLeft: 55,
    padding: 0,
    minHeight: 'auto !important',
  },
  endorsedLabel: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.4px',
    color: '#0075d8',
    marginLeft: 55,
    padding: 0,
  },
  endorsePanel: {
    backgroundColor: '#f3f3f3',
    padding: '20px 10px 15px 35px',
    marginTop: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    color: '#1c1c1c',
  },
  checkLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: '#1c1c1c',
  },
  checkboxChecked: {
    color: theme.palette.common.green,
  },
  checkboxDisabled: {
    color: 'rgba(107, 210, 88, 0.6) !important',
  },
  fullWidth: {
    flex: 1,
  },
  iconButton: {
    backgroundColor: 'transparent',
    padding: 5,
  },
  skipButton: {
    fontSize: 14,
    fontWeight: 600,
    color: '#4a4a4a',
  },
  saveButton: {
    backgroundColor: '#00dcaa',
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: '#00dcaa',
    },
  },
  disabledButton: {
    opacity: 0.3,
    color: '#ffffff !important',
    fontSize: 14,
    fontWeight: 600,
  },
});

type Props = {
  user: Object,
  work: Object,
  type: string,
  role: ?string,
  endorsed: boolean,
  endorsedQuality: string,
  usedQualities: Array<string>,
  classes: Object,
  verifyCoworker: Function,
  requestEndorseUser: Function,
};

type State = {
  isPanelOpen: boolean,
  isTipOpen: boolean,
  isModalOpen: boolean,
  quality: ?string,
};

class User extends Component<Props, State> {
  state = {
    isPanelOpen: false,
    isTipOpen: false,
    isModalOpen: false,
    quality: null,
  };
  handleChange = event => {
    const { quality } = this.state;
    if (quality === event.target.value) {
      this.setState({ quality: null });
    } else {
      this.setState({ quality: event.target.value });
    }
  };
  openTipModal = () => {
    this.setState({ isTipOpen: true });
  };
  closeTipModal = () => {
    this.setState({ isTipOpen: false });
  };
  closeModal = () => {
    this.setState({ isModalOpen: false });
  };
  save = () => {
    const { user, work } = this.props;
    const { quality } = this.state;
    const payload = {
      to: user.get('id'),
      work: work.get('id'),
      work_slug: work.get('slug'),
      quality,
    };
    this.setState({ isPanelOpen: false });
    this.props.requestEndorseUser(payload);
  };
  render() {
    const {
      classes,
      user,
      type,
      role,
      work,
      endorsed,
      endorsedQuality,
      usedQualities,
    } = this.props;
    const { isPanelOpen, isTipOpen, isModalOpen, quality } = this.state;
    const qualityNames = {
      hardest_worker: 'Hardest Worker',
      most_professional: 'Most Professional',
      best_attitude: 'Best Attitude',
      team_player: 'Team Player',
    };
    return (
      <div className={classes.root}>
        <ListItem className={classes.coworkerItem}>
          <Avatar
            alt={`${user.get('firstName')} ${user.get('lastName')}`}
            src={user.getIn(['profile', 'avatar'])}
            className={classes.avatar}
          />
          <ListItemText
            primary={
              user.get('firstName')
                ? `${capitalize(user.get('firstName'))} ${capitalize(
                    user.get('lastName')
                  )}`
                : user.get('email')
            }
            secondary={role}
            classes={{
              primary: classes.resultText,
              secondary: classes.resultDateText,
            }}
          />
          <ListItemSecondaryAction>
            {type === 'verifiable' ? (
              <div
                className={classes.verifiable}
                onClick={() => {
                  const payload = {
                    slug: work.get('slug'),
                    coworker: user.get('id'),
                  };
                  this.props.verifyCoworker(payload, work.get('id'));
                }}
                role="button"
              />
            ) : (
              <ListItemText
                primary={type}
                classes={{
                  primary: classes.invited,
                }}
              />
            )}
          </ListItemSecondaryAction>
        </ListItem>
        {endorsed &&
          endorsedQuality && (
            <Typography className={classes.endorsedLabel}>
              {`You endorsed for ${qualityNames[endorsedQuality]}`}
            </Typography>
          )}
        {type === 'verified' &&
          !endorsed &&
          !isPanelOpen && (
            <Button
              className={classes.endorseButton}
              onClick={() => {
                this.setState({
                  isPanelOpen: true,
                });
              }}
            >
              Endorse
            </Button>
          )}
        {isPanelOpen && (
          <div className={classes.endorsePanel}>
            <Grid container alignItems="center">
              <Grid item className={classes.fullWidth}>
                <Typography
                  variant="h6"
                  className={classes.title}
                >{`Endorse ${user.get('firstName')}`}</Typography>
              </Grid>
              <Grid item>
                <IconButton
                  className={classes.iconButton}
                  onClick={this.openTipModal}
                >
                  <HelpIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  className={classes.iconButton}
                  onClick={() => {
                    this.setState({
                      isPanelOpen: false,
                      quality: null,
                    });
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        quality === 'hardest_worker' ||
                        usedQualities.includes('hardest_worker')
                      }
                      onChange={this.handleChange}
                      value="hardest_worker"
                      color="default"
                      classes={{
                        checked: classes.checkboxChecked,
                        disabled: classes.checkboxDisabled,
                      }}
                      disabled={usedQualities.includes('hardest_worker')}
                    />
                  }
                  classes={{
                    label: classes.checkLabel,
                  }}
                  label="Hardest Worker"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        quality === 'most_professional' ||
                        usedQualities.includes('most_professional')
                      }
                      onChange={this.handleChange}
                      value="most_professional"
                      color="default"
                      classes={{
                        checked: classes.checkboxChecked,
                      }}
                      disabled={usedQualities.includes('most_professional')}
                    />
                  }
                  classes={{
                    label: classes.checkLabel,
                  }}
                  label="Most Professional"
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        quality === 'best_attitude' ||
                        usedQualities.includes('best_attitude')
                      }
                      onChange={this.handleChange}
                      value="best_attitude"
                      color="default"
                      classes={{
                        checked: classes.checkboxChecked,
                      }}
                      disabled={usedQualities.includes('best_attitude')}
                    />
                  }
                  classes={{
                    label: classes.checkLabel,
                  }}
                  label="Best Attitude"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        quality === 'team_player' ||
                        usedQualities.includes('team_player')
                      }
                      onChange={this.handleChange}
                      value="team_player"
                      color="default"
                      classes={{
                        checked: classes.checkboxChecked,
                      }}
                      disabled={usedQualities.includes('team_player')}
                    />
                  }
                  classes={{
                    label: classes.checkLabel,
                  }}
                  label="Team Player"
                />
              </Grid>
            </Grid>
            <Grid container justify="flex-end">
              <Grid item>
                <Button
                  className={classes.skipButton}
                  onClick={() => {
                    this.setState({
                      isPanelOpen: false,
                      quality: null,
                    });
                  }}
                >
                  Skip
                </Button>
              </Grid>
              <Grid item>
                <Button
                  className={classes.saveButton}
                  classes={{
                    disabled: classes.disabledButton,
                  }}
                  onClick={() => {
                    if (storage.get('hideEndorsementModal')) {
                      this.save();
                    } else {
                      this.setState({ isModalOpen: true });
                    }
                  }}
                  disabled={!quality}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
        <EndorsementTip isOpen={isTipOpen} onCloseModal={this.closeTipModal} />
        <EndorsementModal
          isOpen={isModalOpen}
          onCloseModal={this.closeModal}
          username={user.get('firstName')}
          quality={qualityNames[quality]}
          onSave={this.save}
        />
      </div>
    );
  }
}

export default withStyles(styles)(User);
