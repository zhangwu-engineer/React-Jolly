// @flow

import React, { Component } from 'react';
import { Formik } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import EditableInput from 'components/EditableInput';

const styles = () => ({
  saveButton: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'none',
    padding: '13px 34px',
    borderRadius: 0,
    marginTop: 5,
  },
});

type Props = {
  business: Object,
  classes: Object,
  updateBusiness: Function,
};

class BusinessProfileForm extends Component<Props> {
  handleSave = (values, { resetForm }) => {
    const { name } = values;
    const { business } = this.props;
    this.props.updateBusiness({
      id: business && business.id,
      name,
    });
    resetForm(values);
  };
  render() {
    const { business, classes } = this.props;
    const businessData = {
      name: business.name,
    };
    return (
      <Formik initialValues={businessData} onSubmit={this.handleSave}>
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
            <EditableInput
              label="Name"
              id="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
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

export default withStyles(styles)(BusinessProfileForm);
