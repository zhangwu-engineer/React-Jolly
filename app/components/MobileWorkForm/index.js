// @flow

import React, { Component } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
import {
  MuiPickersUtilsProvider,
  BasePicker,
  Calendar,
} from 'material-ui-pickers';
import { debounce, get } from 'lodash-es';
import { generate } from 'shortid';
import cx from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ClearIcon from '@material-ui/icons/Clear';
import LeftArrowIcon from '@material-ui/icons/KeyboardArrowLeft';
import RightArrowIcon from '@material-ui/icons/KeyboardArrowRight';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DoneIcon from '@material-ui/icons/Done';

import Link from 'components/Link';
import Icon from 'components/Icon';
import Dropzone from 'components/Dropzone';

import RoleIcon from 'images/sprite/role.svg';
import CaptionIcon from 'images/sprite/caption.svg';
import AddPhotoIcon from 'images/sprite/add-photo.svg';
import PeopleIcon from 'images/sprite/people.svg';

import ROLES from 'enum/roles';

const styles = theme => ({
  root: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  topline: {
    backgroundColor: theme.palette.primary.main,
  },
  toplineInner: {
    margin: '0 auto',
    display: 'flex',
    alignItems: 'flex-end',
  },
  clearButton: {
    color: theme.palette.common.white,
  },
  saveButton: {
    color: theme.palette.common.white,
  },
  backButton: {
    color: theme.palette.common.white,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: 600,
    padding: '15px 10px',
    color: theme.palette.common.white,
    boxSizing: 'border-box',
  },
  formSection: {
    backgroundColor: theme.palette.common.white,
    padding: 15,
    height: 'calc(100vh - 100px)',
  },
  formFieldGroup: {
    marginBottom: 20,
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
    paddingRight: 15,
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
  alignSelfCenter: {
    alignSelf: 'center',
  },
  pinLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: '#4a4a4a',
  },
  fullWidth: {
    flex: 1,
  },
  searchWorkList: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid #e5e5e5',
    position: 'absolute',
    width: '100%',
    height: 'calc(100vh - 100px)',
    top: 50,
    zIndex: 10,
    overflowY: 'scroll',
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#F5F5F5',
    },
    '&::-webkit-scrollbar': {
      width: 6,
      backgroundColor: '#F5F5F5',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#a4acb3',
    },
  },
  searchResultList: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid #e5e5e5',
    position: 'absolute',
    width: '100%',
    maxHeight: 200,
    top: 49,
    zIndex: 10,
    overflowY: 'scroll',
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#F5F5F5',
    },
    '&::-webkit-scrollbar': {
      width: 6,
      backgroundColor: '#F5F5F5',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#a4acb3',
    },
  },
  resultItem: {
    display: 'block',
    paddingLeft: 20,
    cursor: 'pointer',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.25,
    letterSpacing: '0.4px',
    color: '#4a4a4a',
  },
  resultDateText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#9b9b9b',
  },
  addEventButton: {
    fontSize: 14,
    fontWeight: 500,
    textTransform: 'none',
  },
  formText: {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '0.3px',
    color: '#4a4a4a',
  },
  roleRoot: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    transform: 'translate(100%)',
    transition: 'all .3s ease-in-out',
  },
  activeRoleRoot: {
    transform: 'translate(0)',
  },
  roleSection: {
    height: 'calc(100vh - 40px)',
    backgroundColor: theme.palette.common.white,
  },
  roleLabel: {
    paddingLeft: 20,
    paddingTop: 30,
    paddingBottom: 20,
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.5px',
    color: '#848484',
  },
  addRoleButton: {
    fontSize: 14,
    fontWeight: 500,
  },
  iconButton: {
    color: '#a4acb3',
    '&:hover': {
      color: theme.palette.primary.main,
    },
    [theme.breakpoints.down('xs')]: {
      padding: 6,
    },
  },
  checkboxRoot: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  coworkerInput: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.palette.common.white,
    padding: '14px 20px',
    boxSizing: 'border-box',
  },
  searchCoworkerList: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid #e5e5e5',
    position: 'absolute',
    width: '100%',
    height: 'calc(100vh - 49px)',
    top: 49,
    zIndex: 10,
    overflowY: 'scroll',
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#F5F5F5',
    },
    '&::-webkit-scrollbar': {
      width: 6,
      backgroundColor: '#F5F5F5',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#a4acb3',
    },
  },
  emptyResultText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#494949',
    textAlign: 'center',
    marginTop: 40,
  },
});

type Props = {
  user: Object,
  isLoading: boolean,
  error: string,
  works: Object,
  roles: Object,
  users: Object,
  classes: Object,
  searchUsers: Function,
  requestCreateWork: Function,
};

type State = {
  model: {
    title: string,
    role: string,
    coworkers: Array,
    from: Date,
    to: Date,
    caption: string,
    pinToProfile: boolean,
    coworkers: Array,
  },
  works?: Array<Object>,
  filteredWorks: Array<Object>,
  roles?: Array<string>,
  filteredRoles: Array<string>,
  activeSection: string,
  newRole: string,
  isEditingRole: boolean,
  isEditingFrom: boolean,
  isEditingTo: boolean,
  isEditingCaption: boolean,
  newUser: string,
};

class MobileWorkForm extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.roles.length && prevState.roles === undefined) {
      return {
        roles: nextProps.roles,
      };
    }
    if (nextProps.works.size > 0 && prevState.works === undefined) {
      return {
        works: nextProps.works.toJS(),
      };
    }
    return null;
  }
  state = {
    model: {
      title: '',
      role: '',
      coworkers: [],
      from: new Date(),
      to: new Date(),
      caption: '',
      pinToProfile: true,
      coworkers: [],
    },
    works: undefined,
    filteredWorks: [],
    roles: undefined,
    filteredRoles: [],
    activeSection: 'main',
    newRole: '',
    isEditingRole: false,
    isEditingFrom: false,
    isEditingTo: false,
    isEditingCaption: false,
    newUser: '',
  };
  // onDrop = async (accepted: Array<Object>) => {
  //   const promises = accepted.map(this.setupReader);
  //   const data = await Promise.all(promises);
  //   this.props.uploadPhoto(data);
  // };
  debouncedSearch = debounce((name, value) => {
    switch (name) {
      case 'title': {
        const filteredWorks =
          this.state.works &&
          this.state.works.filter(
            w => w.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
          );
        this.setState({ filteredWorks });
        break;
      }
      case 'newRole': {
        const filteredRoles = ROLES.filter(
          r => r.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        this.setState({ filteredRoles });
        break;
      }
      case 'newUser':
        if (value) {
          this.props.searchUsers(value);
        }
        break;
      default:
        break;
    }
    if (!value) {
      this.setState({ [name]: '' }, () => {});
    }
  }, 500);
  handleChange = (e: Object) => {
    const { name, value } = e.target;
    if (name === 'newUser') {
      this.setState({ newUser: value }, () => {
        this.debouncedSearch(name, value);
      });
    } else {
      this.setState(
        state => ({
          ...state,
          model: {
            ...state.model,
            [name]: value,
          },
        }),
        () => {
          this.debouncedSearch(name, value);
        }
      );
    }
  };
  handleCheckChange = () => {
    this.setState(state => ({
      ...state,
      model: {
        ...state.model,
        pinToProfile: !state.model.pinToProfile,
      },
    }));
  };
  registerWorkExperience = () => {
    const { model } = this.state;
    this.props.requestCreateWork(model);
  };
  dropzoneRef = React.createRef();
  dropzoneDiv = React.createRef();
  render() {
    const { classes, user, isLoading, error, users } = this.props;
    const {
      model,
      works,
      filteredWorks,
      roles,
      filteredRoles,
      activeSection,
      newRole,
      isEditingRole,
      isEditingFrom,
      isEditingTo,
      isEditingCaption,
      newUser,
    } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.formRoot}>
          <div className={classes.topline}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <IconButton
                  className={classes.clearButton}
                  color="inherit"
                  component={props => (
                    <Link to={`/f/${user.get('slug')}/edit`} {...props} />
                  )}
                >
                  <ClearIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <Button
                  className={classes.saveButton}
                  color="primary"
                  size="medium"
                  onClick={this.registerWorkExperience}
                  disabled={isLoading}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
            <FormControl fullWidth>
              <Input
                id="title"
                name="title"
                placeholder="Event Title"
                value={model.title}
                classes={{
                  input: classes.titleInput,
                }}
                onChange={e => {
                  e.persist();
                  this.setState(
                    state => ({
                      ...state,
                      model: {
                        ...state.model,
                        title: e.target.value,
                      },
                    }),
                    () => {
                      this.debouncedSearch(e.target.name, e.target.value);
                    }
                  );
                }}
                autoFocus
                disableUnderline
                fullWidth
              />
              {filteredWorks.length ? (
                <div className={classes.searchWorkList}>
                  {filteredWorks.map(w => (
                    <ListItem
                      className={classes.resultItem}
                      key={generate()}
                      onClick={() =>
                        this.setState(state => ({
                          ...state,
                          model: {
                            ...state.model,
                            title: w.title,
                            from: new Date(w.from),
                            to: new Date(w.to),
                          },
                          filteredWorks: [],
                        }))
                      }
                    >
                      <Typography className={classes.resultText}>
                        {w.title}
                      </Typography>
                      <Typography className={classes.resultDateText}>
                        {`from ${format(
                          new Date(w.from),
                          'MM/dd/yy'
                        )} to ${format(new Date(w.to), 'MM/dd/yy')}`}
                      </Typography>
                    </ListItem>
                  ))}
                  <Button
                    className={classes.addEventButton}
                    color="primary"
                    onClick={() => this.setState({ isEditingRole: true })}
                  >
                    + Add a new event name
                  </Button>
                </div>
              ) : null}
            </FormControl>
          </div>
          <div className={classes.formSection}>
            <Grid
              container
              className={classes.formFieldGroup}
              onClick={() => this.setState({ activeSection: 'role' })}
            >
              <Grid item className={classes.iconWrapper}>
                <Icon glyph={RoleIcon} size={18} />
              </Grid>
              <Grid item className={classes.fullWidth}>
                <Typography className={classes.formText}>
                  {model.role ? model.role : 'Role worked'}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              className={classes.formFieldGroup}
              onClick={() => this.setState({ activeSection: 'coworker' })}
            >
              <Grid item className={classes.iconWrapper}>
                <Icon glyph={PeopleIcon} size={18} />
              </Grid>
              <Grid item className={classes.fullWidth}>
                <Typography className={classes.formText}>
                  {model.coworkers.length
                    ? `${model.coworkers.length} Coworkers`
                    : 'Add coworkers'}
                </Typography>
                {/* <FormControl fullWidth>
                  <Input
                    id="coworker"
                    name="coworker"
                    placeholder="Add Coworkers"
                    classes={{
                      input: classes.formInput,
                      formControl: classes.formInputWrapper,
                    }}
                    disableUnderline
                    fullWidth
                  />
                </FormControl> */}
              </Grid>
            </Grid>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container>
                <Grid item className={classes.iconWrapper}>
                  <Icon glyph={RoleIcon} size={18} />
                </Grid>
                <Grid item className={classes.fullWidth}>
                  <Typography
                    className={cx(classes.formText, classes.formFieldGroup)}
                    onClick={() => {
                      this.setState({
                        isEditingFrom: true,
                        isEditingTo: false,
                      });
                    }}
                  >
                    {format(model.from, 'MMMM, dd')}
                  </Typography>
                  <Typography
                    className={cx(classes.formText, classes.formFieldGroup)}
                    onClick={() => {
                      this.setState({
                        isEditingFrom: false,
                        isEditingTo: true,
                      });
                    }}
                  >
                    {format(model.to, 'MMMM, dd')}
                  </Typography>
                  <BasePicker value={isEditingFrom ? model.from : model.to}>
                    {({
                      date,
                      handleAccept,
                      handleChange,
                      handleClear,
                      handleDismiss,
                      handleSetTodayDate,
                      handleTextFieldChange,
                      pick12hOr24hFormat,
                    }) => (
                      <div
                        style={
                          isEditingFrom || isEditingTo
                            ? { display: 'block' }
                            : { display: 'none' }
                        }
                      >
                        <div className="picker">
                          <Paper style={{ overflow: 'hidden' }}>
                            <Calendar
                              date={date}
                              onChange={d => {
                                if (isEditingFrom) {
                                  this.setState(state => ({
                                    model: {
                                      ...state.model,
                                      from: d,
                                    },
                                    isEditingFrom: false,
                                    isEditingTo: false,
                                  }));
                                } else {
                                  this.setState(state => ({
                                    model: {
                                      ...state.model,
                                      to: d,
                                    },
                                    isEditingFrom: false,
                                    isEditingTo: false,
                                  }));
                                }
                              }}
                              leftArrowIcon={<LeftArrowIcon />}
                              rightArrowIcon={<RightArrowIcon />}
                            />
                          </Paper>
                        </div>
                      </div>
                    )}
                  </BasePicker>
                </Grid>
              </Grid>
            </MuiPickersUtilsProvider>
            <Grid container className={classes.formFieldGroup}>
              <Grid item className={classes.iconWrapper}>
                <Icon glyph={CaptionIcon} size={18} />
              </Grid>
              <Grid
                item
                className={cx(classes.captionWrapper, classes.fullWidth)}
              >
                {!isEditingCaption ? (
                  <Typography
                    className={classes.formText}
                    onClick={() => {
                      this.setState({ isEditingCaption: true });
                    }}
                  >
                    {model.caption ? model.caption : 'Caption'}
                  </Typography>
                ) : (
                  <Grid container>
                    <Grid item xs={9}>
                      <FormControl fullWidth>
                        <Input
                          id="caption"
                          name="caption"
                          multiline
                          rows={4}
                          value={model.caption}
                          classes={{
                            input: classes.formInput,
                            formControl: classes.formInputWrapper,
                          }}
                          onChange={this.handleChange}
                          disableUnderline
                          fullWidth
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <IconButton
                        className={classes.iconButton}
                        onClick={() => {
                          this.setState(() => ({
                            isEditingCaption: false,
                          }));
                        }}
                      >
                        <DoneIcon />
                      </IconButton>
                      <IconButton
                        className={classes.iconButton}
                        onClick={() => {
                          this.setState(state => ({
                            model: {
                              ...state.model,
                              caption: '',
                            },
                            isEditingCaption: false,
                          }));
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid container className={classes.formFieldGroup}>
              <Grid item className={classes.iconWrapper}>
                <Icon glyph={AddPhotoIcon} size={18} />
              </Grid>
              <Grid item>
                <Dropzone
                  className={classes.dropzone}
                  ref={this.dropzoneRef}
                  accept="image/*"
                  // onDrop={this.onDrop}
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
            <Grid container className={classes.formFieldGroup}>
              <Grid item className={classes.iconWrapper}>
                <Icon glyph={RoleIcon} size={18} />
              </Grid>
              <Grid item className={classes.alignSelfCenter}>
                <Typography className={classes.pinLabel}>
                  Pin to Profile
                </Typography>
              </Grid>
              <Grid item>
                <Checkbox
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checkboxChecked,
                  }}
                  color="default"
                  checked={model.pinToProfile}
                  onChange={this.handleCheckChange}
                />
              </Grid>
            </Grid>
          </div>
        </div>
        <div
          className={cx(classes.roleRoot, {
            [classes.activeRoleRoot]: activeSection === 'role',
          })}
        >
          <div className={classes.topline}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Button
                  className={classes.backButton}
                  onClick={() => {
                    this.setState({ activeSection: 'main' });
                  }}
                >
                  <ArrowBackIcon />
                  &nbsp;&nbsp;&nbsp;&nbsp;Role
                </Button>
              </Grid>
            </Grid>
          </div>
          <div className={classes.roleSection}>
            <Typography className={classes.roleLabel}>MY ROLES</Typography>
            {roles && roles.length ? (
              <React.Fragment>
                {roles.map(r => (
                  <ListItem
                    className={classes.resultItem}
                    key={generate()}
                    onClick={() =>
                      this.setState(state => ({
                        model: {
                          ...state.model,
                          role: r,
                        },
                        filteredRoles: [],
                        activeSection: 'main',
                      }))
                    }
                  >
                    <ListItemText
                      classes={{ primary: classes.resultText }}
                      primary={r}
                    />
                  </ListItem>
                ))}
              </React.Fragment>
            ) : null}
            {isEditingRole && (
              <Grid container>
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <Input
                      id="newRole"
                      name="newRole"
                      placeholder="New Role"
                      value={newRole}
                      classes={{
                        input: classes.formInput,
                        formControl: classes.formInputWrapper,
                      }}
                      disableUnderline
                      fullWidth
                      onChange={e => {
                        e.persist();
                        this.setState(
                          {
                            newRole: e.target.value,
                          },
                          () => {
                            this.debouncedSearch(e.target.name, e.target.value);
                          }
                        );
                      }}
                    />
                    {filteredRoles.length ? (
                      <div className={classes.searchResultList}>
                        {filteredRoles.map(r => (
                          <ListItem
                            className={classes.resultItem}
                            key={generate()}
                            onClick={() =>
                              this.setState(state => ({
                                ...state,
                                newRole: r,
                                filteredRoles: [],
                              }))
                            }
                          >
                            <ListItemText
                              classes={{ primary: classes.resultText }}
                              primary={r}
                            />
                          </ListItem>
                        ))}
                      </div>
                    ) : null}
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <IconButton
                    className={classes.iconButton}
                    onClick={() => {
                      this.setState(state => ({
                        ...state,
                        roles: [...state.roles, state.newRole],
                        newRole: '',
                        isEditingRole: false,
                      }));
                    }}
                  >
                    <DoneIcon />
                  </IconButton>
                  <IconButton
                    className={classes.iconButton}
                    onClick={() => {
                      this.setState({
                        newRole: '',
                        isEditingRole: false,
                      });
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Grid>
              </Grid>
            )}
            <Button
              className={classes.addRoleButton}
              color="primary"
              onClick={() => this.setState({ isEditingRole: true })}
            >
              + Add new role
            </Button>
          </div>
        </div>
        <div
          className={cx(classes.roleRoot, {
            [classes.activeRoleRoot]: activeSection === 'coworker',
          })}
        >
          <div className={classes.topline}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item xs={2}>
                <Button
                  className={classes.backButton}
                  onClick={() => {
                    this.setState({ activeSection: 'main' });
                  }}
                >
                  <ArrowBackIcon />
                </Button>
              </Grid>
              <Grid item xs={10}>
                <FormControl fullWidth>
                  <Input
                    id="newUser"
                    name="newUser"
                    placeholder="Add Coworkers"
                    value={newUser}
                    classes={{
                      input: classes.coworkerInput,
                    }}
                    disableUnderline
                    fullWidth
                    onChange={this.handleChange}
                  />
                </FormControl>
              </Grid>
            </Grid>
            {newUser && users.size > 0 ? (
              <div className={classes.searchCoworkerList}>
                {users.map(u => (
                  <ListItem
                    className={classes.userResultItem}
                    key={generate()}
                    onClick={() =>
                      this.setState(state => ({
                        ...state,
                        model: {
                          ...state.model,
                          coworkers: [...state.model.coworkers, u.toJS()],
                        },
                        newUser: '',
                      }))
                    }
                  >
                    <Avatar
                      alt={`${u.get('firstName')} ${u.get('lastName')}`}
                      src={u.getIn(['profile', 'avatar'])}
                    />
                    <ListItemText
                      primary={`${u.get('firstName')} ${u.get('lastName')}`}
                      secondary={u.get('email')}
                      classes={{
                        primary: classes.resultText,
                        secondary: classes.resultDateText,
                      }}
                    />
                  </ListItem>
                ))}
              </div>
            ) : null}
            {newUser && users.size === 0 ? (
              <div className={classes.searchCoworkerList}>
                <Typography className={classes.emptyResultText}>
                  Don’t see who you’re looking for?
                  <br />
                  Enter their email address &amp; invite them to join jolly
                </Typography>
              </div>
            ) : null}
          </div>
          <div className={classes.roleSection}>
            <Typography className={classes.roleLabel}>
              ADDED COWORKERS
            </Typography>
            <List className={classes.coworkersList}>
              {model.coworkers.map(c => (
                <ListItem className={classes.coworkerItem} key={generate()}>
                  <Avatar
                    alt={`${get(c, ['firstName'])} ${get(c, ['lastName'])}`}
                    src={get(c, ['profile', 'avatar'])}
                  />
                  <ListItemText
                    primary={`${get(c, ['firstName'])} ${get(c, ['lastName'])}`}
                    secondary={get(c, ['email'])}
                    classes={{
                      primary: classes.resultText,
                      secondary: classes.resultDateText,
                    }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => {
                        const newCoworkers = this.state.model.coworkers.filter(
                          i => get(i, ['id']) !== get(c, ['id'])
                        );
                        this.setState(state => ({
                          ...state,
                          model: {
                            ...state.model,
                            coworkers: newCoworkers,
                          },
                        }));
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(MobileWorkForm);
