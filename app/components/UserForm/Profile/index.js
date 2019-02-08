// @flow

import React, { Component } from 'react';
import update from 'immutability-helper';
import { isEqual } from 'lodash-es';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import EditableInput from 'components/EditableInput';

const styles = () => ({
  contactOptionsTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#090909',
  },
  contactOptionsDesc: {
    fontSize: 14,
    fontWeight: 600,
    color: '#6b6464',
    marginBottom: 10,
  },
  saveButton: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'none',
    padding: '13px 34px',
    borderRadius: 0,
  },
  switchGroup: {
    marginBottom: 30,
  },
  switchRoot: {
    margin: 0,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#262626',
  },
  imageSwitchRoot: {
    margin: '20px 0px 20px 0px',
  },
});

type Props = {
  user: Object,
  classes: Object,
  updateUser: Function,
};

type State = {
  model: ?Object,
};

class UserProfileForm extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.user && !prevState.model) {
      const profile = nextProps.user.get('profile');
      const newModel = {
        receiveEmail: profile.get('receiveEmail'),
        receiveSMS: profile.get('receiveSMS'),
        receiveCall: profile.get('receiveCall'),
        bio: profile.get('bio') || '',
        location: profile.get('location') || '',
        distance: profile.get('distance') || '',
        facebook: profile.get('facebook') || '',
        twitter: profile.get('twitter') || '',
        linkedin: profile.get('linkedin') || '',
        youtube: profile.get('youtube') || '',
        showImageLibrary: profile.get('showImageLibrary'),
      };
      return {
        ...prevState,
        model: newModel,
      };
    }
    return null;
  }
  state = {
    model: null,
  };
  onChange = (id, value) => {
    this.setState(
      update(this.state, {
        model: {
          [id]: { $set: value },
        },
      })
    );
  };
  handleSave = () => {
    const { model } = this.state;
    this.props.updateUser({
      profile: model,
    });
  };
  handleSwitchChange = name => event => {
    this.onChange(name, event.target.checked);
  };
  render() {
    const { user, classes } = this.props;
    const { model } = this.state;
    const profile = {
      receiveEmail: user.getIn(['profile', 'receiveEmail']),
      receiveSMS: user.getIn(['profile', 'receiveSMS']),
      receiveCall: user.getIn(['profile', 'receiveCall']),
      bio: user.getIn(['profile', 'bio']) || '',
      location: user.getIn(['profile', 'location']) || '',
      distance: user.getIn(['profile', 'distance']) || '',
      facebook: user.getIn(['profile', 'facebook']) || '',
      twitter: user.getIn(['profile', 'twitter']) || '',
      linkedin: user.getIn(['profile', 'linkedin']) || '',
      youtube: user.getIn(['profile', 'youtube']) || '',
      showImageLibrary: user.getIn(['profile', 'showImageLibrary']),
    };
    return (
      <React.Fragment>
        <Typography className={classes.contactOptionsTitle}>
          Contact Options
        </Typography>
        <Typography className={classes.contactOptionsDesc}>
          Select how you’d like clients to contact you. Your phone number will
          never be displayed on your profile.
        </Typography>
        <Grid className={classes.switchGroup} container justify="space-between">
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={model && model.receiveEmail}
                  onChange={this.handleSwitchChange('receiveEmail')}
                  color="primary"
                />
              }
              label="Email"
              labelPlacement="start"
              classes={{
                root: classes.switchRoot,
                label: classes.switchLabel,
              }}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={model && model.receiveSMS}
                  onChange={this.handleSwitchChange('receiveSMS')}
                  color="primary"
                />
              }
              label="SMS"
              labelPlacement="start"
              classes={{
                root: classes.switchRoot,
                label: classes.switchLabel,
              }}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={model && model.receiveCall}
                  onChange={this.handleSwitchChange('receiveCall')}
                  color="primary"
                />
              }
              label="Call"
              labelPlacement="start"
              classes={{
                root: classes.switchRoot,
                label: classes.switchLabel,
              }}
            />
          </Grid>
        </Grid>
        <EditableInput
          label="Bio"
          id="bio"
          value={model && model.bio}
          multiline
          onChange={this.onChange}
        />
        <Grid container>
          <Grid item lg={6} xs={12}>
            <EditableInput
              label="Nearest City"
              id="location"
              value={model && model.location}
              onChange={this.onChange}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <EditableInput
              label="Travel Radius"
              id="distance"
              value={model && model.distance}
              onChange={this.onChange}
            />
          </Grid>
        </Grid>
        <EditableInput
          label="Facebook"
          id="facebook"
          value={model && model.facebook}
          startWith="/"
          onChange={this.onChange}
        />
        <EditableInput
          label="Twitter"
          id="twitter"
          value={model && model.twitter}
          startWith="@"
          onChange={this.onChange}
        />
        <EditableInput
          label="Linkedin"
          id="linkedin"
          value={model && model.linkedin}
          startWith="/in/"
          onChange={this.onChange}
        />
        <EditableInput
          label="Youtube"
          id="youtube"
          value={model && model.youtube}
          startWith="/"
          onChange={this.onChange}
        />
        <FormControlLabel
          control={
            <Switch
              checked={model && model.showImageLibrary}
              onChange={this.handleSwitchChange('showImageLibrary')}
              color="primary"
            />
          }
          label="Show image library on public profile"
          labelPlacement="start"
          classes={{
            root: classes.imageSwitchRoot,
            label: classes.switchLabel,
          }}
        />
        <Grid container justify="flex-end">
          <Grid item>
            <Button
              className={classes.saveButton}
              color="primary"
              variant="contained"
              disabled={isEqual(profile, model)}
              onClick={this.handleSave}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(UserProfileForm);
