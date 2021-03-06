// @flow

import React, { Component } from 'react';
import { Formik } from 'formik';
import { capitalize } from 'lodash-es';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import EditableFormInput from 'components/EditableFormInput';

const styles = () => ({
  saveButton: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'none',
    padding: '13px 34px',
    borderRadius: 0,
  },
});

type Props = {
  user: Object,
  backURL: string,
  classes: Object,
  updateUser: Function,
};

class UserGeneralForm extends Component<Props> {
  handleSave = (values, { resetForm }) => {
    const { name, email } = values;
    if (name.split(' ').length >= 2) {
      const [firstName, ...rest] = name.split(' ');
      const lastName = rest.join(' ');
      this.props.updateUser({
        firstName,
        lastName,
        email,
      });
      resetForm(values);
    }
  };
  render() {
    const { user, backURL, classes } = this.props;
    const userData = {
      name: `${capitalize(user.get('firstName'))} ${capitalize(
        user.get('lastName')
      )}`,
      email: user.get('email'),
    };
    return (
      <Formik initialValues={userData} onSubmit={this.handleSave}>
        {({
          values,
          dirty,
          // errors,
          // touched,
          handleChange,
          handleBlur,
          handleSubmit,
          // isSubmitting,
          /* and other goodies */
        }) => (
          <React.Fragment>
            <EditableFormInput
              label="Name"
              id="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <EditableFormInput
              label="Email"
              id="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled
            />
            <EditableFormInput
              label={
                user.getIn(['profile', 'verifiedPhone'])
                  ? 'Phone (verified)'
                  : 'Phone (not verified)'
              }
              id="phone"
              value={user.getIn(['profile', 'phone'])}
              disabled
              backURL={backURL}
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

export default withStyles(styles)(UserGeneralForm);
