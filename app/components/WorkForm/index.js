// @flow

import React, { Component } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, InlineDatePicker } from 'material-ui-pickers';
import { debounce, get } from 'lodash-es';
import { format } from 'date-fns';
import { generate } from 'shortid';

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
import FormHelperText from '@material-ui/core/FormHelperText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import ClearIcon from '@material-ui/icons/Clear';
import LeftArrowIcon from '@material-ui/icons/KeyboardArrowLeft';
import RightArrowIcon from '@material-ui/icons/KeyboardArrowRight';

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
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
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
    padding: '40px 70px 200px 70px',
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
    padding: 15,
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
  roleWrapper: {
    width: 307,
  },
  captionWrapper: {
    width: 228,
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
  userResultItem: {
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
  coworkersList: {
    marginTop: 10,
  },
  coworkerItem: {
    paddingLeft: 0,
    paddingRight: 0,
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
    from: Date,
    to: Date,
    caption: string,
    pinToProfile: boolean,
    coworkers: Array,
  },
  newUser: string,
  filteredWorks: Array<Object>,
  filteredRoles: Array<string>,
};

class WorkForm extends Component<Props, State> {
  state = {
    model: {
      title: '',
      role: '',
      from: new Date(),
      to: new Date(),
      caption: '',
      pinToProfile: true,
      coworkers: [],
    },
    newUser: '',
    filteredWorks: [],
    filteredRoles: [],
  };
  // onDrop = async (accepted: Array<Object>) => {
  //   const promises = accepted.map(this.setupReader);
  //   const data = await Promise.all(promises);
  //   this.props.uploadPhoto(data);
  // };
  debouncedSearch = debounce((name, value) => {
    switch (name) {
      case 'title': {
        const filteredWorks = this.props.works
          .toJS()
          .filter(
            w => w.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
          );
        this.setState({ filteredWorks });
        break;
      }
      case 'role': {
        let filteredRoles = this.props.roles
          .toJS()
          .filter(r => r.name.toLowerCase().indexOf(value.toLowerCase()) !== -1)
          .map(r => r.name);
        if (filteredRoles.length === 0) {
          filteredRoles = ROLES.filter(
            r => r.toLowerCase().indexOf(value.toLowerCase()) !== -1
          );
        }
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
    const { model, newUser, filteredWorks, filteredRoles } = this.state;
    return (
      <div className={classes.root}>
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
                value={model.title}
                classes={{
                  input: classes.titleInput,
                  underline: classes.titleInputUnderline,
                  formControl: classes.titleWrapper,
                }}
                onChange={this.handleChange}
                autoFocus
              />
              {filteredWorks.length ? (
                <div className={classes.searchResultList}>
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
                </div>
              ) : null}
            </FormControl>
          </div>
        </div>
        <div className={classes.formSection}>
          <Grid container>
            <Grid item xs={8}>
              <Grid container className={classes.formFieldGroup}>
                <Grid item className={classes.iconWrapper}>
                  <Icon glyph={RoleIcon} size={18} />
                </Grid>
                <Grid item className={classes.roleWrapper}>
                  <FormControl fullWidth>
                    <Input
                      id="role"
                      name="role"
                      placeholder="Add Role"
                      value={model.role}
                      classes={{
                        input: classes.formInput,
                        formControl: classes.formInputWrapper,
                      }}
                      disableUnderline
                      fullWidth
                      onChange={this.handleChange}
                    />
                    {filteredRoles.length ? (
                      <div className={classes.searchResultList}>
                        {filteredRoles.map(r => (
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
              </Grid>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid
                  container
                  alignItems="center"
                  className={classes.formFieldGroup}
                >
                  <Grid item className={classes.iconWrapper}>
                    <Icon glyph={RoleIcon} size={18} />
                  </Grid>
                  <Grid item>
                    <InlineDatePicker
                      value={model.from}
                      onChange={date =>
                        this.setState(state => ({
                          model: {
                            ...state.model,
                            from: date,
                          },
                        }))
                      }
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
                      value={model.to}
                      onChange={date =>
                        this.setState(state => ({
                          model: {
                            ...state.model,
                            to: date,
                          },
                        }))
                      }
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
                <Grid item className={classes.iconWrapper}>
                  <Icon glyph={CaptionIcon} size={18} />
                </Grid>
                <Grid item className={classes.captionWrapper}>
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
              <Grid container className={classes.formFieldGroup}>
                <Grid item className={classes.iconWrapper}>
                  <div style={{ width: 18 }} />
                </Grid>
                <Grid item className={classes.alignSelfCenter}>
                  {error && (
                    <FormHelperText className={classes.fieldMargin} error>
                      {error}
                    </FormHelperText>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={this.registerWorkExperience}
                    disabled={isLoading}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid container className={classes.formFieldGroup}>
                <Grid item className={classes.iconWrapper}>
                  <Icon glyph={PeopleIcon} size={18} />
                </Grid>
                <Grid item className={classes.fullWidth}>
                  <FormControl fullWidth>
                    <Input
                      id="newUser"
                      name="newUser"
                      placeholder="Add Coworkers"
                      value={newUser}
                      classes={{
                        input: classes.formInput,
                        formControl: classes.formInputWrapper,
                      }}
                      disableUnderline
                      fullWidth
                      onChange={this.handleChange}
                    />
                    {newUser && users.size > 0 ? (
                      <div className={classes.searchResultList}>
                        {users.map(u => (
                          <ListItem
                            className={classes.userResultItem}
                            key={generate()}
                            onClick={() =>
                              this.setState(state => ({
                                ...state,
                                model: {
                                  ...state.model,
                                  coworkers: [
                                    ...state.model.coworkers,
                                    u.toJS(),
                                  ],
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
                              primary={`${u.get('firstName')} ${u.get(
                                'lastName'
                              )}`}
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
                  </FormControl>
                  <List className={classes.coworkersList}>
                    {model.coworkers.map(c => (
                      <ListItem
                        className={classes.coworkerItem}
                        key={generate()}
                      >
                        <Avatar
                          alt={`${get(c, ['firstName'])} ${get(c, [
                            'lastName',
                          ])}`}
                          src={get(c, ['profile', 'avatar'])}
                        />
                        <ListItemText
                          primary={`${get(c, ['firstName'])} ${get(c, [
                            'lastName',
                          ])}`}
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
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(WorkForm);
