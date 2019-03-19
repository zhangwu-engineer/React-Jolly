// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import { Formik } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import ClearIcon from '@material-ui/icons/Clear';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import BaseModal from 'components/BaseModal';
import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';

import CategoryIcon from 'images/sprite/category.svg';
import { CATEGORY_OPTIONS } from 'enum/constants';

const styles = theme => ({
  modal: {
    padding: 0,
    width: 581,
    borderRadius: '0px !important',
    top: '96px !important',
    transform: 'translateX(-50%) !important',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      transform: 'none !important',
      top: 'initial !important',
      left: '0px !important',
      bottom: '0px !important',
      height: '100%',
    },
  },
  blueLine: {
    backgroundColor: theme.palette.primary.main,
    height: 10,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  content: {
    position: 'relative',
    padding: 30,
    [theme.breakpoints.down('xs')]: {
      padding: 20,
    },
  },
  header: {
    marginBottom: 15,
  },
  avatarWrapper: {
    paddingRight: 10,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  avatar: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 0.3,
    color: '#1e1e24',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      fontWeight: 'bold',
    },
  },
  icon: {
    display: 'block',
  },
  categoryWrapper: {
    marginBottom: 10,
  },
  categoryHeader: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    cursor: 'pointer',
  },
  categoryOptions: {
    backgroundColor: '#f1f1f1',
    paddingLeft: 25,
    paddingRight: 10,
    width: '100%',
  },
  radio: {
    color: '#404040 !important',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 500,
    color: '#1e1e24',
  },
  categoryTitleWrapper: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: 500,
    letterSpacing: 0.3,
    color: '#1e1e24',
    paddingLeft: 7,
  },
  textInputRoot: {
    backgroundColor: '#f1f1f1',
    padding: '13px 26px 8px 10px',
    marginBottom: 12,
  },
  textInput: {
    fontSize: 16,
  },
  buttonsWrapper: {
    marginTop: 7,
  },
  postButton: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'none',
    padding: '12px 40px',
    borderRadius: 0,
    letterSpacing: 0.3,
  },
  postButtonDisabled: {
    backgroundColor: '#6f6f73 !important',
    color: '#ffffff !important',
  },
  closeButton: {
    position: 'absolute',
    padding: 5,
    right: 10,
    top: 10,
  },
});

type Props = {
  user: Object,
  isOpen: boolean,
  classes: Object,
  onCloseModal: Function,
  onSave: Function,
};

type State = {
  isOptionOpen: boolean,
};

class PostFormModal extends Component<Props, State> {
  state = {
    isOptionOpen: false,
  };
  closeModal = () => {
    this.setState({ isOptionOpen: false });
    this.props.onCloseModal();
  };
  toggleOption = () => {
    this.setState(state => ({ isOptionOpen: !state.isOptionOpen }));
  };
  handleSave = values => {
    const { user } = this.props;
    const data = values;
    data.location = user.getIn(['profile', 'location']);
    this.props.onSave(data);
  };
  render() {
    const { user, isOpen, classes } = this.props;
    const { isOptionOpen } = this.state;
    const initialValues = {
      category: '',
      content: '',
    };
    return (
      <BaseModal
        className={classes.modal}
        isOpen={isOpen}
        onCloseModal={this.closeModal}
        shouldCloseOnOverlayClick={false}
      >
        <div className={classes.blueLine} />
        <Formik initialValues={initialValues} onSubmit={this.handleSave}>
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
            <div className={classes.content}>
              <IconButton
                className={classes.closeButton}
                onClick={this.closeModal}
              >
                <ClearIcon />
              </IconButton>
              <Grid container alignItems="center" className={classes.header}>
                <Grid item className={classes.avatarWrapper}>
                  <UserAvatar
                    src={user.getIn(['profile', 'avatar'])}
                    className={classes.avatar}
                  />
                </Grid>
                <Grid item>
                  <Typography
                    variant="h6"
                    component="h1"
                    className={classes.title}
                  >
                    {`Post to ${user && user.getIn(['profile', 'location'])}`}
                  </Typography>
                </Grid>
              </Grid>
              <div className={classes.categoryWrapper}>
                <Grid
                  container
                  alignItems="center"
                  className={classes.categoryHeader}
                  onClick={this.toggleOption}
                >
                  <Grid item>
                    <Icon glyph={CategoryIcon} size={20} />
                  </Grid>
                  <Grid item className={classes.categoryTitleWrapper}>
                    <Typography className={classes.category}>
                      {values.category
                        ? CATEGORY_OPTIONS.map(
                            option =>
                              option.value === values.category && option.label
                          )
                        : 'Choose category'}
                    </Typography>
                  </Grid>
                  <Grid item>
                    {isOptionOpen ? (
                      <ExpandLessIcon className={classes.icon} />
                    ) : (
                      <ExpandMoreIcon className={classes.icon} />
                    )}
                  </Grid>
                </Grid>
                {isOptionOpen && (
                  <FormControl
                    component="fieldset"
                    className={classes.categoryOptions}
                  >
                    <RadioGroup
                      name="category"
                      className={classes.group}
                      value={values.category}
                      onChange={e => {
                        handleChange(e);
                        this.toggleOption();
                      }}
                    >
                      {CATEGORY_OPTIONS.map(option => (
                        <FormControlLabel
                          key={generate()}
                          value={option.value}
                          control={<Radio classes={{ root: classes.radio }} />}
                          label={option.label}
                          classes={{
                            label: classes.optionLabel,
                          }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              </div>
              <Input
                id="content"
                placeholder="Category-specific prompt goes here"
                fullWidth
                disableUnderline
                onChange={handleChange}
                onBlur={handleBlur}
                classes={{
                  root: classes.textInputRoot,
                  input: classes.textInput,
                }}
                autoComplete="off"
                multiline
                rows={8}
              />
              <Grid
                container
                justify="flex-end"
                alignItems="center"
                className={classes.buttonsWrapper}
              >
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!values.content || !values.category}
                    classes={{
                      root: classes.postButton,
                      disabled: classes.postButtonDisabled,
                    }}
                  >
                    Post
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

export default withStyles(styles)(PostFormModal);
