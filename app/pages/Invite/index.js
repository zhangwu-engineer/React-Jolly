// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { debounce, capitalize } from 'lodash-es';
import { generate } from 'shortid';
import storage from 'store';
import CONFIG from 'conf';
import { matchPath } from 'react-router';

import { withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
// import MoreIcon from '@material-ui/icons/MoreVert';
import ClearIcon from '@material-ui/icons/Clear';

import { history } from 'components/ConnectedRouter';
import WorkDetail from 'components/WorkDetail';
import Preloader from 'components/Preloader';
import Link from 'components/Link';
import BaseModal from 'components/BaseModal';
import SocialButton from 'components/SocialButton';

import LogoWhite from 'images/logo-white.png';

import ROLES from 'enum/roles';

import { requestSocialLogin } from 'containers/App/sagas';
import saga, {
  reducer,
  requestWork,
  requestWorkRelatedUsers,
  requestEndorsements,
  requestEndorsers,
  requestInviteInformation,
  requestAcceptInvite,
} from 'containers/Work/sagas';
import injectSagas from 'utils/injectSagas';

const styles = theme => ({
  header: {
    backgroundColor: theme.palette.primary.main,
  },
  headerInner: {
    height: 70,
    maxWidth: 1063,
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      height: 45,
    },
  },
  button: {
    color: theme.palette.common.white,
    textTransform: 'none',
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.palette.common.white,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  logo: {
    width: 70,
    height: 45,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    padding: 20,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
  },
  footerInner: {
    textAlign: 'center',
  },
  inviteHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.palette.common.white,
    textAlign: 'center',
  },
  inviteText: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.palette.common.white,
    textAlign: 'center',
  },
  saveButton: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'none',
    display: 'block',
    margin: '10px auto',
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  skipLink: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.palette.common.white,
    textTransform: 'none',
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  roleModal: {
    width: 380,
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100% + 2px)',
      height: '100%',
      borderRadius: 0,
    },
  },
  signupModal: {
    width: 380,
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100% - 30px)',
    },
  },
  roleModalHeader: {
    position: 'relative',
    backgroundColor: theme.palette.primary.main,
    padding: '40px 40px 15px 40px',
  },
  roleModalTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: theme.palette.common.white,
    textAlign: 'left',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    color: theme.palette.common.white,
  },
  roleModalContent: {
    padding: '30px 40px 30px 40px',
    textAlign: 'right',
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
    '&:hover': {
      backgroundColor: '#efefef',
    },
  },
  resultText: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.25,
    letterSpacing: '0.4px',
    color: '#4a4a4a',
  },
  saveRoleButton: {
    marginTop: 100,
  },
  signupModalContent: {
    padding: '40px 60px 50px 60px',
  },
  signupButton: {
    textTransform: 'none',
    width: '100%',
    marginBottom: 15,
  },
  signupTitle: {
    fontSize: 18,
    marginBottom: 30,
  },
  fbButton: {
    backgroundColor: theme.palette.common.white,
    color: '#3a5997',
    fontSize: 14,
    fontWeight: 500,
    width: '100%',
    border: '1px solid #3a5997',
    padding: '7px 16px',
    marginBottom: 15,
    '&:hover': {
      backgroundColor: '#3a5997',
    },
  },
  linkedInButton: {
    backgroundColor: theme.palette.common.white,
    color: '#0077b5',
    fontSize: 14,
    fontWeight: 500,
    width: '100%',
    border: '1px solid #0077b5',
    padding: '7px 16px',
    marginBottom: 15,
    '&:hover': {
      backgroundColor: '#0077b5',
    },
  },
  linkText: {
    fontSize: 16,
    fontWeight: 500,
    color: '#3c3e43',
  },
  link: {
    fontSize: 16,
    fontWeight: 500,
    textDecoration: 'none',
  },
});

type Props = {
  user: Object,
  work: Object,
  isWorkLoading: boolean,
  workError: string,
  invite: Object,
  isInviteLoading: boolean,
  inviteError: string,
  isAcceptInviteLoading: boolean,
  acceptInviteError: string,
  relatedUsers: Object,
  endorsers: Object,
  match: Object,
  classes: Object,
  requestWorkRelatedUsers: Function,
  requestEndorsements: Function,
  requestEndorsers: Function,
  requestInviteInformation: Function,
  requestSocialLogin: Function,
  requestWork: Function,
  requestAcceptInvite: Function,
};

type State = {
  isRoleOpen: boolean,
  isSignupOpen: boolean,
  role: string,
  filteredRoles: Array<string>,
};

class InvitePage extends Component<Props, State> {
  state = {
    isRoleOpen: false,
    isSignupOpen: false,
    role: '',
    filteredRoles: [],
  };
  componentDidMount() {
    const {
      match: {
        url,
        params: { token },
      },
    } = this.props;
    const {
      params: { slug, eventSlug },
    } = matchPath(url, {
      path: '/f/:slug/e/:eventSlug',
    });
    this.props.requestWork({ slug: eventSlug, userSlug: slug });
    if (token) {
      this.props.requestInviteInformation(token);
    }
  }
  componentDidUpdate(prevProps: Props) {
    const {
      work,
      isWorkLoading,
      workError,
      isInviteLoading,
      inviteError,
      isAcceptInviteLoading,
      acceptInviteError,
      user,
      match: { url },
    } = this.props;
    const {
      params: { slug, eventSlug },
    } = matchPath(url, {
      path: '/f/:slug/e/:eventSlug',
    });
    if (
      prevProps.isInviteLoading &&
      !isInviteLoading &&
      inviteError === 'invalid token'
    ) {
      history.push(`/f/${slug}/e/${eventSlug}/work`);
    }
    if (prevProps.isWorkLoading && !isWorkLoading && !workError) {
      this.props.requestWorkRelatedUsers(work.get('id'));
      this.props.requestEndorsers(
        work.getIn(['work', 'slug']),
        work.getIn(['user', 'slug'])
      );
    }
    if (
      prevProps.isAcceptInviteLoading &&
      !isAcceptInviteLoading &&
      !acceptInviteError
    ) {
      history.push('/edit');
    }
    if (!prevProps.user && user) {
      storage.set('invite', null);
      history.push('/edit');
    }
  }
  closeRoleModal = () => {
    this.setState({ isRoleOpen: false });
  };
  closeSignupModal = () => {
    this.setState({ isSignupOpen: false });
  };
  debouncedSearch = debounce((name, value) => {
    switch (name) {
      case 'role': {
        if (value) {
          const filteredRoles = ROLES.filter(
            r => r.toLowerCase().indexOf(value.toLowerCase()) !== -1
          );
          this.setState({ filteredRoles });
        } else {
          this.setState({ filteredRoles: [] });
        }
        break;
      }
      default:
        break;
    }
    if (!value) {
      this.setState({ [name]: '' }, () => {});
    }
  }, 500);
  handleChange = (e: Object) => {
    const { name, value } = e.target;
    this.setState(
      {
        [name]: value,
      },
      () => {
        this.debouncedSearch(name, value);
      }
    );
  };
  handleFBLogin = (user: Object) => {
    const {
      _token: { accessToken },
    } = user;
    const {
      invite,
      work,
      match: {
        params: { token },
      },
    } = this.props;
    const { role } = this.state;
    let inviteData;
    if (invite) {
      inviteData = {
        work: {
          title: work.get('title'),
          role,
          from: work.get('from'),
          to: work.get('to'),
          caption: work.get('caption'),
          pinToProfile: work.get('pinToProfile'),
          photos: work.get('photos'),
          verifiers: [invite.getIn(['tagger', 'userId'])],
          slug: work.get('slug'),
          addMethod: work.get('addMethod'),
        },
        tagger: {
          userId: invite.getIn(['tagger', 'userId']),
        },
        rootWorkId: invite.get('workId'),
        token,
      };
    } else {
      inviteData = {
        work: {
          title: work.get('title'),
          role,
          from: work.get('from'),
          to: work.get('to'),
          caption: work.get('caption'),
          pinToProfile: work.get('pinToProfile'),
          photos: work.get('photos'),
          slug: work.get('slug'),
          addMethod: work.get('addMethod'),
        },
        tagger: {
          userId: work.getIn(['user', 'id']),
        },
      };
    }
    this.props.requestSocialLogin(
      { access_token: accessToken },
      'facebook',
      inviteData
    );
  };

  handleFBLoginFailure = (err: any) => {
    console.log(err); // eslint-disable-line
  };
  handleLinkedInLogin = (user: Object) => {
    const {
      _token: { accessToken },
    } = user;
    const {
      invite,
      work,
      match: {
        params: { token },
      },
    } = this.props;
    const { role } = this.state;
    let inviteData;
    if (invite) {
      inviteData = {
        work: {
          title: work.get('title'),
          role,
          from: work.get('from'),
          to: work.get('to'),
          caption: work.get('caption'),
          pinToProfile: work.get('pinToProfile'),
          photos: work.get('photos'),
          verifiers: [invite.getIn(['tagger', 'userId'])],
          slug: work.get('slug'),
          addMethod: work.get('addMethod'),
        },
        tagger: {
          userId: invite.getIn(['tagger', 'userId']),
        },
        rootWorkId: invite.get('workId'),
        token,
      };
    } else {
      inviteData = {
        work: {
          title: work.get('title'),
          role,
          from: work.get('from'),
          to: work.get('to'),
          caption: work.get('caption'),
          pinToProfile: work.get('pinToProfile'),
          photos: work.get('photos'),
          slug: work.get('slug'),
          addMethod: work.get('addMethod'),
        },
        tagger: {
          userId: work.getIn(['user', 'id']),
        },
      };
    }
    this.props.requestSocialLogin(
      { access_token: accessToken },
      'linkedin',
      inviteData
    );
  };

  handleLinkedInLoginFailure = (err: any) => {
    console.log(err); // eslint-disable-line
  };
  save = () => {
    const {
      invite,
      work,
      match: {
        params: { token },
      },
    } = this.props;
    const { role } = this.state;
    let inviteData = null;
    if (invite) {
      inviteData = {
        work: {
          title: work.get('title'),
          role,
          from: work.get('from'),
          to: work.get('to'),
          caption: work.get('caption'),
          pinToProfile: work.get('pinToProfile'),
          photos: work.get('photos'),
          verifiers: [invite.getIn(['tagger', 'userId'])],
          slug: work.get('slug'),
          addMethod: work.get('addMethod'),
        },
        tagger: {
          userId: invite.getIn(['tagger', 'userId']),
        },
        rootWorkId: invite.get('workId'),
        token,
      };
    } else {
      inviteData = {
        work: {
          title: work.get('title'),
          role,
          from: work.get('from'),
          to: work.get('to'),
          caption: work.get('caption'),
          pinToProfile: work.get('pinToProfile'),
          photos: work.get('photos'),
          slug: work.get('slug'),
          addMethod: work.get('addMethod'),
        },
        tagger: {
          userId: work.getIn(['user', 'id']),
        },
      };
    }
    this.props.requestAcceptInvite(inviteData);
  };
  render() {
    const {
      work,
      workError,
      invite,
      user,
      isInviteLoading,
      inviteError,
      relatedUsers,
      endorsers,
      classes,
      match: {
        url,
        params: { token },
      },
    } = this.props;
    const { isRoleOpen, isSignupOpen, role, filteredRoles } = this.state;
    const {
      params: { slug },
    } = matchPath(url, {
      path: '/f/:slug/e/:eventSlug',
    });
    if (isInviteLoading) {
      return <Preloader />;
    }
    return (
      <React.Fragment>
        <div className={classes.header}>
          <Grid
            className={classes.headerInner}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Button
                className={classes.button}
                component={props => <Link to={`/f/${slug}`} {...props} />}
              >
                <ArrowBackIcon />
                &nbsp;&nbsp;&nbsp;
                <Typography className={classes.backButtonText}>
                  {`${capitalize(
                    work.getIn(['user', 'firstName'])
                  )} ${capitalize(work.getIn(['user', 'lastName']))}`}
                </Typography>
              </Button>
            </Grid>
            <Grid item>
              <Link to="/">
                <img className={classes.logo} src={LogoWhite} alt="logo" />
              </Link>
            </Grid>
            <Grid item style={{ width: 68 }}>
              {/* <IconButton className={classes.button}>
                <MoreIcon />
              </IconButton> */}
            </Grid>
          </Grid>
        </div>
        {work.size > 0 && !workError ? (
          <React.Fragment>
            <WorkDetail
              work={work}
              users={[]}
              relatedUsers={relatedUsers}
              endorsements={fromJS([])}
              endorsers={endorsers}
              displayMode="public"
            />
            <div className={classes.footer}>
              <div className={classes.footerInner}>
                <Typography className={classes.inviteHeaderText}>
                  Did you work this event?
                </Typography>
                {invite && (
                  <Typography className={classes.inviteText}>
                    {`${invite.getIn(['tagger', 'firstName'])} ${invite.getIn([
                      'tagger',
                      'lastName',
                    ])} tagged you as a coworker for this event`}
                  </Typography>
                )}
                <Button
                  className={classes.saveButton}
                  onClick={() => {
                    this.setState({ isRoleOpen: true });
                  }}
                >
                  Yes. Save to my work experience
                </Button>
                <Link to="/" className={classes.skipLink}>
                  Skip for now
                </Link>
              </div>
            </div>
            <BaseModal
              className={classes.roleModal}
              isOpen={isRoleOpen || isSignupOpen}
              onCloseModal={this.closeRoleModal}
            >
              <React.Fragment>
                <div className={classes.roleModalHeader}>
                  <Typography className={classes.roleModalTitle}>
                    {`What type of work did you do at ${work.get('title')}`}
                  </Typography>
                  <IconButton
                    className={classes.closeButton}
                    onClick={() => {
                      this.setState({
                        isRoleOpen: false,
                        isSignupOpen: false,
                      });
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </div>
                <div className={classes.roleModalContent}>
                  <FormControl fullWidth>
                    <Input
                      autoComplete="off"
                      id="role"
                      name="role"
                      placeholder="Add Role"
                      value={role}
                      classes={{
                        input: classes.formInput,
                        formControl: classes.formInputWrapper,
                      }}
                      disableUnderline
                      fullWidth
                      onChange={this.handleChange}
                      onFocus={() => {
                        if (!role) {
                          this.setState({
                            filteredRoles: ROLES,
                          });
                        }
                      }}
                    />
                    {filteredRoles.length ? (
                      <div className={classes.searchResultList}>
                        {filteredRoles.map(r => (
                          <ListItem
                            className={classes.resultItem}
                            key={generate()}
                            onClick={() =>
                              this.setState({
                                role: r,
                                filteredRoles: [],
                              })
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
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.saveRoleButton}
                    disabled={!role}
                    onClick={() => {
                      if (user) {
                        this.setState(
                          {
                            isRoleOpen: false,
                          },
                          () => {
                            this.save();
                          }
                        );
                      } else {
                        this.setState({
                          isRoleOpen: false,
                          isSignupOpen: true,
                        });
                      }
                    }}
                  >
                    Save
                  </Button>
                </div>
              </React.Fragment>
            </BaseModal>
            <BaseModal
              className={classes.signupModal}
              isOpen={isSignupOpen}
              onCloseModal={this.closeSignupModal}
            >
              <div className={classes.signupModalContent}>
                <Typography variant="h6" className={classes.signupTitle}>
                  {invite && invite.get('startFrom') === 'signup'
                    ? 'Sign up to add this job to your free Jolly Profile'
                    : 'Sign in to add this job to your Jolly Profile'}
                </Typography>
                <SocialButton
                  provider="facebook"
                  appId={CONFIG.FACEBOOK.APP_ID}
                  onLoginSuccess={this.handleFBLogin}
                  onLoginFailure={this.handleFBLoginFailure}
                  className={classes.fbButton}
                >
                  Continue with facebook
                </SocialButton>
                <SocialButton
                  provider="linkedin"
                  appId={CONFIG.LINKEDIN.APP_ID}
                  onLoginSuccess={this.handleLinkedInLogin}
                  onLoginFailure={this.handleLinkedInLoginFailure}
                  className={classes.linkedInButton}
                >
                  Continue with linkedin
                </SocialButton>
                {invite ? (
                  <React.Fragment>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.signupButton}
                      onClick={() => {
                        const inviteData = {
                          work: {
                            title: work.get('title'),
                            role,
                            from: work.get('from'),
                            to: work.get('to'),
                            caption: work.get('caption'),
                            pinToProfile: work.get('pinToProfile'),
                            photos: work.get('photos'),
                            verifiers: [invite.getIn(['tagger', 'userId'])],
                            slug: work.get('slug'),
                            addMethod: work.get('addMethod'),
                          },
                          tagger: {
                            userId: invite.getIn(['tagger', 'userId']),
                          },
                          rootWorkId: invite.get('workId'),
                          token,
                        };
                        storage.set('invite', inviteData);
                        if (invite.get('startFrom') === 'signup') {
                          history.push('/');
                        } else {
                          history.push('/email-sign-in');
                        }
                      }}
                    >
                      {invite.get('startFrom') === 'signup'
                        ? 'Sign up with Email'
                        : 'Log in with Email'}
                    </Button>
                    <Typography className={classes.linkText}>
                      {invite.get('startFrom') === 'signup'
                        ? 'Have an Account?'
                        : 'No Account?'}
                      &nbsp;
                      <Link
                        className={classes.link}
                        onClick={() => {
                          const inviteData = {
                            work: {
                              title: work.get('title'),
                              role,
                              from: work.get('from'),
                              to: work.get('to'),
                              caption: work.get('caption'),
                              pinToProfile: work.get('pinToProfile'),
                              photos: work.get('photos'),
                              verifiers: [invite.getIn(['tagger', 'userId'])],
                              slug: work.get('slug'),
                              addMethod: work.get('addMethod'),
                            },
                            tagger: {
                              userId: invite.getIn(['tagger', 'userId']),
                            },
                            rootWorkId: invite.get('workId'),
                            token,
                          };
                          storage.set('invite', inviteData);
                          if (invite.get('startFrom') === 'signup') {
                            history.push('/sign-in');
                          } else {
                            history.push('/');
                          }
                        }}
                      >
                        {invite.get('startFrom') === 'signup'
                          ? 'Sign in'
                          : 'Sign up'}
                      </Link>
                    </Typography>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.signupButton}
                      onClick={() => {
                        const inviteData = {
                          work: {
                            title: work.get('title'),
                            role,
                            from: work.get('from'),
                            to: work.get('to'),
                            caption: work.get('caption'),
                            pinToProfile: work.get('pinToProfile'),
                            photos: work.get('photos'),
                            slug: work.get('slug'),
                            addMethod: work.get('addMethod'),
                          },
                          tagger: {
                            userId: work.getIn(['user', 'id']),
                          },
                        };
                        storage.set('invite', inviteData);
                        history.push('/email-sign-in');
                      }}
                    >
                      Log in with Email
                    </Button>
                    <Typography className={classes.linkText}>
                      No Account?&nbsp;
                      <Link
                        className={classes.link}
                        onClick={() => {
                          const inviteData = {
                            work: {
                              title: work.get('title'),
                              role,
                              from: work.get('from'),
                              to: work.get('to'),
                              caption: work.get('caption'),
                              pinToProfile: work.get('pinToProfile'),
                              photos: work.get('photos'),
                              slug: work.get('slug'),
                              addMethod: work.get('addMethod'),
                            },
                            tagger: {
                              userId: work.getIn(['user', 'id']),
                            },
                          };
                          storage.set('invite', inviteData);
                          history.push('/');
                        }}
                      >
                        Sign up
                      </Link>
                    </Typography>
                  </React.Fragment>
                )}
              </div>
            </BaseModal>
          </React.Fragment>
        ) : (
          <FormHelperText error>{inviteError}</FormHelperText>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  work: state.getIn(['work', 'work']),
  isWorkLoading: state.getIn(['work', 'isWorkLoading']),
  workError: state.getIn(['work', 'workError']),
  invite: state.getIn(['work', 'invite']),
  isInviteLoading: state.getIn(['work', 'isInviteLoading']),
  inviteError: state.getIn(['work', 'inviteError']),
  isAcceptInviteLoading: state.getIn(['work', 'isAcceptInviteLoading']),
  acceptInviteError: state.getIn(['work', 'acceptInviteError']),
  relatedUsers: state.getIn(['work', 'relatedUsers']),
  endorsements: state.getIn(['work', 'endorsements']),
  endorsers: state.getIn(['work', 'endorsers']),
});

const mapDispatchToProps = dispatch => ({
  requestWork: payload => dispatch(requestWork(payload)),
  requestWorkRelatedUsers: eventId =>
    dispatch(requestWorkRelatedUsers(eventId)),
  requestEndorsements: workId => dispatch(requestEndorsements(workId)),
  requestEndorsers: (workSlug, userSlug) =>
    dispatch(requestEndorsers(workSlug, userSlug)),
  requestInviteInformation: token => dispatch(requestInviteInformation(token)),
  requestSocialLogin: (payload, type, invite) =>
    dispatch(requestSocialLogin(payload, type, invite)),
  requestAcceptInvite: payload => dispatch(requestAcceptInvite(payload)),
});

export default compose(
  injectSagas({ key: 'work', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(InvitePage);
