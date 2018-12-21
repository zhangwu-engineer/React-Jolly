// @flow

import React, { Component } from 'react';
import { format } from 'date-fns';
import { generate } from 'shortid';
import { debounce, get } from 'lodash-es';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';

import Icon from 'components/Icon';
import PeopleIcon from 'images/sprite/people.svg';
import CaptionIcon from 'images/sprite/caption.svg';

import Bg from './bg.png';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    maxWidth: 1063,
    margin: '0 auto',
  },
  banner: {
    position: 'relative',
    height: 308,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundImage: `url(${Bg})`,
    [theme.breakpoints.down('xs')]: {
      height: 170,
    },
  },
  bannerContent: {
    position: 'absolute',
    left: 45,
    bottom: 35,
    [theme.breakpoints.down('xs')]: {
      left: 30,
      bottom: 30,
    },
  },
  role: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.palette.common.white,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: theme.palette.common.white,
  },
  date: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.palette.common.white,
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
    color: theme.palette.common.white,
    fontSize: 12,
    padding: 8,
    textTransform: 'none',
    position: 'absolute',
    right: 20,
    top: 20,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.34)',
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  smallEditButton: {
    display: 'none',
    position: 'absolute',
    right: 10,
    top: 10,
    color: theme.palette.common.white,
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
    },
  },
  editIcon: {
    fontSize: 14,
  },
  pin: {
    position: 'absolute',
    right: 15,
    bottom: 10,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  workDetail: {
    padding: 35,
    minHeight: 'calc(100vh - 215px)',
    [theme.breakpoints.down('xs')]: {
      padding: 20,
    },
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
    paddingLeft: 0,
    fontSize: 14,
    color: '#434343',
  },
  fullWidth: {
    flex: 1,
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
  verified: {
    fontSize: 12,
    fontWeight: 600,
    color: '#a7a7a7',
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: '#363636',
    paddingTop: 15,
    paddingBottom: 15,
  },
  valueField: {
    paddingLeft: 30,
    marginBottom: 50,
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 0,
      marginBottom: 25,
    },
  },
  valueFieldWithNoPadding: {
    marginBottom: 35,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 20,
    },
  },
  avatar: {
    backgroundColor: '#afafaf',
  },
  endorseFactor: {
    fontSize: 14,
    fontWeight: 500,
    color: '#afafaf',
    paddingBottom: 10,
  },
  endorseUsers: {
    marginBottom: 20,
  },
  photoContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    height: 308,
  },
  photo: {
    flex: 1,
    height: 308,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
});

type Props = {
  work: Object,
  users: Object,
  classes: Object,
  searchUsers: Function,
};

type State = {
  model: {
    coworkers: Array,
  },
  newUser: string,
};

class WorkDetail extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.work && !prevState.model.coworkers) {
      return {
        model: {
          coworkers: nextProps.work.get('coworkers').toJS(),
        },
        newUser: '',
      };
    }
    return null;
  }
  state = {
    model: {
      coworkers: undefined,
    },
    newUser: '',
  };
  debouncedSearch = debounce((name, value) => {
    switch (name) {
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
  render() {
    const { work, users, classes } = this.props;
    const { model, newUser } = this.state;
    const photo1 = work.getIn(['photos', 0]);
    const photo2 = work.getIn(['photos', 1]);
    const photo3 = work.getIn(['photos', 2]);
    return (
      <div className={classes.root}>
        <div className={classes.banner}>
          <Grid container>
            {photo1 && (
              <Grid
                item
                className={classes.photo}
                style={{ backgroundImage: `url('${photo1}')` }}
              />
            )}
            {photo2 && (
              <Grid
                item
                className={classes.photo}
                style={{ backgroundImage: `url('${photo2}')` }}
              />
            )}
            {photo3 && (
              <Grid
                item
                className={classes.photo}
                style={{ backgroundImage: `url('${photo3}')` }}
              />
            )}
          </Grid>
          <div className={classes.bannerContent}>
            <Typography className={classes.role}>{work.get('role')}</Typography>
            <Typography className={classes.title}>
              {work.get('title')}
            </Typography>
            <Typography className={classes.date}>
              {`from ${format(new Date(work.get('from')), 'MMM yy')} - ${format(
                new Date(work.get('to')),
                'MMM yy'
              )}`}
            </Typography>
          </div>
          <Button className={classes.editButton}>
            <EditIcon className={classes.editIcon} />
            &nbsp;&nbsp;&nbsp;Edit Job
          </Button>
          <IconButton className={classes.smallEditButton}>
            <EditIcon />
          </IconButton>
          <Switch className={classes.pin} color="default" />
        </div>
        <div className={classes.workDetail}>
          <Grid container>
            <Grid item xs={12} lg={7}>
              <Grid container>
                <Grid item className={classes.iconWrapper}>
                  <Icon glyph={CaptionIcon} size={18} />
                </Grid>
                <Grid item className={classes.fullWidth}>
                  <Typography className={classes.label}>Caption</Typography>
                </Grid>
              </Grid>
              <Grid container className={classes.valueField}>
                <Grid item xs={12}>
                  <Typography>{work.get('caption')}</Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item className={classes.iconWrapper}>
                  <Icon glyph={CaptionIcon} size={18} />
                </Grid>
                <Grid item className={classes.fullWidth}>
                  <Typography className={classes.label}>
                    <b>14</b>
                    &nbsp;Verifications
                  </Typography>
                  <Grid
                    container
                    className={classes.valueFieldWithNoPadding}
                    spacing={8}
                  >
                    <Grid item>
                      <Avatar className={classes.avatar} />
                    </Grid>
                    <Grid item>
                      <Avatar className={classes.avatar} />
                    </Grid>
                    <Grid item>
                      <Avatar className={classes.avatar} />
                    </Grid>
                    <Grid item>
                      <Avatar className={classes.avatar} />
                    </Grid>
                    <Grid item>
                      <Avatar className={classes.avatar} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container className={classes.valueFieldWithNoPadding}>
                <Grid item className={classes.iconWrapper}>
                  <Icon glyph={CaptionIcon} size={18} />
                </Grid>
                <Grid item className={classes.fullWidth}>
                  <Typography className={classes.label}>
                    <b>3</b>
                    &nbsp;Endorsements
                  </Typography>
                  <Typography className={classes.endorseFactor}>
                    Hardest Working
                  </Typography>
                  <Grid container className={classes.endorseUsers} spacing={8}>
                    <Grid item>
                      <Avatar className={classes.avatar} />
                    </Grid>
                    <Grid item>
                      <Avatar className={classes.avatar} />
                    </Grid>
                    <Grid item>
                      <Avatar className={classes.avatar} />
                    </Grid>
                  </Grid>
                  <Typography className={classes.endorseFactor}>
                    Friendliest
                  </Typography>
                  <Grid container className={classes.endorseUsers} spacing={8}>
                    <Grid item>
                      <Avatar className={classes.avatar} />
                    </Grid>
                    <Grid item>
                      <Avatar className={classes.avatar} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={5}>
              <Grid container>
                <Grid item className={classes.iconWrapper}>
                  <Icon glyph={PeopleIcon} size={18} />
                </Grid>
                <Grid item className={classes.fullWidth}>
                  <Typography className={classes.label}>
                    <b>{model.coworkers && model.coworkers.length}</b>
                    &nbsp;coworkers
                  </Typography>
                </Grid>
              </Grid>
              <Grid container className={classes.valueField}>
                <Grid item xs={12}>
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
                    {model.coworkers &&
                      model.coworkers.map(c => (
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
                            <ListItemText
                              primary="Verified"
                              classes={{
                                primary: classes.verified,
                              }}
                            />
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

export default withStyles(styles)(WorkDetail);
