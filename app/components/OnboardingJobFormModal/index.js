// @flow

import React, { Component } from 'react';
import { Formik } from 'formik';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, InlineDatePicker } from 'material-ui-pickers';
import { capitalize } from 'lodash-es';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Avatar from '@material-ui/core/Avatar';
import LeftArrowIcon from '@material-ui/icons/KeyboardArrowLeft';
import RightArrowIcon from '@material-ui/icons/KeyboardArrowRight';

import BaseModal from 'components/BaseModal';
import RoleSelect from 'components/RoleSelect';

import ROLES from 'enum/roles';

const roles = ROLES.sort().map(role => ({ value: role, label: role }));

const styles = theme => ({
  modal: {
    padding: 0,
    width: 581,
    borderRadius: '0px !important',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      transform: 'none !important',
      top: 'initial !important',
      left: '0px !important',
      bottom: '0px !important',
    },
  },
  header: {
    backgroundColor: '#f3f9ff',
    paddingTop: 73,
    paddingBottom: 20,
    textAlign: 'center',
    position: 'relative',
  },
  avatarWrapper: {
    padding: 3,
    backgroundColor: '#2e2e2e',
    position: 'absolute',
    left: '50%',
    top: -35,
    transform: 'translateX(-50%)',
    borderRadius: 100,
  },
  avatar: {
    height: 90,
    width: 90,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.6,
    color: '#555555',
    [theme.breakpoints.down('xs')]: {
      fontSize: 15,
      fontWeight: 600,
      letterSpacing: 0.5,
    },
  },
  link: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.6,
    textDecoration: 'none',
    textTransform: 'none',
  },
  content: {
    padding: '43px 48px 34px',
    [theme.breakpoints.down('xs')]: {
      padding: '30px 20px 20px',
    },
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: 0.4,
    color: '#313131',
    marginBottom: 15,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      fontWeight: 'bold',
    },
  },
  textInput: {
    backgroundColor: '#f1f1f1',
    padding: '13px 26px 8px',
    marginBottom: 12,
  },
  dateInputWrapper: {
    paddingRight: 12,
  },
  buttonsWrapper: {
    marginTop: 7,
  },
  cancelButton: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'none',
    padding: '18px 30px',
  },
  saveButton: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'none',
    padding: '18px 40px',
    borderRadius: 0,
  },
});

type Props = {
  user: Object,
  initialValues: Object,
  isOpen: boolean,
  classes: Object,
  onCloseModal: Function,
  onSave: Function,
};

class OnboardingJobFormModal extends Component<Props> {
  closeModal = () => {
    this.props.onCloseModal();
  };
  handleSave = values => {
    const { user } = this.props;
    const data = values;
    data.coworkers = [user.toJS()];
    data.to = values.from;
    this.props.onSave(data, user.toJS());
  };
  render() {
    const { user, initialValues, isOpen, classes } = this.props;
    return (
      <BaseModal
        className={classes.modal}
        isOpen={isOpen}
        onCloseModal={this.closeModal}
        shouldCloseOnOverlayClick={false}
      >
        <div className={classes.header}>
          <div className={classes.avatarWrapper}>
            <Avatar
              className={classes.avatar}
              src={user && user.getIn(['profile', 'avatar'])}
              alt={user && user.get('firstName')}
            />
          </div>
          <Typography className={classes.name} align="center">
            {`${capitalize(user && user.get('firstName'))} ${capitalize(
              user && user.get('lastName')
            )}`}
          </Typography>
          <a
            href={`/f/${user && user.get('slug')}`}
            target="_blank"
            className={classes.link}
          >
            See Profile
          </a>
        </div>
        <Formik initialValues={initialValues} onSubmit={this.handleSave}>
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
            <div className={classes.content}>
              <Typography variant="h6" component="h1" className={classes.title}>
                {`Help ${user &&
                  capitalize(
                    user.get('firstName')
                  )} verify that you worked together`}
              </Typography>
              <Input
                id="title"
                placeholder={`Name of event you worked with ${user &&
                  capitalize(user.get('firstName'))}`}
                value={values.title}
                fullWidth
                disableUnderline
                onChange={handleChange}
                onBlur={handleBlur}
                classes={{
                  root: classes.textInput,
                }}
                autoComplete="off"
              />
              <Grid container>
                <Grid item xs={12} lg={5} className={classes.dateInputWrapper}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <InlineDatePicker
                      value={values.from}
                      onChange={date =>
                        handleChange({ target: { id: 'from', value: date } })
                      }
                      format="MMM do, yyyy"
                      leftArrowIcon={<LeftArrowIcon />}
                      rightArrowIcon={<RightArrowIcon />}
                      InputProps={{
                        placeholder: 'Date of event',
                        disableUnderline: true,
                        classes: {
                          formControl: classes.textInput,
                        },
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} lg={7}>
                  <RoleSelect
                    placeholder="Position you worked at the event"
                    options={roles}
                    value={
                      values.role
                        ? { value: values.role, label: values.role }
                        : null
                    }
                    onChange={role => {
                      if (role && role.value) {
                        handleChange({
                          target: { id: 'role', value: role.value },
                        });
                      }
                    }}
                    isMulti={false}
                    isClearable={false}
                    isDisabled={!dirty}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                justify="flex-end"
                alignItems="center"
                className={classes.buttonsWrapper}
              >
                <Grid item>
                  <Button
                    className={classes.cancelButton}
                    color="primary"
                    onClick={this.props.onCloseModal}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    className={classes.saveButton}
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!values.title || !values.role || !values.from}
                  >
                    Save Coworker
                  </Button>
                </Grid>
              </Grid>
            </div>
          )}
        </Formik>
      </BaseModal>
    );
  }
}

export default withStyles(styles)(OnboardingJobFormModal);
