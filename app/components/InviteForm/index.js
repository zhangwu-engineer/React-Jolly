// @flow
import React, { Component } from 'react';
import { Formik } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = () => ({
  inviteBoxTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#4a4a4a',
    marginBottom: 20,
  },
  emailInputLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#8c8c8c',
  },
  inviteButton: {
    fontSize: 14,
    fontWeight: 600,
    paddingTop: 14,
    paddingBottom: 13,
    borderRadius: 0,
    marginTop: 8,
  },
});

type Props = {
  isInviting: boolean,
  classes: Object,
  sendInvite: Function,
};

class InviteForm extends Component<Props> {
  handleSave = (values, { resetForm }) => {
    if (values.email) {
      this.props.sendInvite(values.email);
      resetForm();
    }
  };
  textInput = React.createRef();
  render() {
    const { isInviting, classes } = this.props;
    return (
      <Formik initialValues={{ email: '' }} onSubmit={this.handleSave}>
        {({
          values,
          // dirty,
          // errors,
          // touched,
          handleChange,
          handleBlur,
          handleSubmit,
          // isSubmitting,
          /* and other goodies */
        }) => (
          <React.Fragment>
            <Typography className={classes.inviteBoxTitle} align="center">
              Don&apos;t see any coworkers? Invite them to Jolly
            </Typography>
            <TextField
              variant="filled"
              fullWidth
              label="Enter email"
              id="email"
              value={values.email}
              InputLabelProps={{
                classes: {
                  root: classes.emailInputLabel,
                },
              }}
              inputRef={this.textInput}
              onChange={handleChange}
              onKeyDown={e => {
                if (e.keyCode === 13 && values.email) {
                  if (this.textInput.current) {
                    this.textInput.current.blur();
                  }
                  handleSubmit();
                }
              }}
              onBlur={handleBlur}
              autoComplete="off"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className={classes.inviteButton}
              onClick={handleSubmit}
              disabled={isInviting}
            >
              Send Invite
            </Button>
          </React.Fragment>
        )}
      </Formik>
    );
  }
}

export default withStyles(styles)(InviteForm);
