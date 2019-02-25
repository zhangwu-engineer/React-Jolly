// @flow

import React, { Component } from 'react';
import { Formik } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import EditableInput from 'components/EditableInput';

const styles = theme => ({
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
  cityField: {
    paddingRight: 12,
    [theme.breakpoints.down('xs')]: {
      paddingRight: 0,
    },
  },
  distanceField: {
    paddingLeft: 12,
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 0,
    },
  },
});

type Props = {
  user: Object,
  classes: Object,
  updateUser: Function,
};

class UserProfileForm extends Component<Props> {
  handleSave = (values, { resetForm }) => {
    this.props.updateUser({
      profile: values,
    });
    resetForm(values);
  };
  render() {
    const { user, classes } = this.props;
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
      <Formik initialValues={profile} onSubmit={this.handleSave}>
        {({
          values,
          dirty,
          // errors,
          // touched,
          handleChange,
          // handleBlur,
          handleSubmit,
          // isSubmitting,
          /* and other goodies */
        }) => (
          <React.Fragment>
            <Typography className={classes.contactOptionsTitle}>
              Contact Options
            </Typography>
            <Typography className={classes.contactOptionsDesc}>
              Select how you’d like clients to contact you. Your phone number
              will never be displayed on your profile.
            </Typography>
            <Grid
              className={classes.switchGroup}
              container
              justify="space-between"
            >
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      id="receiveEmail"
                      inputProps={{
                        name: 'receiveEmail',
                      }}
                      checked={values.receiveEmail}
                      onChange={handleChange}
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
                      id="receiveSMS"
                      inputProps={{
                        name: 'receiveSMS',
                      }}
                      checked={values.receiveSMS}
                      onChange={handleChange}
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
                      id="receiveCall"
                      inputProps={{
                        name: 'receiveCall',
                      }}
                      checked={values.receiveCall}
                      onChange={handleChange}
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
              name="bio"
              value={values.bio}
              multiline
              onChange={handleChange}
            />
            <Grid container>
              <Grid item lg={6} xs={12} className={classes.cityField}>
                <EditableInput
                  label="Nearest City"
                  id="location"
                  name="location"
                  value={values.location}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item lg={6} xs={12} className={classes.distanceField}>
                <EditableInput
                  label="Travel Radius(miles)"
                  id="distance"
                  name="distance"
                  value={values.distance}
                  onChange={handleChange}
                  disabled={!values.location}
                />
              </Grid>
            </Grid>
            <EditableInput
              label="Facebook"
              id="facebook"
              name="facebook"
              value={values.facebook}
              startWith="/"
              onChange={handleChange}
            />
            <EditableInput
              label="Twitter"
              id="twitter"
              name="twitter"
              value={values.twitter}
              startWith="@"
              onChange={handleChange}
            />
            <EditableInput
              label="Linkedin"
              id="linkedin"
              name="linkedin"
              value={values.linkedin}
              startWith="/in/"
              onChange={handleChange}
            />
            <EditableInput
              label="Youtube"
              id="youtube"
              name="youtube"
              value={values.youtube}
              startWith="/"
              onChange={handleChange}
            />
            <FormControlLabel
              control={
                <Switch
                  id="showImageLibrary"
                  inputProps={{
                    name: 'showImageLibrary',
                  }}
                  checked={values.showImageLibrary}
                  onChange={handleChange}
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
                  disabled={!dirty}
                  onClick={handleSubmit}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </React.Fragment>
        )}
      </Formik>
    );
  }
}

export default withStyles(styles)(UserProfileForm);
