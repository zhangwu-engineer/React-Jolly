// @flow

import React, { Component } from 'react';
import { Formik } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
  saveButton: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'none',
    padding: '13px 34px',
    borderRadius: 0,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#262626',
  },
  notificationSwitchRoot: {
    margin: '20px 0px 20px 0px',
  },
});

type Props = {
  user: Object,
  classes: Object,
  updateUser: Function,
};

class NotificationForm extends Component<Props> {
  handleSave = (values, { resetForm }) => {
    this.props.updateUser({
      profile: values,
    });
    resetForm(values);
  };
  render() {
    const { user, classes } = this.props;
    const profile = {
      receiveMonthlyUpdates: user.getIn(['profile', 'receiveMonthlyUpdates']),
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
            <section className={classes.notificationSwitchRoot}>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      id="receiveMonthlyUpdates"
                      inputProps={{
                        name: 'receiveMonthlyUpdates',
                      }}
                      checked={values.receiveMonthlyUpdates}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Receive Monthly Updates"
                  labelPlacement="start"
                  classes={{
                    label: classes.switchLabel,
                  }}
                />
              </Grid>
            </section>
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

export default withStyles(styles)(NotificationForm);
