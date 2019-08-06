// @flow

import React, { Component } from 'react';
import { Formik } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import EditableFormInput from 'components/EditableFormInput';
import MultiSelect from 'components/MultiSelect';

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
    marginBottom: 10,
  },
});

type Props = {
  business: Object,
  classes: Object,
  updateBusiness: Function,
};

class BusinessProfileForm extends Component<Props> {
  state = {
    selectedCity: [],
  };
  componentWillReceiveProps(props) {
    const { business } = props;
    const otherLocations = business.otherLocations
      ? business.otherLocations
      : [];
    this.setState({
      selectedCity: otherLocations.map(location => ({
        label: location,
        value: location,
      })),
    });
  }
  handleSave = (values, { resetForm }) => {
    const { business } = this.props;
    const { selectedCity } = this.state;
    this.props.updateBusiness({
      id: business && business.id,
      ...values,
      otherLocations:
        selectedCity.length > 0
          ? selectedCity.map(location => location.value)
          : [],
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
      otherLocations: '',
      aboutUs: business.aboutUs,
      website: business.website,
      freelancerPaymentTerms: business.freelancerPaymentTerms,
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
            <EditableFormInput
              label="Other Cities we're hiring in"
              id="otherLocations"
              value={values.otherLocations}
              onChange={handleChange}
              onLocationSelect={address => {
                const newCity = {
                  label: address,
                  value: address,
                };
                this.handleRoleChange([newCity].concat(selectedCity));
              }}
              onBlur={handleBlur}
            />
            {selectedCity &&
              selectedCity.length > 0 && (
                <Grid
                  item
                  xs={12}
                  lg={12}
                  className={classes.searchInputWrapper}
                >
                  <MultiSelect
                    palceholder=" "
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
              )}
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
