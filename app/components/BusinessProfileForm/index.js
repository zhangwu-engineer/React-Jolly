// @flow

import React, { Component } from 'react';
import { Formik } from 'formik';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import EditableFormInput from 'components/EditableFormInput';
import CustomSelect from 'components/CustomSelect';

const styles = () => ({
  saveButton: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'none',
    padding: '13px 34px',
    borderRadius: 0,
    marginTop: 5,
  },
  searchInputWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
});

const placeSuggestions = [
  { label: 'Austin, Tx', value: 'Austin, Tx' },
  { label: 'Toledo, Spain', value: 'Toledo, Spain' },
  { label: 'Tokyo, Japan', value: 'Tokyo, Japan' },
];

type Props = {
  business: Object,
  classes: Object,
  updateBusiness: Function,
};

class BusinessProfileForm extends Component<Props> {
  state = {
    selectedCity: null,
  };
  handleSave = (values, { resetForm }) => {
    const { business } = this.props;
    this.props.updateBusiness({
      id: business && business.id,
      ...values,
    });
    resetForm(values);
  };
  handleRoleChange = city => {
    this.setState({ selectedCity: city });
  };
  render() {
    const { business, classes } = this.props;
    const { selectedCity } = this.state;
    const businessData = {
      name: business.name,
      location: business.location,
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
            <EditableFormInput
              label="Name"
              id="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <EditableFormInput
              label="Headquaters City"
              id="location"
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Grid item xs={12} lg={12} className={classes.searchInputWrapper}>
              <CustomSelect
                placeholder="Other Cities Active"
                options={placeSuggestions}
                value={selectedCity}
                onChange={value => this.handleRoleChange(value)}
                isMulti
                isClearable={false}
                stylesOverride={{
                  container: () => ({
                    backgroundColor: '#f1f1f1',
                    width: '100%',
                  }),
                }}
              />
            </Grid>
            <EditableFormInput
              label="About Us"
              id="aboutUs"
              value={values.aboutUs}
              onChange={handleChange}
              onBlur={handleBlur}
              limit={400}
              assistiveText="i.e. Cash on site, Net 30, etc."
            />
            <EditableFormInput
              label="Website"
              id="website"
              value={values.website}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <EditableFormInput
              label="Freelancer Payment Terms"
              id="freelancerPaymentTerms"
              value={values.freelancerPaymentTerms}
              onChange={handleChange}
              onBlur={handleBlur}
              limit={100}
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
