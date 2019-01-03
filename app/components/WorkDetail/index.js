// @flow

import React, { Component } from 'react';
import { format } from 'date-fns';
import { generate } from 'shortid';
import { debounce, groupBy, toPairs, fromPairs, zip } from 'lodash-es';
import cx from 'classnames';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

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
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import User from 'components/User';
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
    [theme.breakpoints.down('xs')]: {
      height: 170,
      display: 'none',
    },
    '&:first-child': {
      display: 'block',
    },
  },
  addCoworkerButton: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'none',
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'inline-flex',
    },
  },
  alignRight: {
    textAlign: 'right',
  },
  searchBox: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  roleRoot: {
    position: 'fixed',
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
  topline: {
    backgroundColor: theme.palette.primary.main,
  },
  backButton: {
    color: theme.palette.common.white,
  },
  mobileSearchResultList: {
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
  coworkerInput: {
    fontSize: 14,
    fontWeight: 500,
    color: theme.palette.common.white,
    padding: '14px 20px',
    boxSizing: 'border-box',
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
  work: Object,
  users: Object,
  relatedUsers: Object,
  endorsements: Object,
  endorsers: Object,
  classes: Object,
  searchUsers: Function,
  requestAddCoworker: Function,
  requestVerifyCoworker: Function,
  requestEndorseUser: Function,
};

type State = {
  newUser: string,
  photoIndex: number,
  isGalleryOpen: boolean,
  activeSection: string,
};

class WorkDetail extends Component<Props, State> {
  state = {
    newUser: '',
    photoIndex: 0,
    isGalleryOpen: false,
    activeSection: 'main',
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
    }
  };
  render() {
    const {
      work,
      users,
      relatedUsers,
      endorsements,
      endorsers,
      classes,
    } = this.props;
    const { newUser, photoIndex, isGalleryOpen, activeSection } = this.state;
    const photo1 = work.getIn(['photos', 0]);
    const photo2 = work.getIn(['photos', 1]);
    const photo3 = work.getIn(['photos', 2]);
    const photos = work.get('photos').toJS();
    const usedQualities = endorsements
      .map(endorsement => endorsement.get('quality'))
      .toJS();
    const qualityNames = {
      hardest_worker: 'Hardest Worker',
      most_helpful: 'Most Helpful',
      most_friendly: 'Most Friendly',
      team_player: 'Team Player',
    };
    const result = toPairs(groupBy(endorsers.toJS(), 'quality'));
    const groupedEndorsers = result.map(currentItem =>
      fromPairs(zip(['quality', 'users'], currentItem))
    );
    return (
      <div className={classes.root}>
        <div className={classes.banner}>
          <Grid container>
            {photo1 && (
              <Grid
                item
                className={classes.photo}
                style={{ backgroundImage: `url('${photo1}')` }}
                onClick={() => {
                  this.setState({
                    photoIndex: 0,
                    isGalleryOpen: true,
                  });
                }}
              />
            )}
            {photo2 && (
              <Grid
                item
                className={classes.photo}
                style={{ backgroundImage: `url('${photo2}')` }}
                onClick={() => {
                  this.setState({
                    photoIndex: 1,
                    isGalleryOpen: true,
                  });
                }}
              />
            )}
            {photo3 && (
              <Grid
                item
                className={classes.photo}
                style={{ backgroundImage: `url('${photo3}')` }}
                onClick={() => {
                  this.setState({
                    photoIndex: 2,
                    isGalleryOpen: true,
                  });
                }}
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
                    <b>{work.get('verifiers').size}</b>
                    &nbsp;Verifications
                  </Typography>
                  <Grid
                    container
                    className={classes.valueFieldWithNoPadding}
                    spacing={8}
                  >
                    {work.get('verifiers').map(verifier => (
                      <Grid item key={generate()}>
                        <Avatar
                          className={classes.avatar}
                          src={verifier.getIn(['profile', 'avatar'])}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
              <Grid container className={classes.valueFieldWithNoPadding}>
                <Grid item className={classes.iconWrapper}>
                  <Icon glyph={CaptionIcon} size={18} />
                </Grid>
                <Grid item className={classes.fullWidth}>
                  <Typography className={classes.label}>
                    <b>{endorsers.size}</b>
                    &nbsp;Endorsements
                  </Typography>
                  {groupedEndorsers.map(group => (
                    <React.Fragment key={generate()}>
                      <Typography className={classes.endorseFactor}>
                        {qualityNames[group.quality]}
                      </Typography>
                      <Grid
                        container
                        className={classes.endorseUsers}
                        spacing={8}
                      >
                        {group.users.map(user => (
                          <Grid item key={generate()}>
                            <Avatar
                              className={classes.avatar}
                              src={user.from.profile.avatar}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={5}>
              <Grid container alignItems="center">
                <Grid item className={classes.iconWrapper}>
                  <Icon glyph={PeopleIcon} size={18} />
                </Grid>
                <Grid item>
                  <Typography className={classes.label}>
                    <b>{work.get('coworkers').size}</b>
                    &nbsp;coworkers
                  </Typography>
                </Grid>
                <Grid
                  item
                  className={cx(classes.fullWidth, classes.alignRight)}
                >
                  <Button
                    className={classes.addCoworkerButton}
                    color="primary"
                    onClick={() => this.setState({ activeSection: 'coworker' })}
                  >
                    + Add Coworkers
                  </Button>
                </Grid>
              </Grid>
              <Grid container className={classes.valueField}>
                <Grid item xs={12}>
                  <FormControl fullWidth className={classes.searchBox}>
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
                            onClick={() => {
                              this.props.requestAddCoworker(
                                work.get('id'),
                                u.get('id')
                              );
                              this.setState({ newUser: '' });
                            }}
                          >
                            <Avatar
                              alt={`${u.get('firstName')} ${u.get('lastName')}`}
                              src={u.getIn(['profile', 'avatar'])}
                              className={classes.avatar}
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
                    {relatedUsers &&
                      relatedUsers.map(user => {
                        const isEndorsed = endorsements
                          .toJS()
                          .filter(
                            endorsement =>
                              endorsement.to === user.getIn(['user', 'id'])
                          );
                        return (
                          <User
                            key={generate()}
                            user={user.get('user')}
                            work={work}
                            type={user.get('type')}
                            verifyCoworker={this.props.requestVerifyCoworker}
                            requestEndorseUser={this.props.requestEndorseUser}
                            endorsed={isEndorsed.length > 0}
                            endorsedQuality={
                              isEndorsed.length > 0 ? isEndorsed[0].quality : ''
                            }
                            usedQualities={usedQualities}
                          />
                        );
                      })}
                  </List>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
              <div className={classes.mobileSearchResultList}>
                {users.map(u => (
                  <ListItem
                    className={classes.userResultItem}
                    key={generate()}
                    onClick={() => {
                      this.props.requestAddCoworker(
                        work.get('id'),
                        u.get('id')
                      );
                      this.setState({
                        newUser: '',
                        activeSection: 'main',
                      });
                    }}
                  >
                    <Avatar
                      alt={`${u.get('firstName')} ${u.get('lastName')}`}
                      src={u.getIn(['profile', 'avatar'])}
                      className={classes.avatar}
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
              <div className={classes.mobileSearchResultList}>
                <Typography className={classes.emptyResultText}>
                  Don’t see who you’re looking for?
                  <br />
                  Enter their email address &amp; invite them to join jolly
                </Typography>
              </div>
            ) : null}
          </div>
          <div className={classes.roleSection} />
        </div>
        {isGalleryOpen && (
          <Lightbox
            mainSrc={photos[photoIndex]}
            nextSrc={photos[(photoIndex + 1) % photos.length]}
            prevSrc={photos[(photoIndex + photos.length - 1) % photos.length]}
            onCloseRequest={() => this.setState({ isGalleryOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + photos.length - 1) % photos.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % photos.length,
              })
            }
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(WorkDetail);
