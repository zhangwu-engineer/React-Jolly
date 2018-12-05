// @flow

import React, { Component } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { InlineDatePicker } from 'material-ui-pickers';

import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import LeftArrowIcon from '@material-ui/icons/KeyboardArrowLeft';
import RightArrowIcon from '@material-ui/icons/KeyboardArrowRight';

import Link from 'components/Link';
import Dropzone from 'components/Dropzone';

const styles = theme => ({
  topline: {
    backgroundColor: theme.palette.primary.main,
  },
  toplineInner: {
    height: 103,
    maxWidth: 1063,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'flex-end',
  },
  clearButtonWrapper: {
    color: theme.palette.common.white,
    height: 66,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
  },
  titleWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.21)',
  },
  titleInput: {
    width: 487,
    fontSize: 24,
    fontWeight: 500,
    padding: 13,
    paddingBottom: 20,
    color: theme.palette.common.white,
    boxSizing: 'border-box',
  },
  titleInputUnderline: {
    '&:hover:before': {
      borderBottom: '6px solid #92bce6 !important',
    },
    '&:before': {
      borderBottom: '6px solid #92bce6',
    },
    '&:after': {
      borderBottom: '6px solid #92bce6',
    },
  },
  formSection: {
    backgroundColor: theme.palette.common.white,
    padding: '40px 70px 200px 80px',
    maxWidth: 1063,
    margin: '0 auto',
  },
  formFieldGroup: {
    marginBottom: 30,
  },
  formInputWrapper: {
    backgroundColor: '#efefef',
  },
  formInput: {
    fontSize: 14,
    fontWeight: 500,
    color: '#434343',
    padding: '14px 20px',
    boxSizing: 'border-box',
  },
  iconWrapper: {
    padding: 20,
    fontSize: 14,
    color: '#434343',
  },
  dropzone: {
    border: '1px dashed #d7d7d7',
    width: 260,
    height: 170,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropzoneText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#939393',
  },
  uploadButtonWrapper: {
    alignSelf: 'center',
    marginLeft: 25,
  },
  uploadButton: {
    fontSize: 14,
    textTransform: 'none',
  },
});

type Props = {
  user: Object,
  classes: Object,
};

type State = {
  from: Date,
  to: Date,
};

class WorkForm extends Component<Props, State> {
  state = {
    from: new Date(),
    to: new Date(),
  };
  onDrop = async (accepted: Array<Object>) => {
    // const promises = accepted.map(this.setupReader);
    // const data = await Promise.all(promises);
    // this.props.uploadPhoto(data);
  };
  dropzoneRef = React.createRef();
  dropzoneDiv = React.createRef();
  render() {
    const { classes, user } = this.props;
    const { from, to } = this.state;
    return (
      <div>
        <div className={classes.topline}>
          <div className={classes.toplineInner}>
            <div className={classes.clearButtonWrapper}>
              <IconButton
                color="inherit"
                component={props => (
                  <Link to={`/f/${user.get('slug')}/edit`} {...props} />
                )}
              >
                <ClearIcon />
              </IconButton>
            </div>
            <FormControl>
              <Input
                id="title"
                name="title"
                placeholder="Event Title"
                classes={{
                  input: classes.titleInput,
                  underline: classes.titleInputUnderline,
                  formControl: classes.titleWrapper,
                }}
                autoFocus
              />
            </FormControl>
          </div>
        </div>
        <div className={classes.formSection}>
          <Grid container>
            <Grid item xs={8}>
              <Grid container className={classes.formFieldGroup}>
                <Grid item />
                <Grid item>
                  <FormControl>
                    <Input
                      id="role"
                      name="role"
                      placeholder="Add Role"
                      classes={{
                        input: classes.formInput,
                        formControl: classes.formInputWrapper,
                      }}
                      disableUnderline
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid
                  container
                  alignItems="center"
                  className={classes.formFieldGroup}
                >
                  <Grid item />
                  <Grid item>
                    <InlineDatePicker
                      value={from}
                      onChange={date => this.setState({ from: date })}
                      format="MMM. dd"
                      leftArrowIcon={<LeftArrowIcon />}
                      rightArrowIcon={<RightArrowIcon />}
                      InputProps={{
                        disableUnderline: true,
                        classes: {
                          input: classes.formInput,
                          formControl: classes.formInputWrapper,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item className={classes.iconWrapper}>
                    to
                  </Grid>
                  <Grid item>
                    <InlineDatePicker
                      value={to}
                      onChange={date => this.setState({ to: date })}
                      format="MMM. dd"
                      leftArrowIcon={<LeftArrowIcon />}
                      rightArrowIcon={<RightArrowIcon />}
                      InputProps={{
                        disableUnderline: true,
                        classes: {
                          input: classes.formInput,
                          formControl: classes.formInputWrapper,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </MuiPickersUtilsProvider>
              <Grid container className={classes.formFieldGroup}>
                <Grid item />
                <Grid item>
                  <FormControl>
                    <Input
                      id="caption"
                      name="caption"
                      multiline
                      rows={4}
                      classes={{
                        input: classes.formInput,
                        formControl: classes.formInputWrapper,
                      }}
                      disableUnderline
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container className={classes.formFieldGroup}>
                <Grid item />
                <Grid item>
                  <Dropzone
                    className={classes.dropzone}
                    ref={this.dropzoneRef}
                    accept="image/*"
                    onDrop={this.onDrop}
                  >
                    <div ref={this.dropzoneDiv}>
                      <Typography className={classes.dropzoneText}>
                        Drag &amp; drop here
                      </Typography>
                    </div>
                  </Dropzone>
                </Grid>
                <Grid item className={classes.uploadButtonWrapper}>
                  <Button
                    className={classes.uploadButton}
                    color="primary"
                    onClick={() => {
                      if (this.dropzoneDiv.current) {
                        this.dropzoneDiv.current.click();
                      }
                    }}
                  >
                    or upload from computer
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4} />
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(WorkForm);
