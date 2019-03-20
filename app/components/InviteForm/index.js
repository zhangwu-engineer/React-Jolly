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
    fontWeight: 600,
    color: '#1e1e24',
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
    textTransform: 'none',
  },
});

type Props = {
  isInviting: boolean,
  text: ?string,
  buttonTitle: ?string,
  classes: Object,
  sendInvite: Function,
};

class InviteForm extends Component<Props> {
  static defaultProps = {
    text: `Don't see any coworkers? Invite them to Jolly`,
    buttonTitle: 'Send Invite',
  };
  handleSave = (values, { resetForm }) => {
    if (values.email) {
      this.props.sendInvite(values.email);
      resetForm();
    }
  };
  textInput = React.createRef();
  render() {
    const { isInviting, text, buttonTitle, classes } = this.props;
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
              <span dangerouslySetInnerHTML={{ __html: text }} />
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
              {buttonTitle}
            </Button>
          </React.Fragment>
        )}
      </Formik>
    );
  }
}

export default withStyles(styles)(InviteForm);
